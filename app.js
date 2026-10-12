/* LearnAI: personalized AI micro-courses. All data stays in this browser. */
(() => {
  "use strict";

  const SDK_URL = "https://cdn.jsdelivr.net/npm/@anthropic-ai/sdk@0.128.0/+esm";
  const MODELS = {
    "claude-opus-5-5": { label: "Claude Opus 5.5", note: "Best quality (recommended)", effort: "medium", fallbacks: true },
    "claude-sonnet-5-5": { label: "Claude Sonnet 5.5", note: "Faster, lower cost", effort: "low", fallbacks: true },
    "claude-haiku-5-5": { label: "Claude Haiku 5.5", note: "Fastest, cheapest", effort: "low", fallbacks: false },
  };
  const LENGTHS = { quick: 3, standard: 5, deep: 7 };
  const XP = { lessonDone: 50, correct: 10, courseDone: 100, simDone: 20 };
  const RANKS = ["Ground Crew", "Launch Tech", "Flight Engineer", "Mission Specialist", "Payload Commander", "Astronaut", "Orbital Legend"];
  const SUGGESTIONS = [
    "AI agents for procurement", "Predictive analytics for supplier risk", "Prompt engineering basics",
    "Machine learning for demand forecasting", "AI for customs & trade compliance", "Using AI with Excel data",
    "RAG: chat with your documents", "Computer vision for quality inspection", "AI ethics & responsible use",
  ];
  const GEN_MESSAGES = [
    "Fueling the rocket with knowledge… ⛽", "Mapping AI to your career… 🗺️", "Writing bite-sized theory… ✍️",
    "Cooking up real-world examples… 🍳", "Clearing customs for your quiz… 🛃", "Running pre-flight checks… ✅",
    "Calculating orbital trajectory… 🛰️", "Almost there, T-minus a few seconds… ⏳",
  ];

  // ---------- storage ----------
  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem("learnai." + key); return v ? JSON.parse(v) : fallback; }
      catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem("learnai." + key, JSON.stringify(value)); } catch { /* storage full or blocked */ }
    },
  };

  const DEFAULT_PROFILE = {
    name: "",
    level: "beginner",
    length: "quick",
    roles: [
      {
        title: "International Supply Chain",
        company: "Blue Origin",
        details: "Global sourcing and supplier management, international logistics, import/export and customs, trade compliance (ITAR/EAR), aerospace parts and materials.",
      },
    ],
    interests: "",
  };

  const state = {
    profile: store.get("profile", DEFAULT_PROFILE),
    apiKey: store.get("apiKey", ""),
    model: store.get("model", "claude-opus-5-5"),
    courses: store.get("courses", []),
    xp: store.get("xp", 0),
    streak: store.get("streak", { count: 0, last: null }),
    tab: "home",
  };
  if (!MODELS[state.model]) state.model = "claude-opus-5-5";
  // Keep the built-in sample course in sync with the latest version shipped with the app.
  state.courses.forEach((c) => { if (c.sample) c.course = window.SAMPLE_COURSE; });

  const save = () => {
    store.set("profile", state.profile);
    store.set("apiKey", state.apiKey);
    store.set("model", state.model);
    store.set("courses", state.courses);
    store.set("xp", state.xp);
    store.set("streak", state.streak);
  };

  // ---------- helpers ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const app = $("#app");
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // Escape first, then allow **bold** and *italic*.
  const md = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/(^|[^*])\*(?!\s)(.+?)\*/g, "$1<i>$2</i>");
  const today = () => new Date().toLocaleDateString("en-CA");
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const rank = (xp) => RANKS[Math.min(RANKS.length - 1, Math.floor(xp / 200))];

  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove("show"), 2200);
  }

  function addXP(n) {
    state.xp += n;
    save();
    renderStats(true);
  }

  function touchStreak() {
    const t = today();
    if (state.streak.last === t) return;
    const y = new Date(); y.setDate(y.getDate() - 1);
    state.streak.count = state.streak.last === y.toLocaleDateString("en-CA") ? state.streak.count + 1 : 1;
    state.streak.last = t;
    save();
    renderStats(true);
    if (state.streak.count > 1) toast(`🔥 ${state.streak.count}-day streak!`);
  }

  function renderStats(bump) {
    const y = new Date(); y.setDate(y.getDate() - 1);
    const alive = state.streak.last === today() || state.streak.last === y.toLocaleDateString("en-CA");
    $("#streakCount").textContent = alive ? state.streak.count : 0;
    $("#xpCount").textContent = state.xp;
    if (bump) $$(".pill").forEach((p) => { p.classList.remove("bump"); void p.offsetWidth; p.classList.add("bump"); });
  }

  // ---------- confetti ----------
  function confetti(amount = 120) {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = $("#confetti");
    const ctx = c.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    c.width = innerWidth * dpr; c.height = innerHeight * dpr;
    ctx.scale(dpr, dpr);
    const colors = ["#7c5cff", "#22d3ee", "#f472b6", "#fbbf24", "#34d399", "#ffffff"];
    const parts = Array.from({ length: amount }, () => ({
      x: innerWidth / 2 + (Math.random() - 0.5) * 80, y: innerHeight * 0.35,
      vx: (Math.random() - 0.5) * 12, vy: Math.random() * -12 - 4,
      r: Math.random() * 6 + 4, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3,
      color: colors[(Math.random() * colors.length) | 0], life: 0,
    }));
    let frame = 0;
    (function tick() {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      parts.forEach((p) => {
        p.vy += 0.35; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.color; ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2);
        ctx.restore();
      });
      if (++frame < 150) requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, innerWidth, innerHeight);
    })();
  }

  // ---------- navigation ----------
  function setTab(tab) {
    state.tab = tab;
    document.body.classList.remove("in-lesson");
    $$(".tab").forEach((b) => b.classList.toggle("on", b.dataset.tab === tab));
    ({ home: renderHome, library: renderLibrary, profile: renderProfile })[tab]();
    window.scrollTo(0, 0);
  }
  $$(".tab").forEach((b) => b.addEventListener("click", () => setTab(b.dataset.tab)));

  function view(html) {
    app.innerHTML = `<div class="view">${html}</div>`;
    window.scrollTo(0, 0);
  }

  function courseProgress(c) {
    const total = c.course.lessons.length;
    const done = c.course.lessons.filter((_, i) => c.progress[i]?.done).length;
    return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
  }

  function courseItem(c) {
    const p = courseProgress(c);
    return `<button class="course-item" data-open="${c.id}">
      <div class="course-emoji">${esc(c.course.emoji || "📘")}</div>
      <div class="meta"><b>${esc(c.course.title)}</b><span class="muted small">${p.done}/${p.total} lessons · ${esc(c.course.minutes || "")} min${c.sample ? " · sample" : ""}</span></div>
      <div class="ring" style="--p:${p.pct}"><span>${p.pct}%</span></div>
    </button>`;
  }

  function bindCourseItems() {
    $$("[data-open]").forEach((b) => b.addEventListener("click", () => openCourse(b.dataset.open)));
  }

  // ---------- home ----------
  function renderHome() {
    const name = state.profile.name ? `, ${esc(state.profile.name)}` : "";
    const lvlXP = state.xp % 200;
    const recent = state.courses.slice(0, 3);
    const hasSample = state.courses.some((c) => c.sample);
    view(`
      <section class="hero">
        <h1>Hey${name} <span class="wave">👋</span><br><span class="gradient-text">What do you want to learn about AI?</span></h1>
        <p class="muted">Type a topic. I'll build a short, fun course with theory, examples and use cases from <b>your</b> career.</p>
      </section>

      <div class="card glow">
        <textarea id="topic" class="topic-input" maxlength="200" placeholder="e.g. How AI agents could automate purchase orders"></textarea>
        <div class="chips" id="chips">
          ${[...SUGGESTIONS].sort(() => Math.random() - 0.5).slice(0, 5).map((s) => `<button class="chip" data-s="${esc(s)}">${esc(s)}</button>`).join("")}
        </div>
        <span class="label">Course length · 3, 5 or 7 lessons</span>
        <div class="seg" id="lengthSeg">
          ${Object.entries({ quick: "⚡ Quick", standard: "📘 Standard", deep: "🚀 Deep" })
            .map(([k, v]) => `<button data-len="${k}" class="${state.profile.length === k ? "on" : ""}">${v}</button>`).join("")}
        </div>
        <div class="row" style="margin-top:16px">
          <button class="btn ghost" id="surprise">🎲 Surprise me</button>
          <button class="btn primary" id="build">Build course 🚀</button>
        </div>
      </div>

      <div class="card">
        <div class="row" style="align-items:center">
          <div><b>${esc(rank(state.xp))}</b><div class="muted small">${state.xp} XP · ${200 - lvlXP} XP to next rank</div></div>
          <div style="flex:none;font-size:34px">🏅</div>
        </div>
        <div class="level-bar" style="margin-top:10px"><div style="width:${(lvlXP / 200) * 100}%"></div></div>
      </div>

      ${recent.length ? `<h2>Continue learning</h2>${recent.map(courseItem).join("")}` : ""}
      ${!hasSample ? `<button class="btn block ghost" id="trySample">🛰️ Try a sample course (no API key needed)</button>` : ""}
    `);

    const topic = $("#topic");
    $$("#chips .chip").forEach((c) => c.addEventListener("click", () => {
      topic.value = c.dataset.s;
      $$("#chips .chip").forEach((x) => x.classList.toggle("on", x === c));
    }));
    $$("#lengthSeg button").forEach((b) => b.addEventListener("click", () => {
      state.profile.length = b.dataset.len; save();
      $$("#lengthSeg button").forEach((x) => x.classList.toggle("on", x === b));
    }));
    $("#surprise").addEventListener("click", () => {
      topic.value = SUGGESTIONS[(Math.random() * SUGGESTIONS.length) | 0];
      topic.focus();
    });
    $("#build").addEventListener("click", () => {
      const t = topic.value.trim();
      if (!t) { toast("Type a topic first ✏️"); topic.focus(); return; }
      if (!state.apiKey) { toast("Add your Claude API key in Profile 🔑"); setTab("profile"); return; }
      generateCourse(t);
    });
    $("#trySample")?.addEventListener("click", addSample);
    bindCourseItems();
  }

  function addSample() {
    const c = { id: uid(), topic: "Sample", createdAt: Date.now(), sample: true, course: window.SAMPLE_COURSE, progress: {} };
    state.courses.unshift(c); save();
    openCourse(c.id);
  }

  // ---------- library ----------
  function renderLibrary() {
    view(`
      <h1>📚 Your library</h1>
      <p class="muted">${state.courses.length} course${state.courses.length === 1 ? "" : "s"}. Saved on this device.</p>
      ${state.courses.length ? state.courses.map(courseItem).join("") : `
        <div class="card center"><div style="font-size:54px">🌌</div><p>No courses yet. Go build your first one!</p>
        <button class="btn primary" id="goHome">Build a course</button></div>`}
    `);
    $("#goHome")?.addEventListener("click", () => setTab("home"));
    bindCourseItems();
  }

  // ---------- profile ----------
  function renderProfile() {
    const p = state.profile;
    view(`
      <h1>👩‍🚀 Your profile</h1>
      <p class="muted">Courses are tailored to these roles. Add your past and current jobs.</p>

      <div class="card">
        <span class="label" style="margin-top:0">Your name</span>
        <input class="field" id="pName" value="${esc(p.name)}" placeholder="First name" autocomplete="given-name">
        <span class="label">AI experience</span>
        <div class="seg" id="levelSeg">
          ${["beginner", "intermediate", "advanced"].map((l) => `<button data-l="${l}" class="${p.level === l ? "on" : ""}">${l[0].toUpperCase() + l.slice(1)}</button>`).join("")}
        </div>
        <span class="label">Interests & goals (optional)</span>
        <textarea class="field" id="pInterests" placeholder="e.g. Automate reporting, become the AI go-to person on my team">${esc(p.interests)}</textarea>
      </div>

      <h2>💼 Career roles</h2>
      <div id="roles">
        ${p.roles.map((r, i) => `
          <div class="role-card" data-i="${i}">
            <input class="field" data-k="title" value="${esc(r.title)}" placeholder="Role title">
            <input class="field" data-k="company" value="${esc(r.company)}" placeholder="Company / industry">
            <textarea class="field" data-k="details" placeholder="What you do: responsibilities, tools, challenges">${esc(r.details)}</textarea>
            <button class="btn small ghost danger" data-del="${i}">Remove</button>
          </div>`).join("")}
      </div>
      <button class="btn block ghost" id="addRole">＋ Add a role</button>

      <h2>🔑 AI engine</h2>
      <div class="card">
        <p class="small muted">Courses are generated by Claude using your own Anthropic API key. Get one at
          <a class="link" href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener">console.anthropic.com</a>.
          The key is stored only in this browser and sent only to Anthropic.</p>
        <input class="field" id="pKey" type="password" value="${esc(state.apiKey)}" placeholder="sk-ant-…" autocomplete="off" autocapitalize="off" spellcheck="false">
        <span class="label">Model</span>
        <select class="field" id="pModel">
          ${Object.entries(MODELS).map(([id, m]) => `<option value="${id}" ${state.model === id ? "selected" : ""}>${m.label}: ${m.note}</option>`).join("")}
        </select>
      </div>

      <div class="note">🛡️ <b>Aerospace safety tip:</b> don't put export-controlled (ITAR/EAR) technical data or proprietary company info in your profile or topics. Keep them general.</div>

      <button class="btn primary block" id="saveProfile" style="margin-top:16px">Save profile ✅</button>

      <h2>📲 Install on iPhone</h2>
      <div class="card small">In Safari tap <b>Share</b> → <b>Add to Home Screen</b>. LearnAI will open full-screen like a native app.</div>

      <button class="btn block ghost danger" id="reset" style="margin-top:8px">Reset all data</button>
    `);

    $$("#levelSeg button").forEach((b) => b.addEventListener("click", () => {
      $$("#levelSeg button").forEach((x) => x.classList.toggle("on", x === b));
    }));

    const collect = () => {
      p.name = $("#pName").value.trim();
      p.level = $("#levelSeg .on")?.dataset.l || "beginner";
      p.interests = $("#pInterests").value.trim();
      p.roles = $$("#roles .role-card").map((card) => ({
        title: $('[data-k="title"]', card).value.trim(),
        company: $('[data-k="company"]', card).value.trim(),
        details: $('[data-k="details"]', card).value.trim(),
      }));
      state.apiKey = $("#pKey").value.trim();
      state.model = $("#pModel").value;
    };

    $("#addRole").addEventListener("click", () => {
      collect();
      p.roles.push({ title: "", company: "", details: "" });
      renderProfile();
      $$("#roles .role-card").pop().querySelector("input").focus();
    });
    $$("[data-del]").forEach((b) => b.addEventListener("click", () => {
      collect();
      p.roles.splice(+b.dataset.del, 1);
      renderProfile();
    }));
    $("#saveProfile").addEventListener("click", () => {
      collect();
      p.roles = p.roles.filter((r) => r.title || r.company || r.details);
      save();
      toast("Profile saved 🎉");
      renderStats();
      setTab("home");
    });
    $("#reset").addEventListener("click", () => {
      if (!confirm("Delete all courses, XP, profile and API key from this device?")) return;
      Object.keys(localStorage).filter((k) => k.startsWith("learnai.")).forEach((k) => localStorage.removeItem(k));
      location.reload();
    });
  }

  // ---------- course generation ----------
  const str = { type: "string" };
  const arr = (items) => ({ type: "array", items });
  const obj = (props) => ({ type: "object", properties: props, required: Object.keys(props), additionalProperties: false });
  const COURSE_SCHEMA = obj({
    title: str, emoji: str, tagline: str, why_it_matters: str, minutes: { type: "integer" },
    lessons: arr(obj({
      title: str, emoji: str, minutes: { type: "integer" },
      theory: obj({ hook: str, points: arr(str), analogy: str }),
      key_terms: arr(obj({ term: str, definition: str })),
      example: obj({ role: str, title: str, scenario: str, steps: arr(str), outcome: str }),
      use_cases: arr(obj({ role: str, title: str, description: str, impact: str })),
      simulation: obj({
        title: str, setting: str, objective: str,
        artifacts: arr(obj({ kind: { type: "string", enum: ["email", "table", "document", "note"] }, title: str, content: str })),
        checkpoints: arr(obj({
          situation: str,
          options: arr(obj({ text: str, rating: { type: "string", enum: ["best", "okay", "risky"] }, consequence: str })),
        })),
        build: obj({ task: str, deliverable: { type: "string", enum: ["ai_prompt", "plan"] }, hint: str, rubric: arr(str), model_answer: str }),
      }),
      try_it: obj({ instructions: str, prompt: str }),
      quiz: arr(obj({ question: str, options: arr(str), answer_index: { type: "integer" }, explanation: str })),
    })),
    cheat_sheet: arr(str),
    final_challenge: obj({ title: str, description: str }),
    next_topics: arr(str),
  });

  const SYSTEM_PROMPT = `You are LearnAI, an upbeat, expert instructor who designs short, practical micro-courses about artificial intelligence for working professionals.

Write for someone reading on a phone: short sentences, plain language, no fluff, a little playful energy and the occasional emoji. Explain jargon the first time it appears. You may use **bold** for emphasis; use no other markdown.

Every course must:
- Teach simple, accurate theory that builds lesson by lesson.
- Tie examples and use cases directly to the learner's real career roles, labelling each with the role it relates to (use the exact role label you are given, or "Any role" for general ones). Spread examples across the learner's roles, and include at least one per lesson for an International Supply Chain role when the learner has one.
- Keep scenarios realistic but generic and fictional. Never claim knowledge of a specific company's internal processes, data, suppliers or programs.
- Where relevant (especially aerospace and international trade), model safe AI use: use only company-approved tools, never paste export-controlled (ITAR/EAR) technical data or proprietary information into AI tools, anonymize data, and keep a human in the loop for regulated decisions.
- Be honest about AI limitations; do not invent statistics or cite fake sources. Prefer qualitative impact statements (e.g. "saves a few hours a week") over precise numbers.

Lesson structure:
- theory: a one-sentence hook, 3-5 short points, and a memorable analogy drawn from the learner's work.
- key_terms: 2-4 terms with one-sentence definitions.
- example: one hands-on worked example in the learner's job with 3-5 concrete steps and the outcome.
- use_cases: 2-3 use cases, each with a short impact line starting with an emoji.
- simulation: the heart of the lesson. A realistic, hands-on workplace mission where the learner applies the concept themselves (the worked example showed it; now they do it). Set it in one of the learner's roles, using the International Supply Chain role for at least half the lessons when they have one.
  - setting: 2-3 sentences: who they are, what's happening, the deadline or stakes. objective: what they must accomplish.
  - artifacts: 1-3 fictional work materials to work with (kind email, table, document or note). Make them feel real and a little messy: mixed formats or units, a buried key detail, a conflicting date or number, and where relevant one item that must not go into an AI tool (e.g. proprietary pricing or something marked export-controlled). For tables, put a header row first, one row per line, cells separated by " | ". Invent all names, companies and part numbers.
  - checkpoints: exactly 2 judgment calls with 3 options each. Rate exactly one option "best", one "okay" and one "risky", in varied order. Checkpoint 1 happens before the build (e.g. what data to give the AI, which approach). Checkpoint 2 happens after the AI step (e.g. the output has an error, or a stakeholder wants to skip review). Each consequence is 1-2 sentences describing what realistically happens next.
  - build: the core hands-on task, applied to the artifacts. Use deliverable "ai_prompt" when the learner should write the instructions they would give an AI assistant; the app actually runs their prompt on the artifacts and shows the output. Use "plan" when the concept needs a short implementation plan, workflow, spec or decision instead (e.g. designing an AI agent or a forecasting pilot). task is a clear instruction, hint is one nudge that doesn't give the answer away, rubric has 3-5 specific checkable criteria, and model_answer is a strong reference answer.
- try_it: a ready-to-copy prompt the learner can use at work this week (with [placeholders] for their own non-sensitive details), so they transfer the skill to real life.
- quiz: exactly 2 multiple-choice questions with 4 options each, answer_index is 0-based, plus a short explanation. Vary the position of the correct answer.

Also provide a 5-7 item cheat_sheet, a fun one-week final_challenge, and 3 next_topics. Each emoji field holds a single emoji.`;

  function buildUserPrompt(topic) {
    const p = state.profile;
    const roles = p.roles.length ? p.roles : DEFAULT_PROFILE.roles;
    const roleText = roles.map((r) => {
      const label = [r.title, r.company].filter(Boolean).join(" @ ");
      return `- Role label: "${label}"${r.details ? `\n  What they do: ${r.details}` : ""}`;
    }).join("\n");
    return `Create a micro-course.

<topic>${topic}</topic>

<learner>
Name: ${p.name || "(not given)"}
AI experience level: ${p.level}
Career roles:
${roleText}
${p.interests ? `Interests and goals: ${p.interests}` : ""}
</learner>

Number of lessons: exactly ${LENGTHS[p.length] || 3}. Each lesson should take 3-6 minutes.`;
  }

  // ---------- Claude helpers ----------
  let sdkPromise = null;
  async function getClient() {
    sdkPromise ||= import(SDK_URL).catch((e) => { sdkPromise = null; throw e; });
    const { default: Anthropic } = await sdkPromise;
    return new Anthropic({ apiKey: state.apiKey, dangerouslyAllowBrowser: true });
  }

  function buildParams({ system, user, maxTokens, effort, schema }) {
    const m = MODELS[state.model];
    const params = {
      model: state.model,
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: user }],
      output_config: { effort: effort || m.effort },
    };
    if (schema) params.output_config.format = { type: "json_schema", schema };
    if (m.fallbacks) {
      params.betas = ["server-side-fallback-2026-07-01"];
      params.fallbacks = "default";
    }
    return params;
  }

  function messageText(msg) {
    if (msg.stop_reason === "refusal") throw new Error("The AI declined this request. Try rephrasing it.");
    if (msg.stop_reason === "max_tokens") throw new Error("The response came out too long. Try something shorter.");
    return msg.content.filter((b) => b.type === "text").map((b) => b.text).join("");
  }

  function friendlyError(err) {
    const status = err?.status;
    const msg = err?.message || "Something went wrong.";
    if (status === 401) return "Your API key was rejected. Double-check it in Profile.";
    if (status === 429) return "Rate limit hit. Wait a minute and try again.";
    if (status === 529 || status >= 500) return "Claude is busy right now. Please try again shortly.";
    if (err instanceof SyntaxError) return "The response got scrambled in transit. Please try again.";
    if (!status && /connection|fetch|import|module|network/i.test(msg)) return "Couldn't reach Claude. Check your internet connection and try again.";
    return msg;
  }

  async function generateCourse(topic) {
    document.body.classList.add("in-lesson");
    view(`
      <div class="launch">
        <div class="rocket-big">🚀</div><div class="exhaust"></div>
        <div class="gen-msg" id="genMsg">${GEN_MESSAGES[0]}</div>
        <div class="progress"><div id="genBar"></div></div>
        <p class="muted small">Building “${esc(topic)}” for your career. This usually takes 1–2 minutes.</p>
        <button class="btn ghost small" id="cancelGen">Cancel</button>
      </div>`);

    let i = 0;
    const msgTimer = setInterval(() => { $("#genMsg") && ($("#genMsg").textContent = GEN_MESSAGES[++i % GEN_MESSAGES.length]); }, 3500);
    const lessons = LENGTHS[state.profile.length] || 3;
    const expectedChars = 5200 * lessons + 1500;
    let chars = 0, stream = null, cancelled = false;
    const bar = () => { const b = $("#genBar"); if (b) b.style.width = Math.min(96, 4 + (chars / expectedChars) * 92) + "%"; };
    bar();
    $("#cancelGen").addEventListener("click", () => { cancelled = true; stream?.abort(); });

    try {
      const client = await getClient();
      stream = client.beta.messages.stream(buildParams({
        system: SYSTEM_PROMPT,
        user: buildUserPrompt(topic),
        maxTokens: 64000,
        schema: COURSE_SCHEMA,
      }));
      stream.on("text", (delta) => { chars += delta.length; bar(); });
      const course = JSON.parse(messageText(await stream.finalMessage()));
      if (!course?.lessons?.length) throw new Error("The course came back empty. Please try again.");

      const c = { id: uid(), topic, createdAt: Date.now(), course, progress: {} };
      state.courses.unshift(c);
      save();
      clearInterval(msgTimer);
      confetti(160);
      toast("Course ready! 🎉");
      openCourse(c.id);
    } catch (err) {
      clearInterval(msgTimer);
      if (cancelled) { toast("Cancelled"); setTab("home"); return; }
      console.error(err);
      renderGenError(topic, err);
    }
  }

  function renderGenError(topic, err) {
    const status = err?.status;
    const msg = friendlyError(err);
    view(`
      <div class="card center" style="margin-top:30px">
        <div style="font-size:64px">🛸</div>
        <h2>Houston, we have a problem</h2>
        <p class="muted">${esc(msg)}</p>
        <div class="row" style="margin-top:14px">
          <button class="btn ghost" id="back">Back</button>
          <button class="btn primary" id="retry">Retry 🔁</button>
        </div>
      </div>`);
    $("#back").addEventListener("click", () => setTab(status === 401 ? "profile" : "home"));
    $("#retry").addEventListener("click", () => generateCourse(topic));
  }

  // ---------- course overview ----------
  function getCourse(id) { return state.courses.find((c) => c.id === id); }

  function openCourse(id) {
    const c = getCourse(id);
    if (!c) return setTab("home");
    document.body.classList.remove("in-lesson");
    const co = c.course;
    const p = courseProgress(c);
    const nextIdx = co.lessons.findIndex((_, i) => !c.progress[i]?.done);
    view(`
      <div class="lesson-head"><button class="icon-btn" id="back" aria-label="Back">←</button><div style="flex:1"></div>
        <button class="icon-btn" id="share" aria-label="Share">⤴︎</button>
        <button class="icon-btn" id="del" aria-label="Delete course">🗑️</button></div>
      <div class="course-hero">
        <div class="big-emoji">${esc(co.emoji || "📘")}</div>
        <h1>${esc(co.title)}</h1>
        <p class="muted">${md(co.tagline)}</p>
      </div>
      <div class="card">
        <div class="row" style="align-items:center"><b>${p.done}/${p.total} lessons</b><span class="muted small" style="text-align:right">⏱️ ~${esc(co.minutes)} min</span></div>
        <div class="level-bar" style="margin-top:10px"><div style="width:${p.pct}%"></div></div>
        ${co.why_it_matters ? `<p class="small" style="margin-top:12px">💡 ${md(co.why_it_matters)}</p>` : ""}
      </div>
      <h2>Lessons</h2>
      ${co.lessons.map((l, i) => `
        <button class="lesson-row ${c.progress[i]?.done ? "done" : ""} ${i === nextIdx ? "next" : ""}" data-l="${i}">
          <div class="num">${c.progress[i]?.done ? "✓" : i + 1}</div>
          <div class="meta"><b>${esc(l.emoji || "")} ${esc(l.title)}</b><div class="muted small">${esc(l.minutes || 4)} min${l.simulation ? " · 🎮 mission" : ""}${c.progress[i]?.done ? `${c.progress[i].sim != null ? ` · 🎮 ${c.progress[i].sim}` : ""} · quiz ${c.progress[i].score}/${l.quiz.length}` : ""}</div></div>
          <div>${i === nextIdx ? "▶️" : ""}</div>
        </button>`).join("")}
      ${p.done === p.total ? `<button class="btn warm block" id="finish">🏆 View certificate & cheat sheet</button>` : `
        <button class="btn primary block" id="start">${p.done ? "Continue" : "Start"} lesson ${nextIdx + 1} 🚀</button>`}
    `);
    $("#back").addEventListener("click", () => setTab(state.tab));
    $("#del").addEventListener("click", () => {
      if (!confirm("Delete this course?")) return;
      state.courses = state.courses.filter((x) => x.id !== id); save(); setTab("library");
    });
    $("#share").addEventListener("click", () => shareCourse(c));
    $$("[data-l]").forEach((b) => b.addEventListener("click", () => openLesson(id, +b.dataset.l)));
    $("#start")?.addEventListener("click", () => openLesson(id, nextIdx));
    $("#finish")?.addEventListener("click", () => renderComplete(id));
  }

  async function shareCourse(c) {
    const co = c.course;
    const text = `${co.emoji} ${co.title}\n\n${co.tagline}\n\n` +
      co.lessons.map((l, i) => `${i + 1}. ${l.title}`).join("\n") +
      `\n\nCheat sheet:\n${co.cheat_sheet.map((s) => "• " + s).join("\n")}`;
    try {
      if (navigator.share) await navigator.share({ title: co.title, text });
      else { await navigator.clipboard.writeText(text); toast("Copied to clipboard 📋"); }
    } catch { /* user cancelled share sheet */ }
  }

  // ---------- lesson player ----------
  const STEPS = [
    { key: "theory", tag: "🧠 Theory" },
    { key: "terms", tag: "🔤 Key terms" },
    { key: "example", tag: "🛠️ Worked example" },
    { key: "usecases", tag: "💼 Use cases for you" },
    { key: "sim", tag: "🎮 Mission simulation" },
    { key: "tryit", tag: "⚡ Try it now" },
    { key: "quiz", tag: "🎯 Quick recall" },
  ];

  function lessonSteps(lesson) {
    return STEPS.filter((s) => {
      if (s.key === "terms") return lesson.key_terms?.length;
      if (s.key === "sim") return !!lesson.simulation;
      // Lessons with a simulation move the try-it prompt to the lesson-complete screen.
      if (s.key === "tryit") return !lesson.simulation && lesson.try_it;
      return true;
    });
  }

  function openLesson(id, idx) {
    const c = getCourse(id);
    const lesson = c.course.lessons[idx];
    const steps = lessonSteps(lesson);
    const qState = { q: 0, score: 0, answered: false };
    const sim = newSimState();
    let step = 0;
    document.body.classList.add("in-lesson");

    const renderStep = () => {
      const s = steps[step];
      let body = "";
      if (s.key === "theory") {
        body = `<h1>${esc(lesson.emoji || "")} ${esc(lesson.title)}</h1>
          <p style="font-size:18px">${md(lesson.theory.hook)}</p>
          <ul class="bullets">${lesson.theory.points.map((x) => `<li>${md(x)}</li>`).join("")}</ul>
          ${lesson.theory.analogy ? `<div class="analogy">💡 <b>Think of it like this:</b> ${md(lesson.theory.analogy)}</div>` : ""}`;
      } else if (s.key === "terms") {
        body = `<h2 style="margin-top:0">Tap to reveal 👇</h2><div class="terms">
          ${lesson.key_terms.map((t) => `<div class="term"><b>${esc(t.term)}</b><div class="def">${md(t.definition)}</div></div>`).join("")}</div>`;
      } else if (s.key === "example") {
        const e = lesson.example;
        body = `<span class="role-badge">💼 ${esc(e.role)}</span><h2 style="margin-top:0">${esc(e.title)}</h2>
          <p>${md(e.scenario)}</p><ol class="steps">${e.steps.map((x) => `<li>${md(x)}</li>`).join("")}</ol>
          <div class="outcome">🎉 <b>Result:</b> ${md(e.outcome)}</div>
          ${lesson.simulation ? `<p class="muted small" style="margin-top:12px">👀 Watch closely. Next you'll run a mission like this yourself.</p>` : ""}`;
      } else if (s.key === "usecases") {
        body = `<h2 style="margin-top:0">Where this shows up in your work</h2>
          ${lesson.use_cases.map((u) => `<div class="usecase"><span class="role-badge">${esc(u.role)}</span><h3>${esc(u.title)}</h3>
            <p class="small" style="margin:0">${md(u.description)}</p><div class="impact">${esc(u.impact)}</div></div>`).join("")}`;
      } else if (s.key === "sim") {
        body = `<div id="simRoot"></div>`;
      } else if (s.key === "tryit") {
        body = tryItHtml(lesson.try_it);
      } else if (s.key === "quiz") {
        const q = lesson.quiz[qState.q];
        body = `<p class="muted small">Question ${qState.q + 1} of ${lesson.quiz.length} · +${XP.correct} XP each</p>
          <h2 style="margin-top:0">${md(q.question)}</h2>
          <div id="opts">${q.options.map((o, i) => `<button class="option" data-o="${i}">${md(o)}</button>`).join("")}</div>
          <div id="fb"></div>`;
      }

      const isQuiz = s.key === "quiz";
      const isSim = s.key === "sim";
      const nextLabel = isQuiz ? (qState.q < lesson.quiz.length - 1 ? "Next question →" : "Finish lesson 🏁")
        : isSim ? (sim.phase === "debrief" ? "Continue →" : "Complete the mission to continue") : "Continue →";
      app.innerHTML = `<div class="view">
        <div class="lesson-head"><button class="icon-btn" id="close" aria-label="Close">✕</button>
          <div class="dots">${steps.map((_, i) => `<span class="${i <= step ? "on" : ""}"></span>`).join("")}</div></div>
        <span class="step-tag">${s.tag}</span>
        <div class="card">${body}</div>
      </div>
      <div class="sticky-actions"><div class="inner">
        ${step > 0 && !isQuiz ? `<button class="btn ghost" id="prev" style="flex:.5">←</button>` : ""}
        <button class="btn primary" id="next" ${(isQuiz && !qState.answered) || (isSim && sim.phase !== "debrief") ? "disabled" : ""}>${nextLabel}</button>
      </div></div>`;
      window.scrollTo(0, 0);

      $("#close").addEventListener("click", () => openCourse(id));
      $("#prev")?.addEventListener("click", () => { step--; renderStep(); });
      $$(".term").forEach((t) => t.addEventListener("click", () => t.classList.toggle("open")));
      bindCopy(lesson.try_it);
      if (isSim) renderSim($("#simRoot"), lesson.simulation, sim, () => {
        const n = $("#next");
        n.disabled = false;
        n.textContent = "Continue →";
      });

      if (isQuiz) {
        const q = lesson.quiz[qState.q];
        $$("#opts .option").forEach((b) => b.addEventListener("click", () => {
          if (qState.answered) return;
          qState.answered = true;
          const pick = +b.dataset.o;
          const right = pick === q.answer_index;
          $$("#opts .option").forEach((o, i) => { if (i === q.answer_index) o.classList.add("correct"); });
          if (!right) b.classList.add("wrong");
          if (right) { qState.score++; addXP(XP.correct); confetti(60); }
          $("#fb").innerHTML = `<div class="feedback ${right ? "good" : "bad"}"><b>${right ? "🎉 Nailed it!" : "🙃 Not quite."}</b> ${md(q.explanation)}</div>`;
          $("#next").disabled = false;
        }));
      }

      $("#next").addEventListener("click", () => {
        if (!isQuiz) { step++; renderStep(); return; }
        if (qState.q < lesson.quiz.length - 1) { qState.q++; qState.answered = false; renderStep(); return; }
        finishLesson(id, idx, qState.score, sim.phase === "debrief" ? simScore(sim) : null);
      });
    };
    renderStep();
  }

  function tryItHtml(t) {
    return `<h2 style="margin-top:0">Your 2-minute mission</h2><p>${md(t.instructions)}</p>
      <div class="prompt-box">${esc(t.prompt)}</div>
      <button class="btn block" id="copyPrompt">📋 Copy prompt</button>
      <p class="muted small" style="margin-top:10px">🛡️ Use an approved tool and keep sensitive or export-controlled data out.</p>`;
  }

  function bindCopy(t) {
    $("#copyPrompt")?.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(t.prompt); toast("Prompt copied! Paste it into your AI tool ✨"); }
      catch { toast("Long-press the prompt to copy it"); }
    });
  }

  // ---------- mission simulation ----------
  // Flow: brief → checkpoint 1 → build (write it, run it on real AI, get rubric feedback, retry) → checkpoint 2 → debrief.
  const CP_POINTS = { best: 15, okay: 8, risky: 0 };

  function newSimState() {
    return { phase: "brief", picks: [], draft: "", aiOutput: "", review: null, best: null, attempts: 0, busy: false };
  }

  function simScore(sim) {
    const cp = sim.picks.reduce((n, r) => n + (CP_POINTS[r] || 0), 0);
    return Math.round((sim.best ?? 0) * 0.7 + cp);
  }

  function artifactHtml(a, open) {
    const icon = { email: "✉️", table: "📊", document: "📄", note: "🗒️" }[a.kind] || "📎";
    let body;
    if (a.kind === "table") {
      const rows = a.content.trim().split("\n")
        .filter((r) => r.trim() && !/^[\s|:+-]+$/.test(r))
        .map((r) => r.trim().replace(/^\||\|$/g, "").split("|").map((x) => x.trim()));
      body = `<div class="table-wrap"><table>${rows.map((r, i) =>
        `<tr>${r.map((cell) => i === 0 ? `<th>${esc(cell)}</th>` : `<td>${esc(cell)}</td>`).join("")}</tr>`).join("")}</table></div>`;
    } else {
      body = `<div class="artifact-text">${esc(a.content)}</div>`;
    }
    return `<details class="artifact" ${open ? "open" : ""}><summary>${icon} ${esc(a.title)}</summary>${body}</details>`;
  }

  function renderSim(root, s, sim, onDone) {
    const artifacts = (open) => s.artifacts.map((a) => artifactHtml(a, open)).join("");
    const cpIdx = sim.phase === "cp0" ? 0 : 1;

    if (sim.phase === "brief") {
      root.innerHTML = `
        <div class="sim-hud"><span>🎮 MISSION</span><span>Hands-on</span></div>
        <h2 style="margin-top:6px">${esc(s.title)}</h2>
        <p>${md(s.setting)}</p>
        <div class="objective">🎯 <b>Your objective:</b> ${md(s.objective)}</div>
        <span class="label">📎 Your files</span>
        ${artifacts(false)}
        <p class="muted small">All people, companies and data in this mission are fictional.</p>
        <button class="btn primary block" id="simGo">Start mission 🚀</button>`;
      $("#simGo", root).addEventListener("click", () => { sim.phase = s.checkpoints.length ? "cp0" : "build"; renderSim(root, s, sim, onDone); });
    } else if (sim.phase === "cp0" || sim.phase === "cp1") {
      const cp = s.checkpoints[cpIdx];
      root.innerHTML = `
        <div class="sim-hud"><span>⚠️ JUDGMENT CALL ${cpIdx + 1}</span><span>${cpIdx === 0 ? "Before you start" : "After the AI step"}</span></div>
        <p style="font-size:17px;margin-top:8px">${md(cp.situation)}</p>
        <div id="cpOpts">${cp.options.map((o, i) => `<button class="option" data-o="${i}">${md(o.text)}</button>`).join("")}</div>
        <div id="cpFb"></div>`;
      $$("#cpOpts .option", root).forEach((b) => b.addEventListener("click", () => {
        if (sim.picks[cpIdx]) return;
        const o = cp.options[+b.dataset.o];
        sim.picks[cpIdx] = o.rating;
        $$("#cpOpts .option", root).forEach((x, i) => {
          const r = cp.options[i].rating;
          if (r === "best") x.classList.add("correct");
          if (x === b && r !== "best") x.classList.add(r === "okay" ? "okay" : "wrong");
          x.disabled = true;
        });
        const best = cp.options.find((x) => x.rating === "best");
        const label = { best: "🌟 Great call!", okay: "🤔 Workable, but not ideal.", risky: "🚨 Risky move." }[o.rating];
        if (o.rating === "best") { addXP(5); confetti(50); }
        $("#cpFb", root).innerHTML = `<div class="feedback ${o.rating === "best" ? "good" : "bad"}"><b>${label}</b> ${md(o.consequence)}
          ${o.rating !== "best" && best ? `<p style="margin:8px 0 0"><b>Stronger move:</b> ${md(best.text)}. ${md(best.consequence)}</p>` : ""}</div>
          <button class="btn primary block" id="cpNext" style="margin-top:12px">Continue mission →</button>`;
        $("#cpNext", root).addEventListener("click", () => {
          sim.phase = cpIdx === 0 ? "build" : "debrief";
          if (sim.phase === "debrief") awardSim(sim);
          renderSim(root, s, sim, onDone);
          root.scrollIntoView({ behavior: "smooth" });
        });
      }));
    } else if (sim.phase === "build") {
      renderBuild(root, s, sim, () => {
        sim.phase = s.checkpoints.length > 1 ? "cp1" : "debrief";
        if (sim.phase === "debrief") awardSim(sim);
        renderSim(root, s, sim, onDone);
        root.scrollIntoView({ behavior: "smooth" });
      });
    } else if (sim.phase === "debrief") {
      const score = simScore(sim);
      const medal = score >= 85 ? "🥇" : score >= 65 ? "🥈" : "🥉";
      root.innerHTML = `
        <div class="center"><div class="badge-big" style="font-size:72px">${medal}</div>
        <h2 style="margin-top:4px">Mission debrief</h2>
        <div class="score-big">${score}<small>/100</small></div></div>
        <div class="debrief-row"><span>🛠️ Build quality</span><b>${sim.best ?? 0}/100</b></div>
        ${sim.picks.map((r, i) => `<div class="debrief-row"><span>⚠️ Judgment call ${i + 1}</span><b>${{ best: "🌟 Best", okay: "🤔 Okay", risky: "🚨 Risky" }[r]}</b></div>`).join("")}
        <div class="debrief-row"><span>🔁 Attempts</span><b>${sim.attempts}</b></div>
        <p class="muted small" style="margin-top:12px">${score >= 85 ? "You'd be ready to do this for real. 🚀" : "Tip: you can come back and replay this mission any time to beat your score."}</p>`;
      onDone();
    }
  }

  function awardSim(sim) {
    if (sim.awarded) return;
    sim.awarded = true;
    addXP(XP.simDone + Math.round(simScore(sim) / 5));
  }

  function renderBuild(root, s, sim, next) {
    const b = s.build;
    const canAI = !!state.apiKey && navigator.onLine !== false;
    const isPrompt = b.deliverable === "ai_prompt";
    root.innerHTML = `
      <div class="sim-hud"><span>🛠️ BUILD IT</span><span>${isPrompt ? "Write the prompt · AI runs it" : "Write your plan"}</span></div>
      <p style="font-size:17px;margin-top:8px">${md(b.task)}</p>
      <details class="artifact"><summary>📎 Files (${s.artifacts.length})</summary>${s.artifacts.map((a) => artifactHtml(a, true)).join("")}</details>
      <details class="artifact"><summary>💡 Hint</summary><div class="artifact-text">${md(b.hint)}</div></details>
      <textarea id="draft" class="field draft" placeholder="${isPrompt ? "Type the prompt you'd give the AI assistant…" : "Type your plan, step by step…"}">${esc(sim.draft)}</textarea>
      <p class="muted small">🛡️ Practice space with fictional data. At work, use only approved tools.</p>
      <div id="buildBtns"></div>
      <div id="aiOut">${sim.aiOutput ? copilotHtml(sim.aiOutput) : ""}</div>
      <div id="review">${sim.review ? reviewHtml(sim.review, s) : ""}</div>`;

    const draft = $("#draft", root);
    draft.addEventListener("input", () => { sim.draft = draft.value; });

    const renderBtns = () => {
      const btns = $("#buildBtns", root);
      if (sim.busy) { btns.innerHTML = `<button class="btn block" disabled>⏳ Working…</button>`; return; }
      btns.innerHTML = canAI
        ? `<div class="row">${isPrompt ? `<button class="btn" id="runOnly">▶ Test run</button>` : ""}
            <button class="btn primary" id="submit">${isPrompt ? "🚀 Run & get feedback" : "📝 Get feedback"}</button></div>
           <button class="btn ghost small block" id="selfCheck" style="margin-top:8px">Check it myself instead</button>`
        : `<button class="btn primary block" id="selfCheck">📝 Check my work</button>
           <p class="muted small center">Add an API key in Profile to have AI run your work and coach you.</p>`;
      $("#runOnly", root)?.addEventListener("click", () => go(false));
      $("#submit", root)?.addEventListener("click", () => go(true));
      $("#selfCheck", root).addEventListener("click", () => selfCheck());
    };

    const tooShort = () => {
      if (sim.draft.trim().length >= 15) return false;
      toast("Write a bit more first ✏️"); draft.focus(); return true;
    };

    const go = async (grade) => {
      if (tooShort()) return;
      sim.busy = true; renderBtns();
      $("#review", root).innerHTML = "";
      try {
        if (isPrompt) {
          $("#aiOut", root).innerHTML = copilotHtml("", true);
          sim.aiOutput = await runLearnerPrompt(s, sim.draft, (text) => {
            const el = $("#copilotText", root); if (el) el.textContent = text;
          });
          $("#aiOut", root).innerHTML = copilotHtml(sim.aiOutput);
        }
        if (grade) {
          $("#review", root).innerHTML = `<div class="review"><div class="center muted">🧑‍🏫 Your coach is reviewing your work…</div></div>`;
          const r = await gradeWork(s, sim.draft, isPrompt ? sim.aiOutput : "");
          sim.attempts++;
          sim.review = r;
          sim.best = Math.max(sim.best ?? 0, r.score);
          $("#review", root).innerHTML = reviewHtml(r, s);
          if (r.score >= 85) confetti(90);
          bindReview();
          $("#review", root).scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } catch (err) {
        console.error(err);
        $("#review", root).innerHTML = `<div class="feedback bad">🛸 ${esc(friendlyError(err))} You can retry, or check your work yourself.</div>`;
      } finally {
        sim.busy = false; renderBtns();
      }
    };

    const selfCheck = () => {
      if (tooShort()) return;
      $("#review", root).innerHTML = `<div class="review">
        <h3>📋 Self-check: tick what your answer covers</h3>
        ${b.rubric.map((r, i) => `<label class="check"><input type="checkbox" data-r="${i}"> <span>${md(r)}</span></label>`).join("")}
        <details class="artifact" open><summary>👀 Expert answer to compare</summary><div class="artifact-text">${esc(b.model_answer)}</div></details>
        <button class="btn primary block" id="selfDone">Score my work</button></div>`;
      $("#selfDone", root).addEventListener("click", () => {
        const ticked = $$("[data-r]:checked", root).length;
        const score = Math.round((ticked / Math.max(1, b.rubric.length)) * 100);
        sim.attempts++;
        sim.best = Math.max(sim.best ?? 0, score);
        sim.review = {
          score, headline: score >= 80 ? "Solid work!" : "Good start. Compare with the expert answer and try again.",
          criteria: b.rubric.map((r, i) => ({ criterion: r, status: $(`[data-r="${i}"]`, root).checked ? "met" : "missed", feedback: "" })),
          strength: "", next_step: "", improved_version: "", self: true,
        };
        $("#review", root).innerHTML = reviewHtml(sim.review, s);
        bindReview();
      });
    };

    const bindReview = () => {
      $("#retry", root)?.addEventListener("click", () => { draft.focus(); draft.scrollIntoView({ behavior: "smooth", block: "center" }); });
      $("#buildNext", root)?.addEventListener("click", next);
    };

    renderBtns();
    bindReview();
  }

  function copilotHtml(text, loading) {
    return `<div class="copilot"><div class="copilot-head">🤖 AI assistant output ${loading ? '<span class="typing"><i></i><i></i><i></i></span>' : ""}</div>
      <div class="copilot-text" id="copilotText">${esc(text)}</div></div>`;
  }

  function reviewHtml(r, s) {
    const icon = { met: "✅", partly: "🟡", missed: "❌" };
    return `<div class="review">
      <div class="review-top"><div class="ring big" style="--p:${r.score}"><span>${r.score}</span></div>
        <div><b>${md(r.headline)}</b>${r.self ? "" : `<div class="muted small">AI coach feedback</div>`}</div></div>
      <ul class="criteria">${r.criteria.map((c) => `<li><span>${icon[c.status] || "•"}</span><div><b>${md(c.criterion)}</b>${c.feedback ? `<div class="small muted">${md(c.feedback)}</div>` : ""}</div></li>`).join("")}</ul>
      ${r.strength ? `<p class="small">💪 <b>What worked:</b> ${md(r.strength)}</p>` : ""}
      ${r.next_step ? `<p class="small">🎯 <b>Level up:</b> ${md(r.next_step)}</p>` : ""}
      ${r.improved_version ? `<details class="artifact"><summary>✨ Your answer, upgraded</summary><div class="artifact-text">${esc(r.improved_version)}</div></details>` : ""}
      ${!r.self ? `<details class="artifact"><summary>👀 Expert answer</summary><div class="artifact-text">${esc(s.build.model_answer)}</div></details>` : ""}
      <div class="row" style="margin-top:12px"><button class="btn" id="retry">✏️ Revise & retry</button><button class="btn primary" id="buildNext">Continue →</button></div>
    </div>`;
  }

  const RUN_SYSTEM = `You are a general-purpose AI assistant being used inside a workplace training simulation. The attached workplace materials are fictional.

Respond exactly as a capable AI assistant would to the user's request, using the attached materials when relevant. Follow the request as written: if it is vague, give a reasonable but generic answer rather than guessing what a trainer would want, so the learner sees the real effect of their prompt. Do not grade, coach or mention that this is a simulation. Keep the answer under 250 words unless the user asks for something longer. Plain text only; simple "-" bullets and line breaks are fine.`;

  const GRADE_SYSTEM = `You are the coach in LearnAI, a hands-on AI training app for working professionals. You assess a learner's work on a simulated workplace task against a rubric.

Give feedback that is specific and actionable: refer to what the learner actually wrote (and to what the AI produced from it, when provided), say exactly what to change, and keep it encouraging. Credit valid approaches that differ from the reference answer. Score honestly: 90+ excellent, 70-89 solid, 50-69 partial, under 50 missing key elements.

Watch for safe-AI-use issues (sharing export-controlled or proprietary data, skipping human review of regulated decisions, trusting AI output without verification) and call them out when present.

Write short, phone-friendly sentences. **bold** is the only markdown allowed. improved_version is the learner's own answer rewritten to score 90+, keeping their approach and voice.`;

  const REVIEW_SCHEMA = obj({
    score: { type: "integer" },
    headline: str,
    criteria: arr(obj({ criterion: str, status: { type: "string", enum: ["met", "partly", "missed"] }, feedback: str })),
    strength: str,
    next_step: str,
    improved_version: str,
  });

  const materialsText = (s) => s.artifacts.map((a) => `<file title="${a.title}" type="${a.kind}">\n${a.content}\n</file>`).join("\n");

  async function runLearnerPrompt(s, prompt, onText) {
    const client = await getClient();
    const stream = client.beta.messages.stream(buildParams({
      system: RUN_SYSTEM,
      user: `<attached_materials>\n${materialsText(s)}\n</attached_materials>\n\n${prompt}`,
      maxTokens: 8000,
      effort: "low",
    }));
    let text = "";
    stream.on("text", (d) => { text += d; onText(text); });
    return messageText(await stream.finalMessage());
  }

  async function gradeWork(s, work, aiOutput) {
    const client = await getClient();
    const b = s.build;
    const user = `<scenario>\n${s.setting}\nObjective: ${s.objective}\n</scenario>
<materials>\n${materialsText(s)}\n</materials>
<task deliverable="${b.deliverable}">\n${b.task}\n</task>
<rubric>\n${b.rubric.map((r, i) => `${i + 1}. ${r}`).join("\n")}\n</rubric>
<reference_answer>\n${b.model_answer}\n</reference_answer>
<learner_work>\n${work}\n</learner_work>
${aiOutput ? `<ai_output_from_learner_prompt>\n${aiOutput}\n</ai_output_from_learner_prompt>` : ""}

Assess the learner's work. Return one criteria entry per rubric item, in order, using the rubric text as the criterion.`;
    const stream = client.beta.messages.stream(buildParams({ system: GRADE_SYSTEM, user, maxTokens: 16000, schema: REVIEW_SCHEMA }));
    const r = JSON.parse(messageText(await stream.finalMessage()));
    r.score = Math.max(0, Math.min(100, Math.round(r.score)));
    return r;
  }

  function finishLesson(id, idx, score, simPts) {
    const c = getCourse(id);
    const prev = c.progress[idx] || {};
    const first = !prev.done;
    c.progress[idx] = {
      done: true,
      score: Math.max(score, prev.score || 0),
      ...(simPts != null || prev.sim != null ? { sim: Math.max(simPts ?? 0, prev.sim ?? 0) } : {}),
    };
    // Move the active course to the top of the list.
    state.courses = [c, ...state.courses.filter((x) => x.id !== id)];
    save();
    if (first) addXP(XP.lessonDone);
    touchStreak();
    const p = courseProgress(c);
    if (p.done === p.total && first) { addXP(XP.courseDone); return renderComplete(id); }

    const lesson = c.course.lessons[idx];
    confetti(120);
    view(`
      <div class="center" style="padding-top:20px">
        <div class="badge-big">${score === lesson.quiz.length ? "🌟" : "✅"}</div>
        <h1>Lesson complete!</h1>
        <p class="muted">${simPts != null ? `Mission ${simPts}/100 · ` : ""}Quiz ${score}/${lesson.quiz.length}</p>
        <div class="card" style="text-align:left"><b>${p.done}/${p.total} lessons done</b>
          <div class="level-bar" style="margin-top:10px"><div style="width:${p.pct}%"></div></div></div>
      </div>
      ${lesson.simulation && lesson.try_it ? `<span class="step-tag">🏢 Take it to work this week</span><div class="card">${tryItHtml(lesson.try_it)}</div>` : ""}
      <div class="sticky-actions"><div class="inner">
        <button class="btn ghost" id="overview">Overview</button>
        ${idx + 1 < c.course.lessons.length ? `<button class="btn primary" id="nextLesson">Next lesson →</button>` : ""}
      </div></div>`);
    document.body.classList.add("in-lesson");
    bindCopy(lesson.try_it);
    $("#overview").addEventListener("click", () => openCourse(id));
    $("#nextLesson")?.addEventListener("click", () => openLesson(id, idx + 1));
  }

  function renderComplete(id) {
    const c = getCourse(id);
    const co = c.course;
    const total = co.lessons.reduce((n, l) => n + l.quiz.length, 0);
    const got = co.lessons.reduce((n, _, i) => n + (c.progress[i]?.score || 0), 0);
    document.body.classList.remove("in-lesson");
    confetti(220);
    view(`
      <div class="lesson-head"><button class="icon-btn" id="back" aria-label="Back">←</button></div>
      <div class="center">
        <div class="badge-big">🏆</div>
        <h1>Mission accomplished${state.profile.name ? ", " + esc(state.profile.name) : ""}!</h1>
        <p class="muted">You completed <b>${esc(co.title)}</b> · quiz score ${got}/${total}</p>
      </div>
      <div class="card glow">
        <h2 style="margin-top:0">📝 Cheat sheet</h2>
        <ul class="bullets">${co.cheat_sheet.map((s) => `<li>${md(s)}</li>`).join("")}</ul>
      </div>
      <div class="card">
        <h2 style="margin-top:0">${esc(co.final_challenge.title)}</h2>
        <p>${md(co.final_challenge.description)}</p>
      </div>
      <h2>🔭 Learn next</h2>
      <div class="chips">${co.next_topics.map((t) => `<button class="chip" data-next="${esc(t)}">${esc(t)}</button>`).join("")}</div>
      <button class="btn block" id="share">⤴︎ Share cheat sheet</button>
    `);
    $("#back").addEventListener("click", () => openCourse(id));
    $("#share").addEventListener("click", () => shareCourse(c));
    $$("[data-next]").forEach((b) => b.addEventListener("click", () => {
      setTab("home");
      $("#topic").value = b.dataset.next;
      $("#topic").focus();
    }));
  }

  // ---------- boot ----------
  renderStats();
  setTab("home");
  if ("serviceWorker" in navigator && location.protocol === "https:") {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
})();
