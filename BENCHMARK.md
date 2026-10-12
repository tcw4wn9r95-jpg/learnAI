# Benchmark: what makes hands-on AI learning work

**Question:** LearnAI lessons ended with a multiple-choice quiz. What practice format actually builds the ability to *apply* AI at work, and how should the app's exercises change?

**Short answer:** do-it-yourself practice with rich, specific feedback beats both reading and multiple choice. That works best when the practice follows a worked example and is set in realistic work materials. Simulations help when they are **active and embedded in instruction**, and hurt when they're passive or used alone. LearnAI now has a **Mission Simulation** in every lesson that follows these findings, and keeps a short quiz for recall.

---

## 1. What the evidence says

| Finding | Evidence | Strength | Implication for LearnAI |
|---|---|---|---|
| **Doing beats reading or watching** | CMU Open Learning Initiative: students who did more interactive activities gained roughly 6× the benefit of reading and 3× that of video (the "doer effect"). The authors argue the link is causal. | Medium. Replicated in university courseware, but a 2025 high-school MOOC study did not find it. | Every lesson needs something the learner *produces*, not just reads. |
| **Simulations help only when active and embedded** | Sitzmann (2011) meta-analysis of simulation games (65 studies, ~6,500 trainees): higher self-efficacy (+20%), declarative (+11%) and procedural knowledge (+14%), and retention (+9%). The gains reversed when the simulation was mostly passive or used standalone. Strong publication bias was noted. | Medium. The figures come via secondary summaries. | Put the simulation *after* theory and the worked example, and make every screen of it a decision or a build. |
| **Feedback content drives the gains** | Wisniewski, Zierer & Hattie (2020): 435 studies, d = 0.48. The effect depends heavily on how much information the feedback carries. "Right/wrong" alone is the weakest form. | Strong. | Grade against a rubric, criterion by criterion, with "what worked", one concrete next step and an improved version of *their own* answer. |
| **Well-designed AI tutors can outperform active classrooms** | Kestin et al. (2025, *Scientific Reports*), RCT with 194 Harvard physics students: a scaffolded AI tutor produced larger gains in less time than in-class active learning. A World Bank pilot in Nigeria (Copilot plus a teacher) found about +0.3 SD, but that result is confounded by the extra instruction time. | Medium. One RCT with a small, elite sample. | AI feedback is worth it, but it must be *designed* (rubric, guardrails, no free answers up front), not a raw chatbot. |
| **Worked example, then practice** | Worked-example meta-analysis (math): g ≈ 0.43, with high heterogeneity. | Medium. | Keep the worked example right before the mission ("now you do it"). |
| **Retrieval practice aids retention** | Rowland (2014): about 0.50 versus restudy (secondary citation). Benefits for complex problem-solving skills are debated. | Medium for recall, weak for skills. | Keep a *short* quiz for recall. It is not the main exercise. |
| **Transfer needs realism and workplace support** | Simulation reviews show transfer to the job is best documented when training is realistic. Supervisor support was a key factor in a management-simulation study. Most corporate studies rely on self-reports. | Weak to medium. | Use realistic, messy artifacts, and end with a concrete "take it to work this week" action. |

## 2. How leading products handle practice

| Product | Practice format | What to borrow | What to avoid |
|---|---|---|---|
| **Duolingo Max** (Roleplay, Video Call) | Scenario conversations with AI characters and feedback on accuracy and complexity afterward. Scenarios are written by experts. | Scenario framing, characters and stakes; feedback after the attempt, not during. | No published outcome data. Critics call the conversations short and scripted. |
| **Brilliant** | Interactive problems with instant feedback, and every concept learned by manipulating something. | Learning by acting, with fast feedback loops. | Self-described approach with limited independent evaluation. |
| **DataCamp** | Short video, then an in-browser coding exercise with real execution and no setup. | **Real execution:** learners see what their work actually does. | Criticized for hand-holding (fill-in-the-blank, little real problem-solving). |
| **Harvard Business Publishing simulations** | Decision-based business simulations with consequences. | Judgment calls with realistic trade-offs and consequences rather than "correct answers". | Outcome evidence is mostly perception surveys and is mixed against the case method. |
| **Khanmigo** | Socratic AI tutor that doesn't hand over answers. | Coaching tone; let the learner do the work. | No peer-reviewed RCT yet; evidence is mostly observational. |
| **Harvard physics AI tutor** (research) | Structured AI tutor built on pedagogy best practices. | Guardrailed AI feedback is effective. | n/a |

**Pattern across the strongest examples:** realistic scenario → learner produces something → it actually runs or has a consequence → specific feedback → retry. Multiple choice only shows up as a recall check.

## 3. What changed in LearnAI

Each lesson is now: **Theory → Key terms → Worked example → Use cases → 🎮 Mission simulation → Quick recall quiz**, with a **"Take it to work this week"** prompt on the lesson-complete screen.

