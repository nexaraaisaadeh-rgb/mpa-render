/* ========================================================================
   MPA MOTORSPORTS CHATBOT WIDGET — Embeddable Script
   
   USAGE: Add to any website:
   <script src="YOUR_DASHBOARD_URL/widget.js" data-api="YOUR_DASHBOARD_URL"></script>
   
   Or for the deployed version:
   <script src="__PORT_8000__/widget-loader" data-api="__PORT_8000__"></script>
   ======================================================================== */

(function() {
  'use strict';

  // ── Configuration ───────────────────────────────────────────────────
  const WIDGET_SCRIPT = document.currentScript;
  // Auto-detect API base from script src (strip /widget.js from end)
  const SCRIPT_SRC = WIDGET_SCRIPT?.src || '';
  const AUTO_API = SCRIPT_SRC ? SCRIPT_SRC.substring(0, SCRIPT_SRC.lastIndexOf('/')) : '';
  const API_BASE = WIDGET_SCRIPT?.getAttribute('data-api') || AUTO_API || '';

  // ── Inject CSS ──────────────────────────────────────────────────────
  function injectStyles() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = (WIDGET_SCRIPT?.src || '').replace('widget.js', 'widget.css');
    document.head.appendChild(link);
    
    // Also load Inter font if not already present
    if (!document.querySelector('link[href*="fonts.googleapis.com"][href*="Inter"]')) {
      const font = document.createElement('link');
      font.rel = 'stylesheet';
      font.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
      document.head.appendChild(font);
    }
  }

  // ── Build Widget DOM ────────────────────────────────────────────────
  function buildWidget() {
    const root = document.createElement('div');
    root.id = 'mpa-chat-widget';
    root.innerHTML = `
      <button class="mpa-toggle" aria-label="Open chat assistant">
        <svg class="mpa-icon-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        <svg class="mpa-icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        <span class="mpa-notif-dot"></span>
      </button>
      <div class="mpa-window">
        <div class="mpa-header">
          <div class="mpa-header-info">
            <div class="mpa-header-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a3 3 0 0 0-3 3v4a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
            </div>
            <div>
              <div class="mpa-header-name">MPA Assistant</div>
              <div class="mpa-header-status"><span class="mpa-status-dot"></span> Online</div>
            </div>
          </div>
          <button class="mpa-header-close" aria-label="Close chat">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="mpa-messages" id="mpa-messages"></div>
        <div class="mpa-input-area">
          <input type="text" class="mpa-input" id="mpa-input" placeholder="Ask about services, builds, scheduling..." autocomplete="off" aria-label="Chat message">
          <button class="mpa-send" id="mpa-send" aria-label="Send">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/></svg>
          </button>
        </div>
        <div class="mpa-powered">Powered by <a href="https://nexara-dab27b.webflow.io/" target="_blank" rel="noopener">Nexara</a></div>
      </div>`;
    document.body.appendChild(root);
    return root;
  }

  // ── State ───────────────────────────────────────────────────────────
  let isOpen = false;
  let conversationState = 'idle';
  let leadData = {};
  let sessionId = 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6);
  const conversationMemory = [];
  const MEMORY_SIZE = 5;

  // ── API Helpers ─────────────────────────────────────────────────────
  function apiPost(path, body) {
    if (!API_BASE) return Promise.resolve(null);
    return fetch(API_BASE + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then(r => r.json()).catch(() => null);
  }

  // Post lead to dashboard API
  function postLead(data) {
    apiPost('/api/leads', {
      name: data.name || 'Unknown',
      phone: data.phone || null,
      vehicle: data.vehicle || null,
      service: data.service || null,
      usage_type: data.usage || null,
      timeline: data.timeline || null,
      score: data.score || 'Warm',
      source: 'chatbot'
    });
  }

  // Post message to dashboard API
  function postMessage(role, text) {
    apiPost('/api/messages', { session_id: sessionId, role: role, text: text });
  }

  // Update conversation metadata
  function updateConversation(updates) {
    apiPost('/api/conversations/' + sessionId, { session_id: sessionId, ...updates });
  }

  // Post activity
  function postActivity(text, sentiment) {
    apiPost('/api/activity', { text: text, sentiment: sentiment || 'neutral' });
  }

  // ── Memory ──────────────────────────────────────────────────────────
  function addToMemory(role, text, intent) {
    conversationMemory.push({ role, text, intent: intent || null });
    if (conversationMemory.length > MEMORY_SIZE * 2) {
      conversationMemory.splice(0, conversationMemory.length - MEMORY_SIZE * 2);
    }
  }

  function getLastBotIntent() {
    for (let i = conversationMemory.length - 1; i >= 0; i--) {
      if (conversationMemory[i].role === 'bot' && conversationMemory[i].intent) {
        return conversationMemory[i].intent;
      }
    }
    return null;
  }

  // ── Fuzzy Matching ──────────────────────────────────────────────────
  function levenshtein(a, b) {
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    const m = [];
    for (let i = 0; i <= b.length; i++) m[i] = [i];
    for (let j = 0; j <= a.length; j++) m[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        const cost = b[i-1] === a[j-1] ? 0 : 1;
        m[i][j] = Math.min(m[i-1][j]+1, m[i][j-1]+1, m[i-1][j-1]+cost);
      }
    }
    return m[b.length][a.length];
  }

  function fuzzyMatch(word, target) {
    const maxDist = Math.max(1, Math.floor(target.length * 0.3));
    return levenshtein(word.toLowerCase(), target.toLowerCase()) <= maxDist;
  }

  // ── Sentiment ───────────────────────────────────────────────────────
  function detectSentiment(text) {
    const l = text.toLowerCase();
    const pos = ['great','awesome','love','perfect','amazing','thanks','thank','cool','nice','sweet','stoked','pumped'];
    const neg = ['bad','terrible','hate','worst','awful','disappointed','frustrated','angry','upset','broken','wrong'];
    let p=0, n=0;
    pos.forEach(w => { if(l.includes(w)) p++; });
    neg.forEach(w => { if(l.includes(w)) n++; });
    return n > p ? 'negative' : p > n ? 'positive' : 'neutral';
  }

  // ── Intent Definitions ──────────────────────────────────────────────
  const intents = [
    { id: 'greeting', keywords: ['hi','hello','hey','yo','sup','howdy'], phrases: ['good morning','good afternoon','good evening'], weight: 0.8 },
    { id: 'hours', keywords: ['hours','open','close','closed','time','schedule'], phrases: ['business hours','when are you open','what time'], weight: 1.0 },
    { id: 'location', keywords: ['location','address','directions','where','map','located'], phrases: ['where are you','where is your shop'], weight: 1.0 },
    { id: 'contact', keywords: ['phone','call','number','contact','reach','email'], phrases: ['phone number','contact info'], weight: 1.0 },
    { id: 'services_general', keywords: ['services','offer','do'], phrases: ['what do you do','what services','what do you offer'], weight: 1.2 },
    { id: 'lift_kits', keywords: ['lift','lifted','leveling','level'], phrases: ['lift kit','leveling kit','rough country','carli','suspension lift'], fuzzyTargets: ['lift','leveling','suspension'], weight: 1.5 },
    { id: 'wheels_tires', keywords: ['wheel','wheels','tire','tires','rim','rims','balancing'], phrases: ['wheels and tires','tire package','new tires','wheel fitment'], fuzzyTargets: ['wheels','tires','rims'], weight: 1.5 },
    { id: 'alignment', keywords: ['alignment','align','aligned'], phrases: ['custom alignment','need an alignment','truck alignment'], fuzzyTargets: ['alignment'], weight: 1.5 },
    { id: 'lighting', keywords: ['light','lights','lighting','led','headlight','headlights'], phrases: ['light bar','led bar','rock lights','diode dynamics','form lighting'], fuzzyTargets: ['lighting','headlights'], weight: 1.5 },
    { id: 'accessories', keywords: ['accessories','armor','bumper','bumpers','fender','skid','guard'], phrases: ['rock sliders','skid plate','fender flares'], fuzzyTargets: ['accessories','bumper'], weight: 1.3 },
    { id: 'fabrication', keywords: ['fabrication','fabricate','weld','welding','cage','custom'], phrases: ['roll cage','custom fab','metal work'], fuzzyTargets: ['fabrication','welding'], weight: 1.3 },
    { id: 'pricing', keywords: ['price','pricing','cost','estimate','quote','much'], phrases: ['how much','get a quote','cost of'], weight: 1.2 },
    { id: 'booking', keywords: ['book','schedule','appointment','visit'], phrases: ['book an appointment','schedule a visit','set up a time'], weight: 1.3 },
    { id: 'reviews', keywords: ['reviews','review','rating','stars','reputation'], phrases: ['are you good','how are your reviews'], weight: 1.0 },
    { id: 'financing', keywords: ['financing','finance','loan','credit','payment'], phrases: ['payment plan','financing options'], weight: 1.0 },
    { id: 'team', keywords: ['team','staff','mechanic','owner','ryan','brad','josh','john'], phrases: ['who works there','meet the team'], weight: 1.0 },
    { id: 'brakes', keywords: ['brake','brakes','rotor','rotors','pad','pads','caliper'], phrases: ['brake service','brake job','brakes are squeaking'], fuzzyTargets: ['brakes'], weight: 1.3 },
    { id: 'exhaust', keywords: ['exhaust','muffler','catback','pipe'], phrases: ['exhaust system','cat back'], fuzzyTargets: ['exhaust'], weight: 1.3 },
    { id: 'engine', keywords: ['engine','motor','diagnostic','diagnostics'], phrases: ['engine light','check engine','engine diagnostic'], fuzzyTargets: ['engine','diagnostic'], weight: 1.3 },
    { id: 'oil_change', keywords: ['oil','maintenance'], phrases: ['oil change','scheduled maintenance'], weight: 1.0 },
    { id: 'collision', keywords: ['collision','crash','accident','dent','body'], phrases: ['body work','collision repair'], weight: 1.2 },
    { id: 'winch', keywords: ['winch'], phrases: ['winch install','recovery winch'], weight: 1.2 },
    { id: 'power_steps', keywords: ['steps','boards'], phrases: ['power step','power steps','running board','side steps'], weight: 1.2 },
    { id: 'towing', keywords: ['tow','towing'], phrases: ['tow my car','need a tow'], weight: 1.0 },
    { id: 'ac', keywords: ['ac','air','conditioning','hvac'], phrases: ['air conditioning','ac service','ac repair'], weight: 1.0 },
    { id: 'transmission', keywords: ['transmission','trans','gear','gears'], phrases: ['transmission work','slipping gears'], fuzzyTargets: ['transmission'], weight: 1.2 },
    { id: 'thanks', keywords: ['thanks','thank','thx','appreciate','ty'], phrases: ['thank you'], weight: 0.6 },
    { id: 'goodbye', keywords: ['bye','goodbye','later','peace'], phrases: ['see ya','gotta go','talk later'], weight: 0.6 },
    { id: 'yes_affirm', keywords: ['yes','yeah','yep','sure','absolutely','definitely','please','ok','okay','yup','bet'], phrases: ['sounds good','let\'s do it','i\'m down','sign me up'], weight: 0.5 },
    { id: 'no_deny', keywords: ['no','nah','nope','pass'], phrases: ['no thanks','not right now','i\'m good','maybe later'], weight: 0.5 },
    { id: 'builds', keywords: ['build','builds','project','bronco','tacoma','wrangler','jeep'], phrases: ['featured build','custom build','overland build'], weight: 1.0 },
  ];

  function scoreIntent(text, intent) {
    const lower = text.toLowerCase();
    const words = lower.split(/\s+/);
    let score = 0;
    intent.keywords.forEach(kw => {
      if (words.includes(kw)) score += 2 * intent.weight;
      else if (lower.includes(kw)) score += 1.5 * intent.weight;
    });
    (intent.phrases || []).forEach(p => { if (lower.includes(p)) score += 4 * intent.weight; });
    if (intent.fuzzyTargets) {
      words.forEach(w => {
        if (w.length < 3) return;
        intent.fuzzyTargets.forEach(t => {
          if (fuzzyMatch(w, t) && w !== t.toLowerCase()) score += 2.5 * intent.weight;
        });
      });
    }
    words.forEach(w => {
      if (w.length < 4) return;
      intent.keywords.forEach(kw => {
        if (kw.length < 4) return;
        if (w !== kw && fuzzyMatch(w, kw)) score += 1.5 * intent.weight;
      });
    });
    return score;
  }

  function detectIntents(text) {
    const scored = intents.map(i => ({ id: i.id, score: scoreIntent(text, i) })).filter(s => s.score > 0);
    scored.sort((a,b) => b.score - a.score);
    const svcIds = ['lift_kits','wheels_tires','alignment','lighting','accessories','fabrication','brakes','exhaust','engine','oil_change','collision','winch','power_steps','towing','ac','transmission'];
    const THRESHOLD = 1.5;
    const results = [];
    const top = scored[0]?.score || 0;
    scored.forEach(s => {
      if (s.score >= THRESHOLD) {
        if (results.length === 0 || (svcIds.includes(s.id) && s.score >= top * 0.4 && results.length < 3)) results.push(s);
      }
    });
    return results;
  }

  // ── Response Map ────────────────────────────────────────────────────
  const R = {
    greeting: { text: `What's up! Welcome to <strong>MPA Motorsports & Offroad</strong>. I'm here to help — whether you need info on a build, want to schedule a consultation, or just have questions about what we can do for your rig. What are you working with?`, chips: ['View Services','Book Appointment','Get a Quote','Hours & Location'] },
    hours: { text: `We're open <strong>Monday through Friday, 8:00 AM to 5:00 PM</strong>. Closed weekends — the crew needs trail time too.<br><br>Phone: <strong>(248) 471-3600</strong>`, chips: ['Book Appointment','Get Directions','View Services'] },
    location: { text: `We're at <strong>24495 Hathaway St, Farmington Hills, MI 48335</strong> — right off the Grand River corridor.<br><br>Hours: Mon–Fri, 8am–5pm<br>Phone: <strong>(248) 471-3600</strong>`, chips: ['Book Appointment','View Services'] },
    contact: { text: `<strong>Phone:</strong> (248) 471-3600<br><strong>Address:</strong> 24495 Hathaway St, Farmington Hills, MI 48335<br><strong>Hours:</strong> Mon–Fri, 8am–5pm<br><br>Brad's at the front desk — he'll get you sorted.`, chips: ['Book Appointment','Get a Quote'] },
    services_general: { text: 'SERVICES_CARD', chips: ['Get a Quote','Book Appointment'] },
    lift_kits: { text: `Lift kits are what we live for. We carry <strong>Rough Country, Carli, Eibach, and Journey's Off Road</strong> — and we actually know suspension geometry.<br><br>We do everything from 2" leveling kits to full 6"+ suspension lifts. Every install includes a post-install re-torque service.<br><br>Want to set up a free consultation with Ryan?`, chips: ['Get a Quote','Schedule Consult','Wheels & Tires Info'], crossSell: 'Many of our lift kit customers also add <strong>wheels and tires</strong> or <strong>lighting upgrades</strong>. Want info on those?' },
    wheels_tires: { text: `We handle <strong>fitment, mounting, balancing, and alignment</strong> — the full deal. We'll make sure your wheel offset and tire diameter work for your clearance.<br><br>Whether you're running 35" KO2s or 37s, we've got you. What are you running?`, chips: ['Get a Quote','Book Appointment','Alignment Info'], crossSell: 'If you\'re upsizing tires, you might need a <strong>leveling or lift kit</strong> for proper clearance.' },
    alignment: { text: `Custom alignments are one of our core competencies. Most shops can't handle a lifted truck alignment — we specialize in it.<br><br>We adjust <strong>caster, camber, and toe</strong> to match your modified geometry. Every lift kit install includes an alignment.`, chips: ['Schedule Alignment','Get a Quote','Lift Kit Info'], crossSell: 'If your alignment keeps going out, the issue might be in your <strong>suspension components</strong>.' },
    lighting: { text: `We're an authorized dealer for <strong>Form Lighting and Diode Dynamics</strong>.<br><br>LED light bars, headlight upgrades, rock lights, pod lights — we install it all with clean wiring, no hack jobs.`, chips: ['Get a Quote','Schedule Visit','View Services'], crossSell: 'A lot of our lighting customers also add <strong>bumpers or accessories</strong>. Want details?' },
    accessories: { text: `We carry and install <strong>armor and accessories</strong> — bumpers, rock sliders, skid plates, fender flares, bull bars, brush guards.<br><br>If something doesn't exist off the shelf, our fab team can build it.`, chips: ['Get a Quote','Custom Fabrication','Book Appointment'] },
    fabrication: { text: `Our fab shop handles <strong>roll cages, custom brackets, bumper builds, and metal work</strong>. Josh and the crew do clean work — proper welds, proper fitment.<br><br>Got a project in mind?`, chips: ['Get a Quote','Book Consult'] },
    pricing: { text: `We don't do cookie-cutter quotes. Every build is different. <strong>Consultations are free</strong>, and we offer <strong>financing up to $5,000</strong>.<br><br>Let me grab a few details so we can get you real numbers.`, chips: ['Start Quote','Call Instead'] },
    booking: { text: `Let's get you on the books. I'll grab a few details to make sure the team is prepped.`, chips: [] },
    reviews: { text: `<strong>164+ reviews, 4.8 stars on Google</strong> — earned every one. People come back because we're honest. Check our Google reviews — the builds and customer experience speak for themselves.`, chips: ['Book Appointment','View Services'] },
    financing: { text: `We offer <strong>financing up to $5,000 approved</strong> — quick application, no headaches. Brad at the front desk handles it in about 10 minutes.`, chips: ['Book Appointment','Get a Quote'] },
    team: { text: `<strong>Ryan</strong> — Owner. Knows suspension, clearance, and every bolt on your truck.<br><strong>Brad</strong> — Front desk. Handles scheduling and financing.<br><strong>Josh</strong> — Lead tech. Clean, precise work.<br><strong>John</strong> — Tech. Handles alignments to engine work.`, chips: ['Book Appointment','View Services'] },
    brakes: { text: `Full brake service — <strong>pads, rotors, calipers, lines, fluid flush</strong>. We use quality parts and check the full system.`, chips: ['Schedule Inspection','Get a Quote'] },
    exhaust: { text: `Exhaust work — from <strong>cat-back systems to muffler deletes to full custom fab</strong>. Performance or sound, we can talk through options.`, chips: ['Get a Quote','Book Appointment'] },
    engine: { text: `We handle <strong>engine diagnostics, service, and repair</strong>. Check engine light? We'll pull codes and give honest options.`, chips: ['Schedule Diagnostic','Get a Quote'] },
    oil_change: { text: `Oil changes and <strong>factory scheduled maintenance</strong>. Conventional, synthetic blend, or full synthetic.`, chips: ['Book Appointment','View Services'] },
    collision: { text: `Collision repair through <strong>MPA Collision</strong> — same building, same team. We work with insurance companies too.`, chips: ['Schedule Estimate','Call Us'] },
    winch: { text: `Winch installation done right — <strong>proper mounting, clean wiring, correct circuit protection</strong>. We can pair it with a bumper upgrade.`, chips: ['Get a Quote','Book Appointment'] },
    power_steps: { text: `Power steps — <strong>automatic deploy and retract</strong>. We install all major brands with clean wiring and proper calibration.`, chips: ['Get a Quote','Book Appointment'] },
    towing: { text: `Need a tow? Call <strong>(248) 471-3600</strong> and we'll coordinate getting your vehicle to the shop.`, chips: ['Call Now'] },
    ac: { text: `<strong>AC service, diagnosis, and repair</strong>. We'll diagnose the actual issue, not just throw refrigerant at it.`, chips: ['Book Appointment','Get a Quote'] },
    transmission: { text: `Transmission work — <strong>fluid services, diagnostics, and repair</strong>. Don't wait — bring it in for a proper diagnosis.`, chips: ['Schedule Diagnostic','Get a Quote'] },
    thanks: { text: `Anytime. If anything else comes up, just ask — or call us at <strong>(248) 471-3600</strong>. Mon–Fri, 8am–5pm.`, chips: ['View Services','Book Appointment'] },
    goodbye: { text: `Take it easy! <strong>(248) 471-3600</strong> — Mon–Fri, 8am–5pm. See you at the shop.`, chips: [] },
    builds: { text: `We've built some serious rigs — lifted Broncos, overland Tacomas, trail Wranglers, F-150s on 35s. Every build is different because every owner is different. Want to talk about your project?`, chips: ['Start My Build','Get a Quote'] },
  };

  // ── Services Card HTML ──────────────────────────────────────────────
  function servicesCardHTML() {
    return `Here's what we do — <strong>tap any service</strong> to learn more:
<div class="svc-grid">
  <div class="svc-card" onclick="window._mpaWidget.svcClick('lift kits')"><div class="svc-icon">🔧</div><div class="svc-name">Suspension & Lift Kits</div></div>
  <div class="svc-card" onclick="window._mpaWidget.svcClick('wheels and tires')"><div class="svc-icon">🛞</div><div class="svc-name">Wheels & Tires</div></div>
  <div class="svc-card" onclick="window._mpaWidget.svcClick('alignment')"><div class="svc-icon">📐</div><div class="svc-name">Custom Alignments</div></div>
  <div class="svc-card" onclick="window._mpaWidget.svcClick('lighting')"><div class="svc-icon">💡</div><div class="svc-name">Lighting & Wiring</div></div>
  <div class="svc-card" onclick="window._mpaWidget.svcClick('accessories')"><div class="svc-icon">🛡️</div><div class="svc-name">Accessories & Armor</div></div>
  <div class="svc-card" onclick="window._mpaWidget.svcClick('fabrication')"><div class="svc-icon">⚙️</div><div class="svc-name">Custom Fabrication</div></div>
</div>
Also: <span class="mpa-clickable" onclick="window._mpaWidget.svcClick('brakes')">brakes</span>, <span class="mpa-clickable" onclick="window._mpaWidget.svcClick('exhaust')">exhaust</span>, <span class="mpa-clickable" onclick="window._mpaWidget.svcClick('AC service')">AC</span>, <span class="mpa-clickable" onclick="window._mpaWidget.svcClick('oil change')">oil changes</span>, <span class="mpa-clickable" onclick="window._mpaWidget.svcClick('collision repair')">collision repair</span>.`;
  }

  // ── Utility ─────────────────────────────────────────────────────────
  function esc(s) {
    if (!s) return '';
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function timeStr() {
    const n = new Date();
    let h = n.getHours();
    const m = n.getMinutes().toString().padStart(2,'0');
    const ap = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return h + ':' + m + ' ' + ap;
  }

  // ── Chat DOM Helpers ────────────────────────────────────────────────
  let messagesEl;

  function addBotMsg(html, chips, intent) {
    const wrap = document.createElement('div');
    wrap.className = 'mpa-msg-wrap mpa-bot';
    wrap.innerHTML = `<div class="mpa-msg-meta"><span>MPA Assistant</span><span>${timeStr()}</span></div>`;
    
    const bubble = document.createElement('div');
    bubble.className = 'mpa-bubble mpa-bot-bubble';
    bubble.innerHTML = html;
    wrap.appendChild(bubble);

    if (chips?.length) {
      const chipsEl = document.createElement('div');
      chipsEl.className = 'mpa-chips';
      chips.forEach(c => {
        const btn = document.createElement('button');
        btn.className = 'mpa-chip';
        btn.textContent = c;
        btn.addEventListener('click', () => handleChip(c));
        chipsEl.appendChild(btn);
      });
      wrap.appendChild(chipsEl);
    }

    messagesEl.appendChild(wrap);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    addToMemory('bot', html.replace(/<[^>]*>/g,''), intent);
    postMessage('bot', html.replace(/<[^>]*>/g,''));
  }

  function addUserMsg(text) {
    // Remove old chips
    messagesEl.querySelectorAll('.mpa-chips').forEach(c => c.remove());
    
    const wrap = document.createElement('div');
    wrap.className = 'mpa-msg-wrap mpa-user';
    wrap.innerHTML = `<div class="mpa-msg-meta"><span>${timeStr()}</span><span>You</span></div>`;
    const bubble = document.createElement('div');
    bubble.className = 'mpa-bubble mpa-user-bubble';
    bubble.textContent = text;
    wrap.appendChild(bubble);
    messagesEl.appendChild(wrap);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    addToMemory('user', text);
    postMessage('user', text);
  }

  function showTyping() {
    const t = document.createElement('div');
    t.className = 'mpa-typing';
    t.id = 'mpa-typing';
    t.innerHTML = '<div class="mpa-typing-dot"></div><div class="mpa-typing-dot"></div><div class="mpa-typing-dot"></div>';
    messagesEl.appendChild(t);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function hideTyping() {
    const t = document.getElementById('mpa-typing');
    if (t) t.remove();
  }

  // ── Chip Click ──────────────────────────────────────────────────────
  const chipMap = {
    'View Services': 'What services do you offer?',
    'Book Appointment': 'I\'d like to book an appointment',
    'Get a Quote': 'I\'d like to get a quote',
    'Hours & Location': 'What are your hours and where are you located?',
    'Get Directions': 'Where is your shop?',
    'Call Now': 'What is your phone number?',
    'Call Instead': 'What\'s your phone number?',
    'Call Us': 'What\'s your phone number?',
    'Schedule Visit': 'I\'d like to schedule a visit',
    'Schedule Consult': 'I\'d like to schedule a consultation',
    'Schedule Alignment': 'I\'d like to schedule an alignment',
    'Schedule Inspection': 'I\'d like to schedule an inspection',
    'Schedule Estimate': 'I\'d like to schedule an estimate',
    'Schedule Diagnostic': 'I\'d like to schedule a diagnostic',
    'Wheels & Tires Info': 'Tell me about wheels and tires',
    'Alignment Info': 'Tell me about alignments',
    'Lift Kit Info': 'Tell me about lift kits',
    'Custom Fabrication': 'Tell me about custom fabrication',
    'Start Quote': 'I want to get a quote',
    'Start My Build': 'I want to start a build project',
    'Book Consult': 'I\'d like to book a consultation',
    'Learn About Financing': 'Tell me about financing options',
    'Yes, tell me more': 'Yes, tell me more',
    'No thanks': 'No thanks',
  };

  function handleChip(text) {
    const msg = chipMap[text] || text;
    addUserMsg(msg);
    showTyping();
    setTimeout(() => { hideTyping(); processMessage(msg); }, 500 + Math.random() * 500);
  }

  // ── Service Card Click ──────────────────────────────────────────────
  const svcMap = {
    'lift kits': 'Tell me about lift kits',
    'wheels and tires': 'Tell me about wheels and tires',
    'alignment': 'Tell me about alignments',
    'lighting': 'Tell me about lighting and wiring',
    'accessories': 'Tell me about accessories and armor',
    'fabrication': 'Tell me about custom fabrication',
    'brakes': 'Tell me about brake service',
    'exhaust': 'Tell me about exhaust work',
    'AC service': 'Tell me about AC service',
    'oil change': 'Tell me about oil changes',
    'collision repair': 'Tell me about collision repair',
  };

  function svcClick(svc) {
    const msg = svcMap[svc] || 'Tell me about ' + svc;
    addUserMsg(msg);
    showTyping();
    setTimeout(() => { hideTyping(); processMessage(msg); }, 500 + Math.random() * 500);
  }

  // ── Message Processing ──────────────────────────────────────────────
  function processMessage(text) {
    const lower = text.toLowerCase().trim();
    const sentiment = detectSentiment(text);
    const svcIntentIds = ['lift_kits','wheels_tires','alignment','lighting','accessories','fabrication','brakes','exhaust','engine','oil_change','collision','winch','power_steps','towing','ac','transmission'];

    // Lead collection states
    if (conversationState === 'collecting_name') {
      leadData.name = text;
      conversationState = 'collecting_phone';
      updateConversation({ customer_name: text });
      addBotMsg(`Good to meet you, <strong>${esc(text)}</strong>. What's the best number to reach you at?`, [], 'collecting');
      return;
    }
    if (conversationState === 'collecting_phone') {
      leadData.phone = text;
      conversationState = 'collecting_vehicle';
      addBotMsg(`Got it. What vehicle are you working with? <strong>Year, make, and model</strong>.`, [], 'collecting');
      return;
    }
    if (conversationState === 'collecting_vehicle') {
      leadData.vehicle = text;
      if (leadData.service) {
        conversationState = 'collecting_usage';
        addBotMsg(`Is this your <strong>daily driver</strong> or a <strong>trail rig</strong>?`, ['Daily Driver','Trail Rig','Both'], 'collecting');
      } else {
        conversationState = 'collecting_service';
        addBotMsg(`What service or build are you looking at?`, [], 'collecting');
      }
      return;
    }
    if (conversationState === 'collecting_service') {
      leadData.service = text;
      conversationState = 'collecting_usage';
      addBotMsg(`Is this your <strong>daily driver</strong> or a <strong>trail rig</strong>?`, ['Daily Driver','Trail Rig','Both'], 'collecting');
      return;
    }
    if (conversationState === 'collecting_usage') {
      leadData.usage = text;
      conversationState = 'collecting_timeline';
      addBotMsg(`When are you looking to get this done?`, ['This Week','Next Week','Just Getting Info'], 'collecting');
      return;
    }
    if (conversationState === 'collecting_timeline') {
      leadData.timeline = text;
      conversationState = 'idle';
      let score = 'Warm';
      if (leadData.vehicle && leadData.service && !lower.includes('just') && !lower.includes('info')) score = 'Hot';
      if (!leadData.vehicle && !leadData.service) score = 'Cold';
      leadData.score = score;
      postLead(leadData);
      updateConversation({ lead_captured: true, summary: leadData.name + ' inquired about ' + (leadData.service || 'services') + ' — lead captured' });
      postActivity('New lead captured: ' + leadData.name + ' — ' + (leadData.service || 'General Inquiry'), 'positive');

      addBotMsg(`<div class="mpa-confirm">
        <div class="mpa-confirm-header">All set — here's what I've got:</div>
        <div class="mpa-confirm-row"><strong>Name:</strong> ${esc(leadData.name)}</div>
        <div class="mpa-confirm-row"><strong>Phone:</strong> ${esc(leadData.phone)}</div>
        <div class="mpa-confirm-row"><strong>Vehicle:</strong> ${esc(leadData.vehicle)}</div>
        <div class="mpa-confirm-row"><strong>Service:</strong> ${esc(leadData.service || 'General Inquiry')}</div>
        <div class="mpa-confirm-row"><strong>Use:</strong> ${esc(leadData.usage)}</div>
        <div class="mpa-confirm-row"><strong>Timeline:</strong> ${esc(leadData.timeline)}</div>
        <div class="mpa-confirm-footer">Brad or Ryan will reach out shortly. Real answers, not a sales pitch.</div>
      </div>`, ['View Services'], 'lead_captured');
      leadData = {};
      return;
    }
    if (conversationState === 'collecting_fallback_name') {
      leadData.name = text;
      conversationState = 'collecting_fallback_phone';
      addBotMsg(`Thanks, <strong>${esc(text)}</strong>. What's the best number to reach you?`, [], 'collecting');
      return;
    }
    if (conversationState === 'collecting_fallback_phone') {
      leadData.phone = text;
      conversationState = 'idle';
      leadData.score = 'Cold';
      postLead(leadData);
      updateConversation({ lead_captured: true });
      addBotMsg(`<div class="mpa-confirm">
        <div class="mpa-confirm-header">Got it — we'll reach out.</div>
        <div class="mpa-confirm-row"><strong>Name:</strong> ${esc(leadData.name)}</div>
        <div class="mpa-confirm-row"><strong>Phone:</strong> ${esc(leadData.phone)}</div>
        <div class="mpa-confirm-footer">Someone from the team will give you a call.</div>
      </div>`, ['View Services'], 'lead_captured');
      leadData = {};
      return;
    }

    // Context-aware booking
    const bookRe = /\b(book|schedule)\b.*(consultation|appointment|visit|estimate|inspection|diagnostic|alignment)/i;
    const bookRe2 = /\b(consultation|appointment|visit)\b.*(book|schedule)/i;
    if (bookRe.test(lower) || bookRe2.test(lower)) {
      const last = getLastBotIntent();
      if (last && svcIntentIds.includes(last)) {
        leadData.service = last.replace(/_/g,' ');
        addBotMsg(`Let's get you set up for a <strong>${leadData.service}</strong> consultation.`, [], 'booking');
        setTimeout(() => { showTyping(); setTimeout(() => { hideTyping(); conversationState = 'collecting_name'; addBotMsg(`What's your name?`, [], 'collecting'); }, 400); }, 200);
      } else {
        conversationState = 'collecting_name';
        addBotMsg(R.booking.text, [], 'booking');
        setTimeout(() => { showTyping(); setTimeout(() => { hideTyping(); addBotMsg(`What's your name?`, [], 'collecting'); }, 400); }, 200);
      }
      return;
    }

    const det = detectIntents(text);
    const matchedSvc = det.filter(i => svcIntentIds.includes(i.id));

    // Yes with context
    if (det[0]?.id === 'yes_affirm') {
      const last = getLastBotIntent();
      const bookable = [...svcIntentIds, 'pricing', 'builds'];
      if (last && bookable.includes(last)) {
        addBotMsg(`Let's get the ball rolling. I'll grab a few quick details.`, [], 'booking');
        setTimeout(() => { showTyping(); setTimeout(() => { hideTyping(); conversationState = 'collecting_name'; addBotMsg(`What's your name?`, [], 'collecting'); }, 400); }, 200);
        return;
      }
      conversationState = 'collecting_name';
      addBotMsg(`Let's do it. What's your name?`, [], 'collecting');
      return;
    }

    if (det[0]?.id === 'no_deny') {
      addBotMsg(`No problem at all. If you change your mind, I'm here. <strong>(248) 471-3600</strong> if you'd rather talk to a person.`, ['View Services','Hours & Location'], 'no_deny');
      return;
    }

    if (det[0]?.id === 'greeting') {
      addBotMsg(sentiment === 'positive' ? `Hey, good to hear from you! Welcome to <strong>MPA Motorsports & Offroad</strong>. What are you working on?` : R.greeting.text, R.greeting.chips, 'greeting');
      return;
    }
    if (det[0]?.id === 'thanks') { addBotMsg(R.thanks.text, R.thanks.chips, 'thanks'); return; }
    if (det[0]?.id === 'goodbye') { addBotMsg(R.goodbye.text, R.goodbye.chips, 'goodbye'); return; }

    // Booking/pricing + service
    if (det[0]?.id === 'booking' || det[0]?.id === 'pricing') {
      if (matchedSvc.length > 0 && R[matchedSvc[0].id]) {
        addBotMsg(R[matchedSvc[0].id].text, [], matchedSvc[0].id);
        setTimeout(() => { showTyping(); setTimeout(() => { hideTyping(); conversationState = 'collecting_name'; leadData.service = matchedSvc[0].id.replace(/_/g,' ');
          addBotMsg((det[0].id === 'booking' ? `Let's get you on the schedule.` : `Let me grab details for real numbers.`) + ` What's your name?`, [], 'collecting');
        }, 500); }, 300);
        return;
      }
      if (det[0].id === 'pricing') {
        addBotMsg(R.pricing.text, [], 'pricing');
        setTimeout(() => { showTyping(); setTimeout(() => { hideTyping(); conversationState = 'collecting_name'; addBotMsg(`What's your name?`, [], 'collecting'); }, 500); }, 300);
      } else {
        conversationState = 'collecting_name';
        addBotMsg(R.booking.text, [], 'booking');
        setTimeout(() => { showTyping(); setTimeout(() => { hideTyping(); addBotMsg(`What's your name?`, [], 'collecting'); }, 400); }, 200);
      }
      return;
    }

    // Multi-service
    if (matchedSvc.length >= 2 && R[matchedSvc[0].id] && R[matchedSvc[1].id]) {
      addBotMsg(R[matchedSvc[0].id].text + '<br><br><hr style="border:none;border-top:1px solid rgba(255,255,255,0.1);margin:8px 0;"><br>' + R[matchedSvc[1].id].text, ['Get a Quote','Book Appointment'], matchedSvc[0].id);
      updateConversation({ topics: matchedSvc.map(s => s.id) });
      return;
    }

    // Single intent
    if (det.length > 0 && R[det[0].id]) {
      const r = R[det[0].id];
      const html = r.text === 'SERVICES_CARD' ? servicesCardHTML() : r.text;
      addBotMsg(html, r.chips, det[0].id);
      updateConversation({ topics: [det[0].id] });
      if (r.crossSell) {
        setTimeout(() => { showTyping(); setTimeout(() => { hideTyping(); addBotMsg(r.crossSell, ['Yes, tell me more','No thanks','Get a Quote'], det[0].id + '_crosssell'); }, 600); }, 1200);
      }
      return;
    }

    // Context-aware pricing
    if (/how much|what.*(cost|price)|pricing/i.test(lower)) {
      const last = getLastBotIntent();
      if (last && R[last]) {
        addBotMsg(`Pricing for ${last.replace(/_/g,' ')} depends on your specific vehicle. Want me to grab your details for an accurate quote?`, ['Start Quote','Call Instead'], 'pricing');
        setTimeout(() => { showTyping(); setTimeout(() => { hideTyping(); conversationState = 'collecting_name'; leadData.service = last.replace(/_/g,' '); addBotMsg(`What's your name?`, [], 'collecting'); }, 500); }, 300);
        return;
      }
    }

    // Fallback
    if (sentiment === 'negative') {
      addBotMsg(`I hear you. Let me connect you with someone who can help directly. Can I get your name?`, [], 'fallback');
    } else {
      addBotMsg(`Good question — let me get someone on the team to help with that. Can I get your name and number so they can reach out?`, ['Call Instead','View Services'], 'fallback');
    }
    conversationState = 'collecting_fallback_name';
    leadData = { vehicle: 'Not specified', service: 'General Inquiry' };
  }

  // ── Initialize ──────────────────────────────────────────────────────
  function init() {
    injectStyles();
    const root = buildWidget();
    messagesEl = root.querySelector('#mpa-messages');

    // Create conversation in API
    apiPost('/api/conversations', { session_id: sessionId });

    // Toggle
    const toggle = root.querySelector('.mpa-toggle');
    const closeBtn = root.querySelector('.mpa-header-close');
    
    function toggleOpen() {
      isOpen = !isOpen;
      root.classList.toggle('mpa-open', isOpen);
      toggle.classList.remove('mpa-has-notif');
      if (isOpen) root.querySelector('#mpa-input').focus();
    }

    toggle.addEventListener('click', toggleOpen);
    closeBtn.addEventListener('click', toggleOpen);

    // Send
    const input = root.querySelector('#mpa-input');
    const sendBtn = root.querySelector('#mpa-send');

    function send() {
      const t = input.value.trim();
      if (!t) return;
      addUserMsg(t);
      input.value = '';
      showTyping();
      setTimeout(() => { hideTyping(); processMessage(t); }, 500 + Math.random() * 700);
    }

    sendBtn.addEventListener('click', send);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });

    // Welcome message after delay
    setTimeout(() => {
      addBotMsg(`What's up! Welcome to <strong>MPA Motorsports & Offroad</strong>. I can help with service info, scheduling, quotes, and builds. What are you working with?`, ['View Services','Book Appointment','Get a Quote','Hours & Location'], 'greeting');
      // Show notification dot if chat is closed
      if (!isOpen) toggle.classList.add('mpa-has-notif');
    }, 2000);

    // Expose for service card clicks
    window._mpaWidget = { svcClick };
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
