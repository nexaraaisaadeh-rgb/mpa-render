# MPA Motorsports — AI Dashboard & Chatbot

All-in-one platform for MPA Motorsports & Offroad:
- **Owner Dashboard** — KPIs, leads, appointments, conversations, activity feed
- **AI Chatbot Widget** — Embeddable on any website, sends leads to the dashboard
- **API Backend** — FastAPI + SQLite

## Structure

```
server.py                  ← FastAPI backend (API + serves dashboard + widget)
static/
  dashboard/               ← Owner dashboard (login + full dashboard UI)
    index.html
    base.css
    style.css
    app.js
  widget/                  ← Chatbot widget (embeddable on any website)
    widget.js
    widget.css
```

## Deploy on Render

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo
4. Render auto-detects settings from `render.yaml`
5. Click Deploy

## Login

- Username: `ryan` / Password: `mpa2026!`
- Username: `brad` / Password: `mpa2026!`

## Embed Chatbot on Any Website

Once deployed on Render, add this to any website:

```html
<script src="https://YOUR-APP.onrender.com/widget.js"></script>
```

The widget auto-detects the API URL from its own script source.
