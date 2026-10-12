// Built-in demo course so the app is useful before an API key is added.
window.SAMPLE_COURSE = {
  title: "AI Copilots for Global Supply Chain",
  emoji: "🛰️",
  tagline: "Use generative AI to move faster on suppliers, shipments and compliance, without losing control.",
  why_it_matters: "International supply chain work is full of documents, emails, spreadsheets and rules. Generative AI is very good at reading, summarizing and drafting, so it can give you hours back each week if you use it safely.",
  minutes: 15,
  lessons: [
    {
      title: "What generative AI actually does",
      emoji: "🧠",
      minutes: 5,
      theory: {
        hook: "A large language model (LLM) is a super-fast reader and writer that predicts the most useful next words, based on patterns learned from huge amounts of text.",
        points: [
          "LLMs don't look facts up in a database by default. They generate answers, so they can sound confident and still be wrong (this is called a **hallucination**).",
          "They are strongest at language tasks: summarizing, drafting, translating, classifying and pulling structured data out of messy text.",
          "Quality depends on **context**: the more relevant detail you give (the role, the goal, the format, examples), the better the output.",
          "Treat the AI as a smart intern: great first drafts, but **you** own the final decision."
        ],
        analogy: "Think of an LLM like a seasoned freight forwarder who has read millions of shipping documents. They can draft a commercial invoice in seconds, but you'd still check the HTS code before it goes to customs."
      },
      key_terms: [
        { term: "LLM", definition: "Large Language Model: an AI trained on lots of text to understand and generate language (e.g. Claude)." },
        { term: "Prompt", definition: "The instructions and context you give the AI." },
        { term: "Hallucination", definition: "When the AI produces plausible-sounding but incorrect information." },
        { term: "Context window", definition: "How much text the AI can consider at once, such as a long contract plus your question." }
      ],
      example: {
        role: "International Supply Chain @ Blue Origin",
        title: "Summarize a supplier's delay email thread",
        scenario: "A 30-message email thread with an overseas machining supplier is about a slipped delivery of a (fictional) bracket assembly. You need a clear status for your manager in 5 minutes.",
        steps: [
          "Remove anything sensitive first: part drawings, controlled technical data, pricing. Keep only the logistics facts.",
          "Paste the cleaned thread into an approved AI tool and ask: \"Summarize the current status, root cause, new ETA, and open actions with owners.\"",
          "Ask a follow-up: \"What risks to our build schedule should I flag?\"",
          "Check the summary against the thread before you send it."
        ],
        outcome: "A crisp 5-bullet status update in about 2 minutes instead of 20, with risks called out."
      },
      use_cases: [
        { role: "International Supply Chain @ Blue Origin", title: "Meeting & thread digests", description: "Turn long supplier calls and email chains into decisions, actions and owners.", impact: "⏱️ Saves 2–4 hours a week" },
        { role: "International Supply Chain @ Blue Origin", title: "Multilingual supplier comms", description: "Draft and translate clear messages to suppliers in other countries, then have a native speaker spot-check important ones.", impact: "🌍 Faster responses across time zones" },
        { role: "Any role", title: "First-draft documents", description: "Generate a first draft of SOPs, RFQ cover letters or training notes for you to refine.", impact: "✍️ Beat the blank page" }
      ],
      try_it: {
        instructions: "Open your company-approved AI tool and paste this prompt with a non-sensitive email thread of your own.",
        prompt: "You are an experienced international supply chain coordinator.\nSummarize the email thread below for my manager.\nFormat:\n- Status (1 line)\n- Root cause\n- New ETA\n- Open actions (owner + date)\n- Risks to flag\n\nThread:\n[paste thread here]"
      },
      quiz: [
        { question: "Why should you double-check an AI summary before sending it?", options: ["AI is always wrong", "LLMs can hallucinate plausible but incorrect details", "It's required by every email client", "Summaries are always too long"], answer_index: 1, explanation: "LLMs generate text from patterns and can confidently state things that aren't in the source. You own the final output." },
        { question: "Which task is an LLM generally BEST at?", options: ["Guaranteeing real-time freight prices", "Summarizing and drafting text", "Physically inspecting parts", "Signing export licenses"], answer_index: 1, explanation: "Language tasks like summarizing, drafting, translating and extracting are where LLMs shine." }
      ]
    },
    {
      title: "Prompting like a pro: the R-G-C-F recipe",
      emoji: "🎯",
      minutes: 5,
      theory: {
        hook: "Most bad AI answers come from vague prompts. A simple recipe fixes 80% of them.",
        points: [
          "**R – Role:** tell the AI who to be (\"You are a customs compliance specialist…\").",
          "**G – Goal:** say exactly what you want (\"Compare these 3 freight quotes…\").",
          "**C – Context:** give the facts it needs (incoterms, deadlines, constraints, audience).",
          "**F – Format:** describe the output (table, bullets, email, JSON, word limit).",
          "Iterate! Reply with \"make it shorter\", \"add a risk column\" or \"explain your reasoning\"."
        ],
        analogy: "A prompt is like a purchase order: the clearer the spec, quantity and delivery terms, the less rework you get back."
      },
      key_terms: [
        { term: "Few-shot prompting", definition: "Including 1–3 examples of the output you want so the AI copies the pattern." },
        { term: "Iteration", definition: "Refining the answer through follow-up messages instead of expecting perfection on the first try." },
        { term: "Structured output", definition: "Asking for a table or fixed fields so results can go straight into a spreadsheet." }
      ],
      example: {
        role: "International Supply Chain @ Blue Origin",
        title: "Compare three freight forwarder quotes",
        scenario: "You received three quotes (different formats) to ship non-controlled ground support equipment from Germany to Texas.",
        steps: [
          "Role: \"You are a logistics analyst.\"",
          "Goal: \"Compare these quotes and recommend one.\"",
          "Context: \"Incoterm DAP, must arrive within 21 days, we value reliability over price, fragile cargo.\"",
          "Format: \"Return a table: forwarder, total cost, transit days, mode, insurance, risks. Then a 3-line recommendation.\"",
          "Verify totals yourself, since AI can make arithmetic slips."
        ],
        outcome: "A clean comparison table you can paste into your sourcing file, plus a justified recommendation."
      },
      use_cases: [
        { role: "International Supply Chain @ Blue Origin", title: "Quote & RFQ comparison", description: "Normalize quotes in different formats into one comparison table.", impact: "📊 Faster, more consistent awards" },
        { role: "International Supply Chain @ Blue Origin", title: "Incoterm explainer for stakeholders", description: "Generate a plain-English explanation of who pays and who carries risk for a given incoterm, for engineers or program managers.", impact: "🤝 Fewer misunderstandings" },
        { role: "Any role", title: "Data cleanup", description: "Standardize messy supplier names, addresses or units of measure before loading them into a system.", impact: "🧹 Cleaner master data" }
      ],
      try_it: {
        instructions: "Fill in the brackets and run this in your approved AI tool.",
        prompt: "Role: You are a logistics analyst.\nGoal: Compare the freight quotes below and recommend one.\nContext: Incoterm [X], deadline [Y days], priority [cost / speed / reliability].\nFormat: A table (forwarder | total cost | transit days | mode | risks), then a 3-line recommendation.\n\nQuotes:\n[paste quotes]"
      },
      quiz: [
        { question: "In R-G-C-F, what does the 'F' stand for?", options: ["Facts", "Format", "Forwarder", "Feedback"], answer_index: 1, explanation: "Format: tell the AI exactly what shape the output should take (table, bullets, email…)." },
        { question: "The first answer isn't quite right. What's the best next step?", options: ["Give up on AI", "Start a brand-new chat with the same prompt", "Iterate with a specific follow-up like 'add a risk column'", "Copy it anyway"], answer_index: 2, explanation: "Iteration is a core skill. Specific follow-ups quickly steer the AI to what you need." }
      ]
    },
    {
      title: "Using AI safely: export controls & data",
      emoji: "🛡️",
      minutes: 5,
      theory: {
        hook: "In aerospace, *what* you paste into an AI tool matters as much as the answer you get back.",
        points: [
          "Only use AI tools your company has **approved** for the type of data you're handling.",
          "Never paste **export-controlled technical data** (ITAR/EAR), drawings, specs or proprietary pricing into public AI tools.",
          "Strip or anonymize sensitive details: replace part numbers, supplier names and costs with placeholders.",
          "AI can help you **learn** compliance concepts, but classification and licensing decisions stay with qualified trade compliance professionals.",
          "Keep a human in the loop for anything that leaves the company: customs filings, contracts, supplier commitments."
        ],
        analogy: "Treat a public AI chat like a crowded airport lounge: fine for general questions, not the place to spread out controlled drawings."
      },
      key_terms: [
        { term: "ITAR", definition: "International Traffic in Arms Regulations: U.S. rules controlling defense-related articles, services and technical data." },
        { term: "EAR", definition: "Export Administration Regulations: U.S. rules controlling dual-use and commercial items." },
        { term: "Anonymization", definition: "Removing or masking identifying or sensitive details before sharing data." },
        { term: "Human-in-the-loop", definition: "A person reviews and approves AI output before it's acted on." }
      ],
      example: {
        role: "International Supply Chain @ Blue Origin",
        title: "Draft a supplier onboarding checklist, safely",
        scenario: "You're onboarding a new foreign supplier and want a checklist of trade compliance steps to discuss with your compliance team.",
        steps: [
          "Ask a general question with no company data: \"What steps does an aerospace company typically take when onboarding a foreign supplier, from a trade compliance view?\"",
          "Ask the AI to format it as a checklist with columns: step, why it matters, owner.",
          "Bring the draft to your trade compliance team to align it with internal procedures.",
          "Save the approved version as your team template."
        ],
        outcome: "A useful starting checklist created without sharing any sensitive data, validated by the experts."
      },
      use_cases: [
        { role: "International Supply Chain @ Blue Origin", title: "Regulation explainers", description: "Ask for plain-language explanations of trade terms (e.g. 'deemed export', 'Schedule B') to learn faster, then confirm with compliance.", impact: "📘 Faster ramp-up on complex rules" },
        { role: "International Supply Chain @ Blue Origin", title: "Shipment document pre-check", description: "With an approved internal tool, check that a commercial invoice and packing list agree on quantities, weights and values.", impact: "✅ Fewer customs holds" },
        { role: "Any role", title: "Policy Q&A", description: "With approved internal AI, ask questions over your company's own policies to find the right procedure quickly.", impact: "🔎 Less time searching" }
      ],
      try_it: {
        instructions: "Try a safe, data-free learning prompt in any AI tool.",
        prompt: "Explain the difference between ITAR and EAR to a new supply chain coordinator in under 150 words. Then list 5 questions I should ask my trade compliance team before shipping a part internationally."
      },
      quiz: [
        { question: "Which is SAFE to paste into a public AI chatbot?", options: ["A controlled part drawing", "Proprietary supplier pricing", "A general question about what an incoterm means", "An ITAR-controlled spec sheet"], answer_index: 2, explanation: "General, non-sensitive questions are fine. Controlled technical data and proprietary info should never go into unapproved tools." },
        { question: "Who makes the final export classification decision?", options: ["The AI tool", "Qualified trade compliance professionals", "The freight forwarder's chatbot", "Whoever ships first"], answer_index: 1, explanation: "AI can help you learn and draft, but regulated decisions stay with qualified humans." }
      ]
    }
  ],
  cheat_sheet: [
    "LLMs are fast readers & writers, not oracles. Always verify.",
    "Prompt recipe: Role, Goal, Context, Format.",
    "Iterate with specific follow-ups.",
    "Never paste ITAR/EAR technical data or proprietary info into unapproved tools.",
    "Anonymize: replace names, part numbers and prices with placeholders.",
    "Keep a human in the loop for anything leaving the company."
  ],
  final_challenge: {
    title: "Your 1-week AI mission 🚀",
    description: "Pick one repetitive task this week (status updates, quote comparisons or supplier emails). Use the R-G-C-F recipe with an approved tool on anonymized data, and track how many minutes you save."
  },
  next_topics: ["AI agents for procurement", "Demand forecasting with machine learning", "Using AI to analyze spreadsheets"]
};

