#!/usr/bin/env python3
"""
MPA Motorsports — Unified Production Server
Serves: API (auth, leads, conversations, appointments, activity, stats)
        Dashboard (static files at /)
        Widget (widget.js + widget.css with CORS)
Deploy on Render, Railway, or any platform that runs Python.
"""

import hashlib
import json
import secrets
import sqlite3
import os
from contextlib import asynccontextmanager
from datetime import datetime, timedelta
from pathlib import Path

from fastapi import FastAPI, Depends, HTTPException, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional, List

# ── Config ────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent
DB_PATH = os.environ.get("DB_PATH", str(BASE_DIR / "mpa_data.db"))
PORT = int(os.environ.get("PORT", 8000))

# ── Database ──────────────────────────────────────────────────────────
def get_db():
    db = sqlite3.connect(DB_PATH, check_same_thread=False)
    db.row_factory = sqlite3.Row
    db.execute("PRAGMA journal_mode=WAL")
    return db

def init_db():
    db = get_db()
    db.executescript("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        display_name TEXT NOT NULL,
        email TEXT,
        role TEXT DEFAULT 'staff',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS sessions (
        token TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS password_resets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        token TEXT UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        used INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT,
        vehicle TEXT,
        service TEXT,
        usage_type TEXT,
        timeline TEXT,
        score TEXT DEFAULT 'Warm',
        status TEXT DEFAULT 'New',
        source TEXT DEFAULT 'chatbot',
        notes TEXT DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS conversations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT UNIQUE NOT NULL,
        customer_name TEXT,
        lead_captured INTEGER DEFAULT 0,
        topics TEXT DEFAULT '[]',
        summary TEXT,
        sentiment TEXT DEFAULT 'neutral',
        is_active INTEGER DEFAULT 1,
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ended_at TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        conversation_id INTEGER NOT NULL,
        role TEXT NOT NULL,
        text TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (conversation_id) REFERENCES conversations(id)
    );
    CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        service TEXT,
        scheduled_time TEXT,
        scheduled_day TEXT,
        status TEXT DEFAULT 'Scheduled',
        notes TEXT DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS activity_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        sentiment TEXT DEFAULT 'neutral',
        category TEXT DEFAULT 'general',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    def hash_pw(pw):
        return hashlib.sha256(pw.encode()).hexdigest()

    # Seed users
    users = [
        ("ryan", hash_pw("mpa2026!"), "Ryan", "ryan@mpamotorsports.com", "owner"),
        ("brad", hash_pw("mpa2026!"), "Brad", "brad@mpamotorsports.com", "staff"),
    ]
    for u in users:
        try:
            db.execute("INSERT INTO users (username, password_hash, display_name, email, role) VALUES (?,?,?,?,?)", u)
        except sqlite3.IntegrityError:
            pass

    db.commit()
    db.close()

# ── App ───────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app):
    init_db()
    yield

app = FastAPI(lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# ── Helpers ───────────────────────────────────────────────────────────
def hash_pw(pw: str) -> str:
    return hashlib.sha256(pw.encode()).hexdigest()

def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.split(" ")[1]
    db = get_db()
    row = db.execute("""
        SELECT s.user_id, u.username, u.display_name, u.role, u.email
        FROM sessions s JOIN users u ON s.user_id = u.id
        WHERE s.token = ? AND s.expires_at > datetime('now')
    """, (token,)).fetchone()
    db.close()
    if not row:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return dict(row)

# ── Models ────────────────────────────────────────────────────────────
class LoginRequest(BaseModel):
    username: str
    password: str

class ForgotPasswordRequest(BaseModel):
    username: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

class LeadCreate(BaseModel):
    name: str
    phone: Optional[str] = None
    vehicle: Optional[str] = None
    service: Optional[str] = None
    usage_type: Optional[str] = None
    timeline: Optional[str] = None
    score: Optional[str] = "Warm"
    source: Optional[str] = "chatbot"

class LeadUpdate(BaseModel):
    status: Optional[str] = None
    score: Optional[str] = None
    notes: Optional[str] = None

class ConversationCreate(BaseModel):
    session_id: str
    customer_name: Optional[str] = None

class MessageCreate(BaseModel):
    session_id: str
    role: str
    text: str

class ConversationUpdate(BaseModel):
    session_id: str
    customer_name: Optional[str] = None
    lead_captured: Optional[bool] = None
    topics: Optional[List[str]] = None
    summary: Optional[str] = None
    is_active: Optional[bool] = None

class ActivityCreate(BaseModel):
    text: str
    sentiment: Optional[str] = "neutral"

class AppointmentUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None

# ── Auth ──────────────────────────────────────────────────────────────
@app.post("/api/auth/login")
def login(req: LoginRequest):
    db = get_db()
    user = db.execute("SELECT * FROM users WHERE username = ?", (req.username.lower().strip(),)).fetchone()
    if not user or user["password_hash"] != hash_pw(req.password):
        db.close()
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = secrets.token_hex(32)
    expires = datetime.now() + timedelta(hours=24)
    db.execute("INSERT INTO sessions (token, user_id, expires_at) VALUES (?,?,?)",
               (token, user["id"], expires.isoformat()))
    db.commit()
    db.close()
    return {"token": token, "user": {"username": user["username"], "display_name": user["display_name"], "role": user["role"], "email": user["email"]}}

@app.post("/api/auth/logout")
def logout(user=Depends(get_current_user), authorization: str = Header(None)):
    token = authorization.split(" ")[1]
    db = get_db()
    db.execute("DELETE FROM sessions WHERE token = ?", (token,))
    db.commit()
    db.close()
    return {"ok": True}

@app.get("/api/auth/me")
def get_me(user=Depends(get_current_user)):
    return user

@app.post("/api/auth/forgot-password")
def forgot_password(req: ForgotPasswordRequest):
    db = get_db()
    user = db.execute("SELECT * FROM users WHERE username = ?", (req.username.lower().strip(),)).fetchone()
    if not user:
        db.close()
        return {"ok": True, "message": "If an account exists, a reset link has been sent."}
    reset_token = secrets.token_hex(20)
    expires = datetime.now() + timedelta(hours=1)
    db.execute("INSERT INTO password_resets (user_id, token, expires_at) VALUES (?,?,?)",
               (user["id"], reset_token, expires.isoformat()))
    db.commit()
    db.close()
    return {"ok": True, "message": "If an account exists, a reset link has been sent.", "_demo_token": reset_token}

@app.post("/api/auth/reset-password")
def reset_password(req: ResetPasswordRequest):
    db = get_db()
    reset = db.execute("""
        SELECT * FROM password_resets
        WHERE token = ? AND used = 0 AND expires_at > datetime('now')
    """, (req.token,)).fetchone()
    if not reset:
        db.close()
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    db.execute("UPDATE users SET password_hash = ? WHERE id = ?",
               (hash_pw(req.new_password), reset["user_id"]))
    db.execute("UPDATE password_resets SET used = 1 WHERE id = ?", (reset["id"],))
    db.execute("DELETE FROM sessions WHERE user_id = ?", (reset["user_id"],))
    db.commit()
    db.close()
    return {"ok": True, "message": "Password updated successfully."}

@app.post("/api/auth/change-password")
def change_password(req: ChangePasswordRequest, user=Depends(get_current_user)):
    db = get_db()
    u = db.execute("SELECT * FROM users WHERE id = ?", (user["user_id"],)).fetchone()
    if u["password_hash"] != hash_pw(req.current_password):
        db.close()
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    db.execute("UPDATE users SET password_hash = ? WHERE id = ?",
               (hash_pw(req.new_password), user["user_id"]))
    db.commit()
