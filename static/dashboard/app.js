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
  } else if (route === "verify-2fa") {
    render2FA(app);
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
let pending2FAToken = null;

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

      if (data.requires_2fa) {
        // Password correct — now need 2FA verification
        pending2FAToken = data.pending_token;
        navigate("verify-2fa");
      } else {
        // Direct login (fallback)
        authToken = data.token;
        currentUser = data.user;
        navigate("dashboard");
      }
    } catch (err) {
      const msg = err.message === 'Failed to fetch' ? 'Unable to connect to server. Check that the API is running.' : err.message;
      errDiv.innerHTML = `<div class="alert alert-error">${escapeHtml(msg)}</div>`;
    } finally {
      btn.disabled = false;
      btn.textContent = "Sign In";
    }
  });
}

// ─── 2FA Verification Page ───
function render2FA(container) {
  if (!pending2FAToken) {
    navigate("login");
    return;
  }

  container.innerHTML = `
    <div class="auth-layout">
      <div class="auth-bg-pattern"></div>
      <div class="auth-card">
        <div class="auth-logo">${MPA_LOGO}</div>
        <div style="text-align:center;margin-bottom:8px;">
          <div style="display:inline-flex;align-items:center;justify-content:center;width:56px;height:56px;background:linear-gradient(135deg,#3b82f6,#6366f1);border-radius:16px;margin-bottom:12px;">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:28px;height:28px;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          </div>
        </div>
        <h1 class="auth-title">Verification Required</h1>
        <p class="auth-subtitle">A 6-digit code has been sent to the email on file. Enter it below to continue.</p>
        <div id="2fa-error"></div>
        <form id="2fa-form">
          <div class="form-group">
            <label class="form-label" for="2fa-code">Verification Code</label>
            <input class="form-input" type="text" id="2fa-code" name="code" placeholder="000000" required maxlength="6" pattern="[0-9]{6}" inputmode="numeric" autocomplete="one-time-code"
              style="text-align:center;font-size:24px;letter-spacing:8px;font-weight:bold;">
          </div>
          <button type="submit" class="btn btn-primary btn-full" id="2fa-btn">Verify &amp; Sign In</button>
        </form>
        <div class="auth-link" style="margin-top:16px;">
          <button onclick="pending2FAToken=null;navigate('login')" type="button">Back to Sign In</button>
        </div>
      </div>
    </div>
  `;

  // Auto-focus the code input
  document.getElementById("2fa-code").focus();

  document.getElementById("2fa-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = document.getElementById("2fa-btn");
    const errDiv = document.getElementById("2fa-error");
    const code = document.getElementById("2fa-code").value.trim();

    btn.disabled = true;
    btn.innerHTML = '<div class="spinner"></div>';
    errDiv.innerHTML = "";

    try {
      const data = await api("/api/auth/verify-2fa", {
        method: "POST",
        body: JSON.stringify({ pending_token: pending2FAToken, code })
      });
      authToken = data.token;
      currentUser = data.user;
      pending2FAToken = null;
      navigate("dashboard");
    } catch (err) {
      errDiv.innerHTML = `<div class="alert alert-error">${escapeHtml(err.message)}</div>`;
    } finally {
      btn.disabled = false;
      btn.innerHTML = 'Verify &amp; Sign In';
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
        <p class="auth-subtitle">Enter your username and the email address associated with this account for verification</p>
        <div id="forgot-msg"></div>
        <form id="forgot-form">
          <div class="form-group">
            <label class="form-label" for="forgot-username">Username</label>
            <input class="form-input" type="text" id="forgot-username" name="username" placeholder="Enter username" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="forgot-email">Account Email</label>
            <input class="form-input" type="email" id="forgot-email" name="email" placeholder="Enter email on file" required>
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
    const email = document.getElementById("forgot-email").value.trim();

    btn.disabled = true;
    btn.innerHTML = '<div class="spinner"></div>';

    try {
      await api("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ username, email })
      });
      msgDiv.innerHTML = `<div class="alert alert-success">If the account and email match, a password reset link has been sent.</div>`;
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
  const params = new URLSearchParams(window.location.hash.split("?")[1]);
  const token = params.get("token") || "";

  container.innerHTML = `
    <div class="auth-layout">
      <div class="auth-bg-pattern"></div>
      <div class="auth-card">
        <div class="auth-logo">${MPA_LOGO}</div>
        <h1 class="auth-title">Set New Password</h1>
        <p class="auth-subtitle">Choose a strong password for your account</p>
        <div id="reset-msg"></div>
        <form id="reset-form">
          <div class="form-group">
            <label class="form-label" for="new-password">New Password</label>
            <input class="form-input" type="password" id="new-password" placeholder="Enter new password" required minlength="6">
          </div>
          <div class="form-group">
            <label class="form-label" for="confirm-password">Confirm Password</label>
            <input class="form-input" type="password" id="confirm-password" placeholder="Confirm new password" required>
          </div>
          <button type="submit" class="btn btn-primary btn-full" id="reset-btn">Reset Password</button>
        </form>
        <div class="auth-link">
          <button onclick="navigate('login')" type="button">Back to Sign In</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById("reset-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = document.getElementById("reset-btn");
    const msgDiv = document.getElementById("reset-msg");
    const newPw = document.getElementById("new-password").value;
    const confirmPw = document.getElementById("confirm-password").value;

    if (newPw !== confirmPw) {
      msgDiv.innerHTML = `<div class="alert alert-error">Passwords do not match</div>`;
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<div class="spinner"></div>';

    try {
      await api("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, new_password: newPw })
      });
      msgDiv.innerHTML = `<div class="alert alert-success">Password reset successfully. You can now sign in.</div>`;
      setTimeout(() => navigate("login"), 2000);
    } catch (err) {
      msgDiv.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
    } finally {
      btn.disabled = false;
      btn.textContent = "Reset Password";
    }
  });
}

// ─── Dashboard ───
function renderDashboard(container) {
  const initials = currentUser ? currentUser.display_name.split(" ").map(w => w[0]).join("") : "?";

  container.innerHTML = `
    <div class="dashboard-layout">
      <div class="sidebar-overlay" id="sidebar-overlay"></div>
      <nav class="sidebar" id="sidebar" aria-label="Main navigation">
        <div class="sidebar-header">
          ${MPA_LOGO_SMALL}
          <div class="sidebar-brand-text">
            <span class="sidebar-brand-name">MPA Motorsports</span>
            <span class="sidebar-brand-tagline">Owner Dashboard</span>
          </div>
        </div>
        <div class="sidebar-nav">
          <div class="nav-section-label">Menu</div>
          <div class="nav-item active" data-tab="overview" role="button" tabindex="0" aria-label="Overview">
            ${ICONS.overview}
            <span>Overview</span>
          </div>
          <div class="nav-item" data-tab="leads" role="button" tabindex="0" aria-label="Leads">
            ${ICONS.leads}
            <span>Leads</span>
          </div>
          <div class="nav-item" data-tab="appointments" role="button" tabindex="0" aria-label="Appointments">
            ${ICONS.appointments}
            <span>Appointments</span>
          </div>
          <div class="nav-item" data-tab="conversations" role="button" tabindex="0" aria-label="Conversations">
            ${ICONS.conversations}
            <span>Conversations</span>
          </div>
          <div class="nav-item" data-tab="activity" role="button" tabindex="0" aria-label="Activity">
            ${ICONS.activity}
            <span>Activity</span>
          </div>
        </div>
        <div class="sidebar-footer">
          <div class="sidebar-user">
            <div class="user-avatar">${initials}</div>
            <div class="user-info">
              <div class="user-name">${currentUser ? currentUser.display_name : ""}</div>
              <div class="user-role">${currentUser ? currentUser.role : ""}</div>
            </div>
          </div>
          <button class="logout-btn" id="logout-btn" aria-label="Logout">
            ${ICONS.logout}
            <span>Log out</span>
          </button>
        </div>
      </nav>

      <header class="dashboard-header">
        <div style="display:flex;align-items:center;gap:12px;">
          <button class="mobile-menu-btn" id="mobile-menu-btn" aria-label="Open menu">
            ${ICONS.hamburger}
          </button>
          <h1 class="header-title" id="header-title">Overview</h1>
        </div>
        <div class="header-right">
          <span class="header-timestamp" id="header-time"></span>
          <div class="header-avatar" title="${currentUser ? currentUser.display_name : ""}">${initials}</div>
        </div>
      </header>

      <main class="dashboard-main" id="main-content">
        <div id="tab-content"></div>

      </main>
    </div>
  `;

  // Update time
  updateHeaderTime();
  setInterval(updateHeaderTime, 60000);

  // Navigation
  document.querySelectorAll(".nav-item[data-tab]").forEach(item => {
    item.addEventListener("click", () => switchTab(item.dataset.tab));
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        switchTab(item.dataset.tab);
      }
    });
  });

  // Logout
  document.getElementById("logout-btn").addEventListener("click", async () => {
    try { await api("/api/auth/logout", { method: "POST" }); } catch (_e) { /* ignore */ }
    authToken = null;
    currentUser = null;
    navigate("login");
  });

  // Mobile menu
  document.getElementById("mobile-menu-btn").addEventListener("click", toggleSidebar);
  document.getElementById("sidebar-overlay").addEventListener("click", toggleSidebar);

  // Load default tab
  switchTab("overview");
}

function toggleSidebar() {
  sidebarOpen = !sidebarOpen;
  document.getElementById("sidebar").classList.toggle("open", sidebarOpen);
  document.getElementById("sidebar-overlay").classList.toggle("visible", sidebarOpen);
}

function updateHeaderTime() {
  const el = document.getElementById("header-time");
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function switchTab(tab) {
  currentTab = tab;
  expandedLeadId = null;
  expandedConvId = null;

  // Close mobile sidebar
  if (sidebarOpen) toggleSidebar();

  // Update nav highlight
  document.querySelectorAll(".nav-item[data-tab]").forEach(item => {
    item.classList.toggle("active", item.dataset.tab === tab);
  });

  // Update header
  const titles = { overview: "Overview", leads: "Leads", appointments: "Appointments", conversations: "Conversations", activity: "Activity" };
  const headerTitle = document.getElementById("header-title");
  if (headerTitle) headerTitle.textContent = titles[tab] || "Dashboard";

  // Render tab content
  const content = document.getElementById("tab-content");
  if (!content) return;

  switch (tab) {
    case "overview": renderOverview(content); break;
    case "leads": renderLeads(content); break;
    case "appointments": renderAppointments(content); break;
    case "conversations": renderConversations(content); break;
    case "activity": renderActivity(content); break;
  }
}

// ─── Overview Tab ───
async function renderOverview(container) {
  container.innerHTML = `
    <div class="view-enter">
      <div class="kpi-grid">
        ${Array(5).fill('<div class="skeleton skeleton-kpi"></div>').join("")}
      </div>
      <div class="overview-grid">
        <div class="section-card"><div class="section-body">${skeletonLines(4)}</div></div>
        <div class="section-card"><div class="section-body">${skeletonLines(4)}</div></div>
      </div>
    </div>
  `;

  try {
    const [stats, activityData] = await Promise.all([
      api("/api/stats"),
      api("/api/activity")
    ]);

    if (!stats) return;

    const recentActivity = (activityData || []).slice(0, 8);
    const hotLeads = stats.hot_leads || 0;
    const warmLeads = stats.warm_leads || 0;
    const coldLeads = Math.max(0, (stats.total_leads || 0) - hotLeads - warmLeads);
    const maxScore = Math.max(hotLeads, warmLeads, coldLeads, 1);
    const leadsCaptured = stats.leads_captured || 0;
    const conversionRate = stats.conversion_rate || 0;
    const avgResponseTime = stats.avg_response_time || '<30s';

    container.innerHTML = `
      <div class="view-enter">
        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-label">Total Leads</div>
            <div class="kpi-value">${stats.total_leads}</div>
            <div class="kpi-sub">${leadsCaptured} captured by AI</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">New Today</div>
            <div class="kpi-value accent">${stats.new_leads_today}</div>
            <div class="kpi-sub">leads added today</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Appointments</div>
            <div class="kpi-value">${stats.appointments_this_week}</div>
            <div class="kpi-sub">scheduled this week</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">AI Response Rate</div>
            <div class="kpi-value accent">${stats.ai_response_rate}%</div>
            <div class="kpi-sub">avg ${avgResponseTime}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Time Saved</div>
            <div class="kpi-value">${stats.time_saved_hours}h</div>
            <div class="kpi-sub">by AI automation</div>
          </div>
        </div>

        <div class="overview-grid">
          <div>
            <div class="section-card">
              <div class="section-header">
                <span class="section-title">Lead Score Breakdown</span>
              </div>
              <div class="section-body">
                <div class="score-bar-row">
                  <span class="score-bar-label">Hot</span>
                  <div class="score-bar-track"><div class="score-bar-fill hot" style="width:${(hotLeads / maxScore) * 100}%"></div></div>
                  <span class="score-bar-count">${hotLeads}</span>
                </div>
                <div class="score-bar-row">
                  <span class="score-bar-label">Warm</span>
                  <div class="score-bar-track"><div class="score-bar-fill warm" style="width:${(warmLeads / maxScore) * 100}%"></div></div>
                  <span class="score-bar-count">${warmLeads}</span>
                </div>
                <div class="score-bar-row">
                  <span class="score-bar-label">Cold</span>
                  <div class="score-bar-track"><div class="score-bar-fill cold" style="width:${(coldLeads / maxScore) * 100}%"></div></div>
                  <span class="score-bar-count">${coldLeads}</span>
                </div>
              </div>
            </div>
            <div class="section-card">
              <div class="section-header">
                <span class="section-title">Quick Stats</span>
              </div>
              <div class="section-body">
                <div class="quick-stats-grid">
                  <div class="quick-stat">
                    <div class="quick-stat-value">${stats.total_conversations}</div>
                    <div class="quick-stat-label">Conversations</div>
                  </div>
                  <div class="quick-stat">
                    <div class="quick-stat-value">${stats.total_messages}</div>
                    <div class="quick-stat-label">Messages</div>
                  </div>
                  <div class="quick-stat">
                    <div class="quick-stat-value">${conversionRate}%</div>
                    <div class="quick-stat-label">Conversion</div>
                  </div>
                  <div class="quick-stat">
                    <div class="quick-stat-value">${leadsCaptured}</div>
                    <div class="quick-stat-label">AI Captured</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="section-card">
              <div class="section-header">
                <span class="section-title">Recent Activity</span>
              </div>
              <div class="section-body" style="padding:0;">
                ${recentActivity.length > 0 ? recentActivity.map(a => `
                  <div class="activity-item" style="padding: 12px 20px;">
                    <div class="activity-dot ${a.sentiment || 'neutral'}"></div>
                    <span class="activity-text">${escapeHtml(a.text)}</span>
                    <span class="activity-time">${formatTime(a.created_at)}</span>
                  </div>
                `).join("") : '<div class="empty-state"><p>No recent activity</p></div>'}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div class="alert alert-error">Failed to load dashboard data: ${escapeHtml(err.message)}</div>`;
  }
}

// ─── Leads Tab ───
let leadsData = [];
let leadsFilter = { score: "all", status: "all", search: "" };

async function renderLeads(container) {
  container.innerHTML = `<div class="view-enter"><div class="section-card"><div class="section-body">${skeletonLines(8)}</div></div></div>`;

  try {
    leadsData = await api("/api/leads") || [];
    leadsFilter = { score: "all", status: "all", search: "" };
    renderLeadsContent(container);
  } catch (err) {
    container.innerHTML = `<div class="alert alert-error">Failed to load leads: ${escapeHtml(err.message)}</div>`;
  }
}

function renderLeadsContent(container) {
  const filtered = leadsData.filter(l => {
    if (leadsFilter.score !== "all" && l.score?.toLowerCase() !== leadsFilter.score) return false;
    if (leadsFilter.status !== "all" && l.status?.toLowerCase() !== leadsFilter.status) return false;
    if (leadsFilter.search && !l.name?.toLowerCase().includes(leadsFilter.search.toLowerCase()) && !l.vehicle?.toLowerCase().includes(leadsFilter.search.toLowerCase())) return false;
    return true;
  });

  container.innerHTML = `
    <div class="view-enter">
      <div class="filter-bar">
        <div class="filter-group" role="group" aria-label="Score filter">
          ${["all","hot","warm","cold"].map(s => `<button class="filter-btn ${leadsFilter.score === s ? 'active' : ''}" data-filter="score" data-value="${s}">${s === 'all' ? 'All Scores' : capitalize(s)}</button>`).join("")}
        </div>
        <div class="filter-group" role="group" aria-label="Status filter">
          ${["all","new","contacted","booked"].map(s => `<button class="filter-btn ${leadsFilter.status === s ? 'active' : ''}" data-filter="status" data-value="${s}">${s === 'all' ? 'All Status' : capitalize(s)}</button>`).join("")}
        </div>
        <input class="search-input" type="search" placeholder="Search leads..." value="${leadsFilter.search}" id="lead-search" aria-label="Search leads">
      </div>

      <div class="section-card">
        <div class="data-table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Vehicle</th>
                <th>Service</th>
                <th>Score</th>
                <th>Status</th>
                <th>Timeline</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.length > 0 ? filtered.map(lead => `
                <tr data-lead-id="${lead.id}" class="${expandedLeadId === lead.id ? 'expanded' : ''}">
                  <td>${escapeHtml(lead.name || "—")}</td>
                  <td>${escapeHtml(lead.vehicle || "—")}</td>
                  <td>${escapeHtml(lead.service || "—")}</td>
                  <td><span class="badge badge-${(lead.score || 'cold').toLowerCase()}">${capitalize(lead.score || "cold")}</span></td>
                  <td><span class="badge badge-${(lead.status || 'new').toLowerCase()}">${capitalize(lead.status || "new")}</span></td>
                  <td>${escapeHtml(lead.timeline || "—")}</td>
                  <td>${escapeHtml(lead.phone || "—")}</td>
                </tr>
                ${expandedLeadId === lead.id ? `<tr class="expanded-row"><td colspan="7"><div class="expanded-content">
                  <div class="detail-item"><label>Usage Type</label><span>${escapeHtml(lead.usage_type || "—")}</span></div>
                  <div class="detail-item"><label>Source</label><span>${escapeHtml(lead.source || "—")}</span></div>
                  <div class="detail-item"><label>Created</label><span>${formatDate(lead.created_at)}</span></div>
                  <div class="detail-item"><label>Notes</label><span>${escapeHtml(lead.notes || "None")}</span></div>
                  <div class="detail-item">
                    <label>Change Score</label>
                    <select data-lead-id="${lead.id}" data-field="score" aria-label="Change lead score">
                      ${["hot","warm","cold"].map(s => `<option value="${s}" ${lead.score?.toLowerCase() === s ? 'selected' : ''}>${capitalize(s)}</option>`).join("")}
                    </select>
                  </div>
                  <div class="detail-item">
                    <label>Change Status</label>
                    <select data-lead-id="${lead.id}" data-field="status" aria-label="Change lead status">
                      ${["new","contacted","booked"].map(s => `<option value="${s}" ${lead.status?.toLowerCase() === s ? 'selected' : ''}>${capitalize(s)}</option>`).join("")}
                    </select>
                  </div>
                </div></td></tr>` : ""}
              `).join("") : `<tr><td colspan="7"><div class="empty-state"><p>No leads match your filters</p></div></td></tr>`}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  // Event: filter buttons
  container.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const field = btn.dataset.filter;
      leadsFilter[field] = btn.dataset.value;
      renderLeadsContent(container);
    });
  });

  // Event: search
  const searchInput = document.getElementById("lead-search");
  if (searchInput) {
    searchInput.addEventListener("input", debounce((e) => {
      leadsFilter.search = e.target.value;
      renderLeadsContent(container);
    }, 250));
    searchInput.focus();
  }

  // Event: row click to expand
  container.querySelectorAll("tr[data-lead-id]").forEach(row => {
    row.addEventListener("click", () => {
      const id = parseInt(row.dataset.leadId);
      expandedLeadId = expandedLeadId === id ? null : id;
      renderLeadsContent(container);
    });
  });

  // Event: inline edit
  container.querySelectorAll("select[data-lead-id]").forEach(sel => {
    sel.addEventListener("click", (e) => e.stopPropagation());
    sel.addEventListener("change", async (e) => {
      const id = parseInt(sel.dataset.leadId);
      const field = sel.dataset.field;
      const value = sel.value;
      try {
        await api(`/api/leads/${id}`, { method: "PATCH", body: JSON.stringify({ [field]: value }) });
        const lead = leadsData.find(l => l.id === id);
        if (lead) lead[field] = value;
        renderLeadsContent(container);
      } catch (err) {
        // silently fail
      }
    });
  });
}