// Hands-on missions for each sample lesson (all names, companies and data are fictional).
(() => {
  const [l1, l2, l3] = window.SAMPLE_COURSE.lessons;

  l1.simulation = {
    title: "The Late Bracket Briefing",
    setting: "You coordinate international suppliers. A Danish machining supplier has slipped delivery of the **BRK-4471 bracket assembly**, and your manager wants a status update before the 2 pm production meeting. You have 15 minutes and a messy email thread.",
    objective: "Use an AI assistant to turn the thread into a crisp, accurate status update your manager can read in 30 seconds.",
    artifacts: [
      {
        kind: "email",
        title: "Thread: RE: RE: BRK-4471 delivery (7 messages)",
        content: "From: Mikkel Sørensen (Nordhavn Precision ApS)\nMar 4: Hi team, small hiccup. Our anodizing partner has a backlog. BRK-4471 (qty 40) will miss the Mar 14 ship date. New estimate Mar 28.\n\nFrom: You\nMar 4: Thanks Mikkel. Is the Mar 28 ex-works or delivered? Any partial shipment possible?\n\nFrom: Mikkel Sørensen\nMar 5: Mar 28 is ex-works Aarhus. We could ship 16 pcs on Mar 21 if you approve split freight.\n\nFrom: Mikkel Sørensen\nMar 6: FYI unit price revised to $1,840 due to expedite fees (PROPRIETARY, do not distribute). Drawing rev C attached (EXPORT CONTROLLED).\n\nFrom: Laura Chen (Logistics)\nMar 6: Air freight from Aarhus is ~5 days door to door, so ex-works Mar 28 means at our dock around Apr 2.\n\nFrom: Mikkel Sørensen\nMar 7: Confirming root cause: anodizing line down for maintenance 6 days. Recovery plan in place.\n\nFrom: Laura Chen\nMar 7: Need a PO change from buyer to approve split freight by Mar 12, otherwise partial ship is off."
      },
      {
        kind: "note",
        title: "Sticky note from your manager",
        content: "Keep it short. I need: where we are, why, when it lands HERE, what you need from me. Flag anything that could hit the build schedule."
      }
    ],
    checkpoints: [
      {
        situation: "Before pasting the thread into your company-approved AI assistant, you notice the Mar 6 message includes **proprietary pricing** and references an **export-controlled drawing**. What do you do?",
        options: [
          { text: "Remove the pricing line and the drawing reference, then paste the rest", rating: "best", consequence: "The AI gets every logistics fact it needs and nothing sensitive. Your summary is ready in two minutes with zero compliance exposure." },
          { text: "Paste everything, since the tool is company-approved", rating: "risky", consequence: "Approved tools still have data rules. Trade compliance flags that controlled technical data went into the tool, and now there's an incident report to file." },
          { text: "Skip the AI and write the summary by hand", rating: "okay", consequence: "Safe, but it takes 20 minutes and you walk into the meeting late. A quick clean-up would have kept the speed and the safety." }
        ]
      },
      {
        situation: "The AI's summary says: **\"New ETA: March 28.\"** Your manager is about to forward it to the program lead. What do you do?",
        options: [
          { text: "Send it as is. The AI read the whole thread", rating: "risky", consequence: "The program plans around Mar 28, but that's the ex-works date. Parts actually land around Apr 2, and the build team discovers the 5-day gap the hard way." },
          { text: "Ask the AI \"are you sure?\" and send whatever it says next", rating: "okay", consequence: "It corrects itself this time, but re-asking the AI isn't verification. Next time it may confidently repeat the mistake." },
          { text: "Check the thread, correct it to ~Apr 2 at our dock (ex-works Mar 28), then send", rating: "best", consequence: "Your update is accurate and shows both dates. The program lead thanks you for catching the ex-works vs. delivered nuance." }
        ]
      }
    ],
    build: {
      task: "Write the prompt you'd give the AI assistant to turn this thread into your manager's status update. The app will actually run your prompt on these (fictional) files, so you'll see exactly what your prompt produces.",
      deliverable: "ai_prompt",
      hint: "Re-read the sticky note: your manager told you exactly what they need. Also think about which date actually matters to the factory floor.",
      rubric: [
        "Gives the AI a role or audience (e.g. a status update for a manager)",
        "Specifies the output structure: status, root cause, ETA at our dock, actions/asks, risks",
        "Asks the AI to distinguish ex-works vs. delivered dates, or to flag conflicting or uncertain info",
        "Sets a length or format limit suitable for a 30-second read",
        "Asks for the open decision and deadline (split-freight approval by Mar 12) to be called out"
      ],
      model_answer: "You are an international supply chain coordinator writing for a busy manager.\nUsing the email thread, write a status update of max 6 bullets:\n- Status (1 line)\n- Root cause\n- ETA at OUR dock (show the ex-works date separately and explain the difference)\n- Decision needed from my manager, with deadline\n- Risks to the build schedule\n- Next update date\nIf any dates or facts conflict or are unclear, flag them instead of guessing. Don't include pricing."
    }
  };

  l2.simulation = {
    title: "Three Quotes, One Deadline",
    setting: "Engineering needs a fragile ground-support test stand moved from Bremen, Germany to your site in Kent, WA. Three forwarders sent quotes in completely different formats. The program manager wants a recommendation today.",
    objective: "Write an R-G-C-F prompt that gets the AI to compare the quotes fairly and recommend one that actually meets the deadline.",
    artifacts: [
      {
        kind: "table",
        title: "Freight quotes (as received)",
        content: "Forwarder | Price | Transit | Mode | Insurance | Notes\nAtlasLink Freight | €19,900 | 3 weeks | Ocean + truck | Not included | Port congestion surcharge possible\nSkyBridge Cargo | $31,500 | 6 days | Air | Included | Crating for fragile cargo included\nMeridian Global | $24,800 | 18 days | Ocean + truck | 0.5% of cargo value | Fixed price, no surcharges"
      },
      {
        kind: "note",
        title: "Message from the program manager",
        content: "Test stand must be at Kent by June 20 for a calibration window. It's fragile and worth about $400k. Budget is around $28k. Reliability matters more than price. Shipment is ready June 1. EUR→USD today is 1.08."
      }
    ],
    checkpoints: [
      {
        situation: "One quote is in **euros** and the transit times use different units. How do you handle that in your prompt?",
        options: [
          { text: "Let the AI convert using whatever rate it knows", rating: "okay", consequence: "It uses an outdated rate and AtlasLink looks about $600 off. Close, but not something you'd want in a sourcing file." },
          { text: "Give the AI today's rate (1.08) and ask it to normalize everything to USD and days", rating: "best", consequence: "Clean apples-to-apples numbers with the assumption written down, so anyone can audit the comparison later." },
          { text: "Don't mention it. The AI will figure it out", rating: "risky", consequence: "The AI compares €19,900 to $24,800 as if they were the same currency and calls AtlasLink the cheapest by $4,900. Oops." }
        ]
      },
      {
        situation: "The AI recommends **AtlasLink** as the cheapest. You check: ready June 1 + 3 weeks = **June 22**, and the deadline is June 20. What now?",
        options: [
          { text: "Re-prompt: \"Exclude any option that can't arrive by June 20, then rank on reliability\"", rating: "best", consequence: "The AI drops AtlasLink and recommends Meridian (June 19, fixed price, within budget), with SkyBridge as the fast backup. Decision made in minutes." },
          { text: "Go with AtlasLink. 2 days late is probably fine", rating: "risky", consequence: "Port congestion adds another 4 days. The calibration window is missed and the test campaign slips a month." },
          { text: "Pick SkyBridge, the fastest, to be safe", rating: "okay", consequence: "It arrives on time, but it's over budget with insurance and freight, and you can't explain why you skipped a cheaper option that also met the date." }
        ]
      }
    ],
    build: {
      task: "Write your R-G-C-F prompt (Role, Goal, Context, Format) to compare the three quotes and recommend one. The app will run it on the files so you can see the result.",
      deliverable: "ai_prompt",
      hint: "The program manager's note holds the constraints that decide the winner. Make sure the AI can't ignore them.",
      rubric: [
        "Role: gives the AI a relevant role (e.g. logistics analyst)",
        "Goal: asks for a comparison AND a recommendation",
        "Context: includes the deadline/ship date, fragility, budget and reliability priority",
        "Asks to normalize currency (with the given rate) and transit units",
        "Format: specifies a table plus a short justified recommendation"
      ],
      model_answer: "Role: You are a logistics analyst for an aerospace company.\nGoal: Compare the three freight quotes and recommend one.\nContext: Cargo is a fragile test stand worth ~$400k, ready June 1, must arrive in Kent, WA by June 20. Budget ~$28k all-in. Reliability matters more than price. Convert EUR to USD at 1.08 and transit to days.\nFormat: A table (forwarder | all-in USD incl. insurance | transit days | arrival date | meets deadline? | risks), then a 3-line recommendation. Exclude options that miss June 20, and state any assumptions."
    }
  };

  l3.simulation = {
    title: "Pilot: AI Pre-Check for Customs Docs",
    setting: "Customs holds caused by mismatched paperwork cost your team three delayed shipments last quarter. Your manager asks you to design a small pilot that uses AI to pre-check commercial invoices against packing lists before shipments go out.",
    objective: "Write a short, safe implementation plan your manager and trade compliance can approve.",
    artifacts: [
      {
        kind: "document",
        title: "AI Use Policy (excerpt)",
        content: "1. Internal data may only be processed in approved internal tools (currently: NovaAssist).\n2. Public AI tools may be used only with public information.\n3. Export-controlled technical data (ITAR/EAR) must not be entered into ANY AI tool without written trade compliance approval.\n4. AI output that feeds a regulatory filing must be reviewed and signed off by a qualified person.\n5. New AI use cases require a pilot with defined success metrics."
      },
      {
        kind: "table",
        title: "Last quarter's customs holds",
        content: "Shipment | Destination | Issue | Delay\nSH-2231 | Japan | Invoice qty 12, packing list qty 10 | 4 days\nSH-2258 | Germany | Gross weight mismatch | 2 days\nSH-2290 | Canada | Missing country of origin on invoice | 3 days"
      }
    ],
    checkpoints: [
      {
        situation: "A coworker says: \"NovaAssist is slow. Let's just use a free public chatbot for the pilot, it's way faster.\" What do you do?",
        options: [
          { text: "Use the public chatbot but only for non-controlled shipments", rating: "okay", consequence: "Better than nothing, but invoices and packing lists are still internal data. Policy section 2 says public tools are for public info only, so the pilot gets paused." },
          { text: "Agree. Speed matters and it's just paperwork", rating: "risky", consequence: "Customer names, values and part descriptions end up in a public tool. Trade compliance shuts the pilot down on day two." },
          { text: "Stick with NovaAssist and ask IT how to speed it up", rating: "best", consequence: "The pilot stays within policy from day one, and IT shows you a batch-upload feature that fixes the speed issue." }
        ]
      },
      {
        situation: "Four weeks in, the AI caught **9 of 10** seeded mismatches. Your manager says: \"Great, let's have it auto-approve invoices and skip the human check.\" Your move?",
        options: [
          { text: "Stop using AI, since it missed one", rating: "okay", consequence: "You throw away a tool that caught 90% of errors. The team goes back to finding mismatches after the customs hold." },
          { text: "Keep AI as the pre-check with human sign-off, track misses, and review the metrics monthly", rating: "best", consequence: "Customs holds drop sharply, policy section 4 is respected, and the missed case becomes a new check in the prompt." },
          { text: "Turn on auto-approval. 90% is great", rating: "risky", consequence: "The 10% it misses now goes straight to customs. One wrong origin declaration triggers a compliance review." }
        ]
      }
    ],
    build: {
      task: "Write a 4-6 step plan for the pilot: which tool, what data goes in (and what never does), what the AI checks, where humans stay in the loop, and how you'll measure success.",
      deliverable: "plan",
      hint: "Walk through the policy excerpt line by line. Each rule should show up somewhere in your plan. Use last quarter's holds to decide what the AI should check.",
      rubric: [
        "Uses the approved internal tool (NovaAssist), not a public one",
        "Keeps export-controlled technical data out, or routes it through trade compliance approval",
        "Defines what the AI checks (e.g. quantities, weights, country of origin) based on real past issues",
        "Keeps a qualified human sign-off before anything is filed",
        "Defines pilot scope and success metrics (e.g. holds per month, catch rate)"
      ],
      model_answer: "1. Scope: 4-week pilot on non-controlled outbound shipments, using NovaAssist (approved internal tool).\n2. Data: upload the commercial invoice + packing list only. Screen out any export-controlled technical data; anything unclear goes to trade compliance first.\n3. Checks: the AI compares quantities, gross/net weights, values, and country of origin, and flags missing fields (based on last quarter's 3 holds).\n4. Human in the loop: a trade compliance specialist reviews every AI flag and signs off before filing. The AI never approves on its own.\n5. Metrics: catch rate on seeded test errors, customs holds per month, minutes per shipment. Review weekly.\n6. Decide: present results to manager + trade compliance at week 4 to scale, adjust, or stop."
    }
  };
})();
