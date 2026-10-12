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