// ─── Appointments Tab ───
async function renderAppointments(container) {
  container.innerHTML = `<div class="view-enter"><div class="section-card"><div class="section-body">${skeletonLines(6)}</div></div></div>`;

  try {
    const appts = await api("/api/appointments") || [];
    // Gather unique days from data in order
    const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Today", "Tomorrow"];
    const allDays = new Set();
    appts.forEach(a => allDays.add(a.scheduled_day || "Unscheduled"));
    const days = [...allDays].sort((a, b) => {
      const ia = dayOrder.indexOf(a);
      const ib = dayOrder.indexOf(b);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });
    if (days.length === 0) days.push("No Appointments");
    const byDay = {};
    days.forEach(d => byDay[d] = []);
    appts.forEach(a => {
      const day = a.scheduled_day || "Unscheduled";
      if (byDay[day]) byDay[day].push(a);
    });

    container.innerHTML = `
      <div class="view-enter">
        <div class="appointments-week">
          ${days.map(day => `
            <div class="day-column">
              <div class="day-header">${day === 'Tomorrow' ? 'Tomorrow' : day === 'Today' ? 'Today' : day.slice(0, 3)}</div>
              ${byDay[day].length > 0 ? byDay[day].map(a => `
                <div class="appt-card" data-appt-id="${a.id}" role="button" tabindex="0" aria-label="${a.name} appointment">
                  <div class="appt-name">${escapeHtml(a.name)}</div>
                  <div class="appt-service">${escapeHtml(a.service)}</div>
                  <div class="appt-time">${escapeHtml(a.scheduled_time || "")}</div>
                  <span class="badge badge-${(a.status || 'scheduled').toLowerCase()}">${capitalize(a.status || "scheduled")}</span>
                </div>
              `).join("") : '<div style="text-align:center;padding:16px;font-size:12px;color:var(--text-faint);">No appts</div>'}
            </div>
          `).join("")}
        </div>
      </div>
    `;

    // Click appointment for detail modal
    container.querySelectorAll(".appt-card").forEach(card => {
      const handler = () => {
        const id = parseInt(card.dataset.apptId);
        const appt = appts.find(a => a.id === id);
        if (appt) showApptModal(appt);
      };
      card.addEventListener("click", handler);
      card.addEventListener("keydown", (e) => { if (e.key === "Enter") handler(); });
    });
  } catch (err) {
    container.innerHTML = `<div class="alert alert-error">Failed to load appointments: ${escapeHtml(err.message)}</div>`;
  }
}