The **Mission simulation** has five stages:

1. **Brief.** A situation in one of the learner's own roles (at least half of them in International Supply Chain), with a clear objective and **1–3 realistic, deliberately messy files**: email threads, quote tables, policy excerpts, notes. The files contain conflicting dates, mixed currencies, buried details, and an item that must *not* go into an AI tool (proprietary pricing, export-controlled references). These mirror real-world traps.
2. **Judgment call 1 (before using AI).** For example, what data you can safely give the AI. Three options are rated best, okay and risky, each with a *realistic consequence* rather than just "wrong".
3. **Build it.** The core hands-on task:
   - *Prompt missions:* the learner writes the prompt they would use at work. **The app runs it with Claude on the fictional files**, so they see exactly what their prompt produces, the same way DataCamp runs real code.
   - *Plan missions:* for concepts that aren't a single prompt (agents, forecasting pilots, rollouts), the learner writes an implementation plan.
   - **AI coach feedback** against a 3–5 point rubric: ✅/🟡/❌ per criterion with specific comments, "what worked", one "level up" step, *their own answer upgraded*, and the expert answer. Learners can **revise and retry**, and the best score counts.
   - No API key or offline? A self-check against the rubric and the expert answer.
4. **Judgment call 2 (after the AI step).** For example, the AI output has an error, or a manager wants to skip human review. This trains verification and human-in-the-loop habits.
5. **Debrief.** Score out of 100 (70% build quality, 30% judgment), medal, attempts and XP.

## 4. Known limits and next steps

- **Single-turn prompts only.** Real AI use is iterative. Next: let the learner send follow-up messages to the AI within the mission (multi-turn).
- **Grading is AI-based.** Rubric grading by an LLM is consistent but not perfect, so the expert answer is always shown for comparison.
- **Spaced repetition.** Resurfacing past missions after a few days would add the retention benefit of spacing.
- **Real transfer measurement.** Add an optional "Did you use this at work?" check-in a week later, to track transfer rather than just in-app scores.

## Sources

- Doer effect (CMU OLI): [UCF summary PDF](https://cdl.ucf.edu/wp-content/uploads/2024/02/The-Doer-Effect.pdf), [VitalSource summary](https://mx.get.vitalsource.com/hubfs/Website/Content%20Images%20-%20Resources%20page/Top5_DoerEffect_2021.pdf?hsLang=en), [replication note (NSF PAR)](https://par.nsf.gov/search/author:%22Carvalho,%20Paulo%22), [non-WEIRD populations (arXiv)](https://arxiv.org/html/2412.20923v1)
- Sitzmann (2011) simulation games: [Karl Kapp summary](https://karlkapp.com/?p=1550), [abstracts](https://karlkapp.com/?p=4333)
- Feedback meta-analysis: [Wisniewski, Zierer & Hattie (2020), Frontiers in Psychology](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2019.03087/full)
- AI tutoring: [Kestin et al. review](https://etcjournal.com/2025/11/10/review-of-kestin-et-al-s-june-2025-harvard-study-on-ai-tutoring/), [Five recent AI tutoring studies](https://www.greaterwrong.com/posts/bs3yj8vLDKNnoa95m/five-recent-ai-tutoring-studies), [PMC article](https://pmc.ncbi.nlm.nih.gov/articles/PMC12179260/)
- Worked examples and retrieval: [Worked examples meta-analysis poster](https://www.cehd.udel.edu/wp-content/uploads/2022/02/Worked-Examples-Meta-Poster_022722_SC.pdf), [retrieval with worked examples](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9987560/), [van Gog & Sweller debate](https://link.springer.com/10.1007/s10648-015-9309-3)
- Simulation transfer: [Fung et al. CRM review](https://link.springer.com/article/10.1007/s12630-014-0143-8), [Korteling (TNO)](https://publications.tno.nl/publication/100180/HVf5sD/korteling-2013-measurement.pdf), [Monash management simulation](https://research.monash.edu/en/publications/building-a-better-workforce-a-case-study-in-management-simulation/), [ATD research report](https://www.td.org/product/research-report--simulations-and-scenarios-realistic-effective-and-engaging-learning/192102)
- Simulations vs. cases: [ABSEL papers](https://absel-ojs-ttu.tdl.org/absel/article/view/1218/1187)
- Duolingo Max: [Duolingo blog](https://blog.duolingo.com/duolingo-max), [TechCrunch/Yahoo](https://autos.yahoo.com/duolingo-launches-subscription-tier-access-185143879.html), [Nasdaq](https://www.nasdaq.com/articles/duolingo-expands-video-call-feature-android-adding-new-language-support-and-enhancements)
- DataCamp / Brilliant comparisons: [Dataquest](https://www.dataquest.io/blog/datacamp-alternatives/), [Coddy](https://coddy.tech/vs/datacamp)
