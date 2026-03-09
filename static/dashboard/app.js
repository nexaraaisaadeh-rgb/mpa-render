/* === MPA Motorsports Owner Dashboard === */

/* eslint-disable no-unused-vars */

const API = "";  // Same origin — API is served from the same server
let authToken = null;
let currentUser = null;
let currentTab = "overview";
let expandedLeadId = null;
let expandedConvId = null;
let sidebarOpen = false;

// ─── SVG Icons ───
const ICONS = {
  overview: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  leads: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>',
  appointments: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  conversations: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>',
  activity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
  logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
  person: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4-4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  bot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  hamburger: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
  lead_captured: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
};

const MPA_LOGO = `<svg viewBox="0 0 200 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="MPA Motorsports" role="img" style="max-width:240px;">
  <rect x="0" y="2" width="28" height="28" rx="5" fill="#007AFF" opacity="0.15"/>
  <path d="M4 24V8h3.2l4.8 10.4L16.8 8H20v16h-2.8V13.6L13 22h-1.6L7 13.6V24H4z" fill="#007AFF"/>
  <path d="M28 24V8h7.2c1.6 0 2.8.4 3.6 1.2.8.8 1.2 1.8 1.2 3.2s-.4 2.4-1.2 3.2c-.8.8-2 1.2-3.6 1.2H31v7.2h-3zm3-10h3.6c.8 0 1.4-.2 1.8-.6.4-.4.6-1 .6-1.6s-.2-1.2-.6-1.6c-.4-.4-1-.6-1.8-.6H31v4.4z" fill="#f0f6fc"/>
  <path d="M46 24l6.4-16h3.2l6.4 16h-3.2l-1.4-3.6h-6.8L49.2 24H46zm5.4-6.4h4.8l-2.4-6.4-2.4 6.4z" fill="#f0f6fc"/>
  <text x="68" y="22" fill="#484f58" font-family="Inter, sans-serif" font-size="9" font-weight="600" letter-spacing="0.14em">MOTORSPORTS</text>
</svg>`;

const MPA_LOGO_SMALL = `<svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="MPA" role="img">
  <rect width="28" height="28" rx="6" fill="#007AFF"/>
  <path d="M4 22V6h2.8l4.2 9.2L15.2 6H18v16h-2.4V11.2L11.4 20h-1.2L6.4 11.2V22H4z" fill="#fff"/>
</svg>`;

// ─── API helpers ───
async function api(path, opts = {}) {
  const headers = { "Content-Type": "application/json" };
  if (authToken) headers["Authorization"] = `Bearer ${authToken}`;
  const res = await fetch(`${API}${path}`, { ...opts, headers: { ...headers, ...opts.headers } });
  if (res.status === 401) {
    authToken = null;
    currentUser = null;
    navigate("login");
    return null;
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Request failed");
  return data;
}

// ─── Router ───
function navigate(hash) {
  window.location.hash = hash;
}

function getRoute() {
  const hash = window.location.hash.replace("#", "") || "login";
  return hash;
}

function router() {
  const route = getRoute();
  const app = document.getElementById("app");

  if (route === "login" || route === "") {
    renderLogin(app);
  } else if (route === "forgot-password") {
    renderForgotPassword(app);
  } else if (route.startsWith("reset-password")) {
    renderResetPassword(app);
  } else if (route === "dashboard") {
    if (!authToken) {
      navigate("login");
      return;
    }
    renderDashboard(app);
  } else {
    navigate("login");
  }
}

window.addEventListener("hashchange", router);
window.addEventListener("DOMContentLoaded", router);

// ─── Login Page ───
function renderLogin(container) {
  container.innerHTML = `
    <div class="auth-layout">
      <div class="auth-bg-pattern"></div>
      <div class="auth-card">
        <div class="auth-logo">${MPA_LOGO}</div>
        <h1 class="auth-title">Welcome back</h1>
        <p class="auth-subtitle">Sign in to your owner dashboard</p>
        <div id="login-error"></div>
        <form id="login-form" autocomplete="on">
          <div class="form-group">
            <label class="form-label" for="username">Username</label>
            <input class="form-input" type="text" id="username" name="username" placeholder="Enter username" required autocomplete="username">
          </div>
          <div class="form-group">
            <label class="form-label" for="password">Password</label>
            <input class="form-input" type="password" id="password" name="password" placeholder="Enter password" required autocomplete="current-password">
          </div>
          <button type="submit" class="btn btn-primary btn-full" id="login-btn">Sign In</button>
        </form>
        <div class="auth-link">
          <button onclick="navigate('forgot-password')" type="button">Forgot Password?</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = document.getElementById("login-btn");
    const errDiv = document.getElementById("login-error");
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    btn.disabled = true;
    btn.innerHTML = '<div class="spinner"></div>';
    errDiv.innerHTML = "";

    try {
      const data = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password })
      });
      authToken = data.token;
      currentUser = data.user;
      navigate("dashboard");
    } catch (err) {
      const msg = err.message === 'Failed to fetch' ? 'Unable to connect to server. Check that the API is running.' : err.message;
      errDiv.innerHTML = `<div class="alert alert-error">${escapeHtml(msg)}</div>`;
    } finally {
      btn.disabled = false;
      btn.textContent = "Sign In";
    }
  });
}

// ─── Forgot Password ───
function renderForgotPassword(container) {
  container.innerHTML = `
    <div class="auth-layout">
      <div class="auth-bg-pattern"></div>
      <div class="auth-card">
        <div class="auth-logo">${MPA_LOGO}</div>
        <h1 class="auth-title">Reset Password</h1>
        <p class="auth-subtitle">Enter your username and we'll send a reset link to Ryan</p>
        <div id="forgot-msg"></div>
        <form id="forgot-form">
          <div class="form-group">
            <label class="form-label" for="forgot-username">Username</label>
            <input class="form-input" type="text" id="forgot-username" name="username" placeholder="Enter username" required>
          </div>
          <button type="submit" class="btn btn-primary btn-full" id="forgot-btn">Send Reset Link</button>
        </form>
        <div class="auth-link">
          <button onclick="navigate('login')" type="button">Back to Sign In</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById("forgot-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = document.getElementById("forgot-btn");
    const msgDiv = document.getElementById("forgot-msg");
    const username = document.getElementById("forgot-username").value.trim();

    btn.disabled = true;
    btn.innerHTML = '<div class="spinner"></div>';

    try {
      await api("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ username })
      });
      msgDiv.innerHTML = `<div class="alert alert-success">If an account exists, a password reset link has been emailed to Ryan.</div>`;
      btn.style.display = "none";
    } catch (err) {
      msgDiv.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
    } finally {
      btn.disabled = false;
      btn.textContent = "Send Reset Link";
    }
  });
}

// ─── Reset Password ───
function renderResetPassword(container) {