function showApptModal(appt) {
  const existing = document.querySelector(".appt-detail-modal");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.className = "appt-detail-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-label", "Appointment details");
  modal.innerHTML = `
    <div class="appt-detail-content">
      <h3>${escapeHtml(appt.name)}</h3>
      <div class="appt-detail-row"><span class="appt-detail-label">Service</span><span class="appt-detail-value">${escapeHtml(appt.service)}</span></div>
      <div class="appt-detail-row"><span class="appt-detail-label">Day</span><span class="appt-detail-value">${escapeHtml(appt.scheduled_day || "")}</span></div>
      <div class="appt-detail-row"><span class="appt-detail-label">Time</span><span class="appt-detail-value">${escapeHtml(appt.scheduled_time || "")}</span></div>
      <div class="appt-detail-row"><span class="appt-detail-label">Status</span><span class="appt-detail-value"><span class="badge badge-${(appt.status || 'scheduled').toLowerCase()}">${capitalize(appt.status || "scheduled")}</span></span></div>
      <textarea class="appt-notes-input" placeholder="Add notes..." aria-label="Appointment notes">${escapeHtml(appt.notes || "")}</textarea>
      <div class="appt-modal-actions">
        <button class="btn btn-ghost btn-sm" id="appt-modal-close">Cancel</button>
        <button class="btn btn-primary btn-sm" id="appt-modal-save">Save Notes</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.addEventListener("click", (e) => { if (e.target === modal) modal.remove(); });
  modal.querySelector("#appt-modal-close").addEventListener("click", () => modal.remove());
  modal.querySelector("#appt-modal-save").addEventListener("click", async () => {
    const notes = modal.querySelector(".appt-notes-input").value;
    try {
      await api(`/api/appointments/${appt.id}`, { method: "PATCH", body: JSON.stringify({ notes }) });
      appt.notes = notes;
    } catch (_e) { /* ignore */ }
    modal.remove();
  });

  // Focus trap
  modal.querySelector(".appt-notes-input").focus();
}

// ─── Conversations Tab ───
async function renderConversations(container) {
  container.innerHTML = `<div class="view-enter"><div class="section-card"><div class="section-body">${skeletonLines(6)}</div></div></div>`;

  try {
    const convs = await api("/api/conversations") || [];

    container.innerHTML = `
      <div class="view-enter">
        <div class="conv-list">
          ${convs.length > 0 ? convs.map(c => `
            <div class="conv-card" data-conv-id="${c.id}" role="button" tabindex="0" aria-label="Conversation with ${escapeHtml(c.customer_name || 'Anonymous Visitor')}">
              <div class="conv-card-header">
                <span class="conv-customer">${escapeHtml(c.customer_name || "Anonymous Visitor")}</span>
                <div class="conv-meta">
                  ${c.lead_captured ? `<span class="badge badge-positive" style="display:inline-flex;align-items:center;gap:4px;">${ICONS.lead_captured} Lead</span>` : ""}
                  <span class="badge badge-${c.sentiment || 'neutral'}">${capitalize(c.sentiment || "neutral")}</span>
                  <span style="font-size:11px;color:var(--text-faint);">${c.messages ? c.messages.length : 0} msgs</span>
                </div>
              </div>
              <div class="conv-summary">${escapeHtml(c.summary || "No summary available")}</div>
              <div class="conv-tags">
                ${(c.topics || []).map(t => `<span class="conv-tag">${escapeHtml(t)}</span>`).join("")}
              </div>
              ${expandedConvId === c.id && c.messages ? `
                <div class="chat-transcript">
                  ${c.messages.map(m => `
                    <div class="chat-bubble ${m.role === 'assistant' || m.role === 'bot' ? 'bot' : 'user'}">
                      <div>${escapeHtml(m.text)}</div>
                      <div class="chat-bubble-time">${formatTime(m.timestamp)}</div>
                    </div>
                  `).join("")}
                </div>
              ` : ""}
            </div>
          `).join("") : '<div class="empty-state"><p>No conversations yet</p></div>'}
        </div>
      </div>
    `;

    // Click to expand conversation
    container.querySelectorAll(".conv-card").forEach(card => {
      const handler = () => {
        const id = parseInt(card.dataset.convId);
        expandedConvId = expandedConvId === id ? null : id;
        renderConversationsContent(container, convs);
      };
      card.addEventListener("click", handler);
      card.addEventListener("keydown", (e) => { if (e.key === "Enter") handler(); });
    });
  } catch (err) {
    container.innerHTML = `<div class="alert alert-error">Failed to load conversations: ${escapeHtml(err.message)}</div>`;
  }
}

function renderConversationsContent(container, convs) {
  container.innerHTML = `
    <div class="conv-list">
      ${convs.map(c => `
        <div class="conv-card" data-conv-id="${c.id}" role="button" tabindex="0" aria-label="Conversation with ${escapeHtml(c.customer_name || 'Anonymous Visitor')}">
          <div class="conv-card-header">
            <span class="conv-customer">${escapeHtml(c.customer_name || "Anonymous Visitor")}</span>
            <div class="conv-meta">
              ${c.lead_captured ? `<span class="badge badge-positive" style="display:inline-flex;align-items:center;gap:4px;">${ICONS.lead_captured} Lead</span>` : ""}
              <span class="badge badge-${c.sentiment || 'neutral'}">${capitalize(c.sentiment || "neutral")}</span>
              <span style="font-size:11px;color:var(--text-faint);">${c.messages ? c.messages.length : 0} msgs</span>
            </div>
          </div>
          <div class="conv-summary">${escapeHtml(c.summary || "No summary available")}</div>
          <div class="conv-tags">
            ${(c.topics || []).map(t => `<span class="conv-tag">${escapeHtml(t)}</span>`).join("")}
          </div>
          ${expandedConvId === c.id && c.messages ? `
            <div class="chat-transcript">
              ${c.messages.map(m => `
                <div class="chat-bubble ${m.role === 'assistant' || m.role === 'bot' ? 'bot' : 'user'}">
                  <div>${escapeHtml(m.text)}</div>
                  <div class="chat-bubble-time">${formatTime(m.timestamp)}</div>
                </div>
              `).join("")}
            </div>
          ` : ""}
        </div>
      `).join("")}
    </div>
  `;

  container.querySelectorAll(".conv-card").forEach(card => {
    const handler = () => {
      const id = parseInt(card.dataset.convId);
      expandedConvId = expandedConvId === id ? null : id;
      renderConversationsContent(container, convs);
    };
    card.addEventListener("click", handler);
    card.addEventListener("keydown", (e) => { if (e.key === "Enter") handler(); });
  });
}

// ─── Activity Tab ───
async function renderActivity(container) {
  container.innerHTML = `<div class="view-enter"><div class="section-card"><div class="section-body">${skeletonLines(10)}</div></div></div>`;

  try {
    const activities = await api("/api/activity") || [];

    container.innerHTML = `
      <div class="view-enter">
        <div class="section-card">
          <div class="section-header">
            <span class="section-title">Activity Feed</span>
            <span style="font-size:12px;color:var(--text-faint);">${activities.length} events</span>
          </div>
          <div class="activity-feed-full">
            ${activities.length > 0 ? activities.map(a => {
              const cat = getCategoryFromText(a.text, a.category);
              return `
                <div class="activity-feed-item">
                  <div class="activity-icon ${cat}">
                    ${cat === 'lead' ? ICONS.person : cat === 'chatbot' ? ICONS.bot : ICONS.info}
                  </div>
                  <div style="flex:1;">
                    <div class="activity-feed-text">${escapeHtml(a.text)}</div>
                  </div>
                  <div style="display:flex;align-items:center;gap:8px;">
                    <div class="activity-dot ${a.sentiment || 'neutral'}" style="margin:0;"></div>
                    <span class="activity-feed-time">${formatTime(a.created_at)}</span>
                  </div>
                </div>
              `;
            }).join("") : '<div class="empty-state"><p>No activity recorded yet</p></div>'}
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div class="alert alert-error">Failed to load activity: ${escapeHtml(err.message)}</div>`;
  }
}

function getCategoryFromText(text, category) {
  if (category) return category;
  const lower = (text || "").toLowerCase();
  if (lower.includes("lead") || lower.includes("customer") || lower.includes("captured")) return "lead";
  if (lower.includes("chat") || lower.includes("bot") || lower.includes("conversation") || lower.includes("message")) return "chatbot";
  return "general";
}

// ─── Utilities ───
function escapeHtml(str) {
  if (!str) return "";
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatTime(dateStr) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return "just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch (_e) {
    return dateStr;
  }
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
  } catch (_e) {
    return dateStr;
  }
}

function skeletonLines(count) {
  return Array(count).fill(0).map((_, i) =>
    `<div class="skeleton skeleton-line ${i % 3 === 0 ? 'short' : i % 3 === 1 ? 'medium' : ''}" style="animation-delay:${i * 80}ms"></div>`
  ).join("");
}

function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
