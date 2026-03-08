/* === MPA Motorsports Owner Dashboard === */

// ─── Mock API Layer (self-contained demo) ───
const MOCK_DATA = {
  users: [
    { id: 1, username: "ryan", password_hash: "mpa2026!", display_name: "Ryan", email: "ryan@mpamotorsports.com", role: "owner" },
    { id: 2, username: "brad", password_hash: "mpa2026!", display_name: "Brad", email: "brad@mpamotorsports.com", role: "staff" }
  ],
  leads: [
    { id: 1, name: "Mike Thompson", phone: "(248) 555-0142", vehicle: "2023 Jeep Wrangler Rubicon", service: "Lift Kit Installation", usage_type: "Both", timeline: "This week", score: "Hot", status: "Contacted", source: "chatbot", notes: "", created_at: "2026-03-08 09:15:00" },
    { id: 2, name: "Sarah Mitchell", phone: "(313) 555-0198", vehicle: "2022 Ford F-150 XLT", service: "Alignment & Tire Balance", usage_type: "Daily Driver", timeline: "Next week", score: "Warm", status: "Contacted", source: "chatbot", notes: "", created_at: "2026-03-08 08:42:00" },
    { id: 3, name: "James Rodriguez", phone: "(248) 555-0267", vehicle: "2024 Chevy Silverado 1500", service: "3\" Leveling Kit", usage_type: "Daily Driver", timeline: "This week", score: "Hot", status: "Booked", source: "chatbot", notes: "", created_at: "2026-03-07 16:30:00" },
    { id: 4, name: "Chris Patel", phone: "(734) 555-0331", vehicle: "2021 Toyota Tacoma TRD", service: "LED Light Bar + Pods", usage_type: "Trail Rig", timeline: "Flexible", score: "Warm", status: "New", source: "chatbot", notes: "", created_at: "2026-03-07 14:20:00" },
    { id: 5, name: "Dave Williams", phone: "(586) 555-0455", vehicle: "2020 Ram 1500 Laramie", service: "Exhaust System", usage_type: "Daily Driver", timeline: "Just looking", score: "Cold", status: "Contacted", source: "chatbot", notes: "", created_at: "2026-03-07 11:05:00" },
    { id: 6, name: "Amanda Foster", phone: "(248) 555-0512", vehicle: "2023 Ford Bronco Badlands", service: "Wheels & Tires Package", usage_type: "Both", timeline: "Next week", score: "Hot", status: "Booked", source: "chatbot", notes: "", created_at: "2026-03-06 15:45:00" },
    { id: 7, name: "Tyler Chen", phone: "(248) 555-0678", vehicle: "2024 Toyota 4Runner TRD Pro", service: "Rock Sliders + Skid Plates", usage_type: "Trail Rig", timeline: "This week", score: "Hot", status: "New", source: "chatbot", notes: "", created_at: "2026-03-06 10:30:00" },
    { id: 8, name: "Jessica Park", phone: "(313) 555-0744", vehicle: "2022 Jeep Gladiator", service: "Custom Bumper Build", usage_type: "Both", timeline: "Next month", score: "Warm", status: "New", source: "chatbot", notes: "", created_at: "2026-03-05 13:15:00" }
  ],
  appointments: [
    { id: 1, name: "James Rodriguez", service: "Leveling Kit Install \u2014 Silverado", scheduled_time: "9:00 AM", scheduled_day: "Monday", status: "Scheduled", notes: "", created_at: "2026-03-08" },
    { id: 2, name: "Amanda Foster", service: "Wheel & Tire Package \u2014 Bronco", scheduled_time: "10:30 AM", scheduled_day: "Monday", status: "Scheduled", notes: "", created_at: "2026-03-08" },
    { id: 3, name: "Mike Thompson", service: "Lift Kit Consult \u2014 Wrangler", scheduled_time: "1:00 PM", scheduled_day: "Tuesday", status: "Scheduled", notes: "", created_at: "2026-03-08" },
    { id: 4, name: "Brian Clarke", service: "Alignment \u2014 F-250", scheduled_time: "9:00 AM", scheduled_day: "Wednesday", status: "Scheduled", notes: "", created_at: "2026-03-08" },
    { id: 5, name: "Kevin Moore", service: "Brake Service \u2014 Sierra", scheduled_time: "2:30 PM", scheduled_day: "Thursday", status: "Scheduled", notes: "", created_at: "2026-03-08" },
    { id: 6, name: "Tyler Chen", service: "Armor Install \u2014 4Runner", scheduled_time: "10:00 AM", scheduled_day: "Friday", status: "Scheduled", notes: "", created_at: "2026-03-08" }
  ],
  conversations: [
    {
      id: 1, session_id: "demo-1", customer_name: "Mike Thompson", lead_captured: 1,
      topics: ["lift_kits", "wheels_tires"],
      summary: "Mike Thompson inquired about lift kits + wheels & tires for Wrangler Rubicon \u2014 lead captured",
      sentiment: "positive", is_active: 0, started_at: "2026-03-08 09:12:00", ended_at: null,
      messages: [
        { role: "bot", text: "What\u2019s up! Welcome to MPA Motorsports & Offroad. I can help with service info, scheduling, quotes, and builds. What are you working with?", timestamp: "2026-03-08 09:12:00" },
        { role: "user", text: "Hey, I\u2019ve got a 2023 Wrangler Rubicon and I\u2019m looking to lift it. What brands do you guys carry?", timestamp: "2026-03-08 09:12:15" },
        { role: "bot", text: "Lift kits are what we live for. We carry Rough Country, Carli, Eibach, and Journey\u2019s Off Road \u2014 and we actually know suspension geometry.", timestamp: "2026-03-08 09:12:16" },
        { role: "user", text: "I want to run 37s so probably a 3.5 inch lift. Also need new wheels and tires to go with it.", timestamp: "2026-03-08 09:13:00" },
        { role: "bot", text: "3.5\" on a Rubicon with 37s \u2014 solid combo. We handle fitment, mounting, balancing, and alignment. Want to set up a free consultation with Ryan?", timestamp: "2026-03-08 09:13:01" },
        { role: "user", text: "Yeah let\u2019s do it", timestamp: "2026-03-08 09:13:30" },
        { role: "bot", text: "Let\u2019s get the ball rolling. What\u2019s your name?", timestamp: "2026-03-08 09:13:31" },
        { role: "user", text: "Mike Thompson", timestamp: "2026-03-08 09:13:45" },
        { role: "bot", text: "Good to meet you, Mike. What\u2019s the best number to reach you at?", timestamp: "2026-03-08 09:13:46" },
        { role: "user", text: "248-555-0142", timestamp: "2026-03-08 09:14:00" },
        { role: "bot", text: "All set \u2014 Mike Thompson, (248) 555-0142, 2023 Jeep Wrangler Rubicon, Lift kit + wheels & tires. Brad or Ryan will reach out shortly.", timestamp: "2026-03-08 09:14:01" }
      ]
    },
    {
      id: 2, session_id: "demo-2", customer_name: null, lead_captured: 0,
      topics: ["alignment", "lift_kits"],
      summary: "Visitor asked about alignment and lift kits \u2014 browsing only",
      sentiment: "neutral", is_active: 0, started_at: "2026-03-08 08:30:00", ended_at: null,
      messages: [
        { role: "bot", text: "What\u2019s up! Welcome to MPA Motorsports & Offroad. What are you working with?", timestamp: "2026-03-08 08:30:00" },
        { role: "user", text: "My truck is pulling to the right after I got a leveling kit installed somewhere else. Can you guys do alignments?", timestamp: "2026-03-08 08:30:20" },
        { role: "bot", text: "Custom alignments are one of our core competencies. Most shops can\u2019t handle a lifted truck alignment \u2014 we specialize in it.", timestamp: "2026-03-08 08:30:21" },
        { role: "user", text: "What do you charge for an alignment?", timestamp: "2026-03-08 08:31:00" },
        { role: "bot", text: "Pricing depends on your specific vehicle. Want me to grab your details for an accurate quote?", timestamp: "2026-03-08 08:31:01" },
        { role: "user", text: "Nah I\u2019m just looking into it for now. Thanks though.", timestamp: "2026-03-08 08:31:30" },
        { role: "bot", text: "No problem at all. (248) 471-3600 if you\u2019d rather talk to a person.", timestamp: "2026-03-08 08:31:31" }
      ]
    },
    {
      id: 3, session_id: "demo-3", customer_name: "Chris Patel", lead_captured: 1,
      topics: ["lighting"],
      summary: "Chris Patel inquired about LED lighting for Tacoma \u2014 lead captured",
      sentiment: "positive", is_active: 0, started_at: "2026-03-07 14:15:00", ended_at: null,
      messages: [
        { role: "bot", text: "What\u2019s up! Welcome to MPA Motorsports & Offroad. What are you working with?", timestamp: "2026-03-07 14:15:00" },
        { role: "user", text: "I want to add a light bar and some pod lights to my Tacoma. Are you guys a Diode Dynamics dealer?", timestamp: "2026-03-07 14:15:20" },
        { role: "bot", text: "We\u2019re an authorized dealer for Form Lighting and Diode Dynamics. LED light bars, headlight upgrades, rock lights \u2014 we install it all with clean wiring.", timestamp: "2026-03-07 14:15:21" },
        { role: "user", text: "Can I get a quote on a 40 inch bar plus ditch lights for a 2021 Tacoma TRD?", timestamp: "2026-03-07 14:16:00" },
        { role: "bot", text: "Let me grab details for real numbers. What\u2019s your name?", timestamp: "2026-03-07 14:16:01" },
        { role: "user", text: "Chris Patel", timestamp: "2026-03-07 14:16:15" },
        { role: "bot", text: "Thanks, Chris. Best number to reach you?", timestamp: "2026-03-07 14:16:16" },
        { role: "user", text: "734-555-0331", timestamp: "2026-03-07 14:16:30" },
        { role: "bot", text: "All set. Chris Patel, (734) 555-0331, 2021 Tacoma TRD \u2014 LED light bar + ditch lights. Someone from the team will reach out with pricing.", timestamp: "2026-03-07 14:16:31" }
      ]
    },
    {
      id: 4, session_id: "demo-4", customer_name: "Amanda Foster", lead_captured: 1,
      topics: ["wheels_tires", "accessories"],
      summary: "Amanda Foster inquired about wheels & tires + accessories for Bronco \u2014 lead captured",
      sentiment: "positive", is_active: 0, started_at: "2026-03-06 15:40:00", ended_at: null,
      messages: [
        { role: "bot", text: "What\u2019s up! Welcome to MPA Motorsports & Offroad. What can I help with?", timestamp: "2026-03-06 15:40:00" },
        { role: "user", text: "Looking for a full wheel and tire setup for my Bronco Badlands. Also interested in bumpers and accessories.", timestamp: "2026-03-06 15:40:20" },
        { role: "bot", text: "Great taste \u2014 the Badlands is a beast. We carry wheels from Method, Fuel, and KMC. For tires: BFG KO2, Nitto Ridge Grappler, or Toyo Open Country. What size are you thinking?", timestamp: "2026-03-06 15:40:21" },
        { role: "user", text: "35s probably. And what bumper brands do you carry?", timestamp: "2026-03-06 15:41:00" },
        { role: "bot", text: "For Bronco bumpers we do DV8, Fab Fours, and custom fab. 35s on stock or with a level?", timestamp: "2026-03-06 15:41:01" },
        { role: "user", text: "Already leveled. Can I get a quote? Name is Amanda Foster, (248) 555-0512", timestamp: "2026-03-06 15:41:30" },
        { role: "bot", text: "Got it \u2014 Amanda Foster, (248) 555-0512, 2023 Ford Bronco Badlands, Wheels & tires + bumper. We\u2019ll get you a full package quote.", timestamp: "2026-03-06 15:41:31" }
      ]
    },
    {
      id: 5, session_id: "demo-5", customer_name: "Tyler Chen", lead_captured: 1,
      topics: ["accessories", "fabrication"],
      summary: "Tyler Chen inquired about rock sliders + skid plates for 4Runner \u2014 lead captured",
      sentiment: "positive", is_active: 0, started_at: "2026-03-06 10:25:00", ended_at: null,
      messages: [
        { role: "bot", text: "What\u2019s up! Welcome to MPA Motorsports & Offroad. What are you working with?", timestamp: "2026-03-06 10:25:00" },
        { role: "user", text: "2024 4Runner TRD Pro. Need rock sliders and a full skid plate setup. Do you guys do custom fab?", timestamp: "2026-03-06 10:25:20" },
        { role: "bot", text: "Custom fabrication is one of our specialties. We build rock sliders, skid plates, bumpers \u2014 all in-house. The TRD Pro is a great platform.", timestamp: "2026-03-06 10:25:21" },
        { role: "user", text: "Perfect. Tyler Chen, 248-555-0678. I want to come in this week.", timestamp: "2026-03-06 10:26:00" },
        { role: "bot", text: "Tyler Chen, (248) 555-0678, 2024 Toyota 4Runner TRD Pro \u2014 rock sliders + skid plates. We\u2019ll get you scheduled.", timestamp: "2026-03-06 10:26:01" }
      ]
    }
  ],
  activity: [
    { id: 1, text: "New lead captured: Mike Thompson \u2014 Lift Kit for 2023 Wrangler Rubicon. Score: Hot.", sentiment: "positive", category: "lead", created_at: "2026-03-08 09:15:00" },
    { id: 2, text: "Customer asked about lift kit pricing. AI provided Rough Country, Carli, Eibach info and collected lead.", sentiment: "positive", category: "chatbot", created_at: "2026-03-08 09:14:00" },
    { id: 3, text: "Answered hours/location question. Customer confirmed visit this week.", sentiment: "positive", category: "chatbot", created_at: "2026-03-08 08:45:00" },
    { id: 4, text: "Quote request for LED lighting on a Tacoma. AI collected vehicle info and scheduled callback.", sentiment: "neutral", category: "chatbot", created_at: "2026-03-07 14:20:00" },
    { id: 5, text: "Multi-intent: wheels + alignment. AI addressed both and cross-sold lift consultation.", sentiment: "positive", category: "chatbot", created_at: "2026-03-07 11:30:00" },
    { id: 6, text: "New lead captured: Amanda Foster \u2014 Wheels & Tires for 2023 Bronco Badlands. Score: Hot.", sentiment: "positive", category: "lead", created_at: "2026-03-06 15:45:00" },
    { id: 7, text: "Customer asked about financing options. AI explained $5,000 approval process.", sentiment: "neutral", category: "chatbot", created_at: "2026-03-06 14:10:00" },
    { id: 8, text: "New lead captured: Tyler Chen \u2014 Armor for 2024 4Runner TRD Pro. Score: Hot.", sentiment: "positive", category: "lead", created_at: "2026-03-06 10:30:00" }
  ]
};

function mockApi(path, opts = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const method = (opts.method || "GET").toUpperCase();
      const body = opts.body ? JSON.parse(opts.body) : {};

      // Auth endpoints
      if (path === "/api/auth/login" && method === "POST") {
        const user = MOCK_DATA.users.find(u => u.username === (body.username || "").toLowerCase().trim() && u.password_hash === body.password);
        if (!user) { reject(new Error("Invalid credentials")); return; }
        resolve({ token: "mock-token-" + Date.now(), user: { username: user.username, display_name: user.display_name, role: user.role, email: user.email } });
        return;
      }
      if (path === "/api/auth/forgot-password" && method === "POST") {
        resolve({ ok: true, message: "If an account exists, a reset link has been sent." });
        return;
      }
      if (path === "/api/auth/reset-password" && method === "POST") {
        resolve({ ok: true, message: "Password updated successfully." });
        return;
      }
      if (path === "/api/auth/logout" && method === "POST") { resolve({ ok: true }); return; }
      if (path === "/api/auth/me") { resolve(MOCK_DATA.users[0]); return; }

      // Stats
      if (path === "/api/stats") {
        const hot = MOCK_DATA.leads.filter(l => l.score === "Hot").length;
        const warm = MOCK_DATA.leads.filter(l => l.score === "Warm").length;
        const captured = MOCK_DATA.conversations.filter(c => c.lead_captured).length;
        resolve({
          total_leads: MOCK_DATA.leads.length, new_leads_today: 3,
          total_conversations: MOCK_DATA.conversations.length,
          total_messages: MOCK_DATA.conversations.reduce((s, c) => s + (c.messages ? c.messages.length : 0), 0),
          appointments_this_week: MOCK_DATA.appointments.length,
          hot_leads: hot, warm_leads: warm, leads_captured: captured,
          ai_response_rate: 97, avg_response_time: "<30s", time_saved_hours: 14,
          conversion_rate: Math.round((captured / Math.max(MOCK_DATA.conversations.length, 1)) * 100)
        });
        return;
      }

      // Leads
      if (path === "/api/leads" && method === "GET") { resolve(MOCK_DATA.leads); return; }
      if (path.startsWith("/api/leads/") && method === "PATCH") {
        const id = parseInt(path.split("/").pop());
        const lead = MOCK_DATA.leads.find(l => l.id === id);
        if (lead) { if (body.status) lead.status = body.status; if (body.score) lead.score = body.score; if (body.notes !== undefined) lead.notes = body.notes; }
        resolve({ ok: true });
        return;
      }

      // Appointments
      if (path === "/api/appointments" && method === "GET") { resolve(MOCK_DATA.appointments); return; }
      if (path.startsWith("/api/appointments/") && method === "PATCH") {
        const id = parseInt(path.split("/").pop());
        const appt = MOCK_DATA.appointments.find(a => a.id === id);
        if (appt) { if (body.status) appt.status = body.status; if (body.notes !== undefined) appt.notes = body.notes; }
        resolve({ ok: true });
        return;
      }

      // Conversations
      if (path === "/api/conversations" && method === "GET") { resolve(MOCK_DATA.conversations); return; }

      // Activity
      if (path === "/api/activity" && method === "GET") { resolve(MOCK_DATA.activity); return; }

      resolve({ ok: true });
    }, 200 + Math.random() * 300);  // Simulate network delay
  });
}

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
  // Try real backend first, fall back to embedded mock data
  try {
    const headers = { "Content-Type": "application/json" };
    if (authToken) headers["Authorization"] = `Bearer ${authToken}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${API}${path}`, { ...opts, headers: { ...headers, ...opts.headers }, signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.status === 401) {
      authToken = null;
      currentUser = null;
      navigate("login");
      return null;
    }
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Request failed");
    return data;
  } catch(e) {
    // Backend unreachable — use mock API
    return mockApi(path, opts);
  }
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
