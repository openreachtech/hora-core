<!-- 日本語版: [auto.ja.md](./auto.ja.md) — 片方を直したら、同じコミットでもう片方も直してください -->

# The automatic route

*[日本語](./auto.ja.md)*

The spec is finished. Every section has been read and approved, stage 7 has passed, and what is left is building it. On the normal route, that is still weeks of conversations: `/hora-plan` asks about the holes it finds, and four of the eighteen checkpoints walk the use cases with a person, feature after feature.

`/hora-auto` is the route without them. **You say once, before implementation starts, what matters most. From then on the run asks nobody anything, and goes on until `release/<version>` is pushed and a draft pull request into `main` is open.** Every point where `/hora` would have asked you is decided by what you declared, and written down where you can read it afterwards.

```
/hora        spec  →  plan (asks)  →  18 checkpoints, 4 of them ask  →  sweep  →  you merge
/hora-auto   spec  →  one declaration  →  everything else, recorded  →  draft PR  →  you merge
```

**It is `/hora` plus one precondition.** The same skills, the same checkpoints, the same verifiers and the same acceptance run. What changes is who settles a question the checks raise.

---

## Contents

- [When to use it](#when-to-use-it)
- [What stays the same](#what-stays-the-same)
- [The declaration](#the-declaration)
- [The preflight](#the-preflight)
- [How it decides without you](#how-it-decides-without-you)
- [When it stops](#when-it-stops)
- [Resuming and pausing](#resuming-and-pausing)
- [Where it ends, and why there](#where-it-ends-and-why-there)
- [What it gives up](#what-it-gives-up)
- [Things worth knowing](#things-worth-knowing)
- [Where to go next](#where-to-go-next)

---

## When to use it

**Once the spec has passed stage 7, and not before.** The spec is intent, and intent is only ever written by a person reading the exact words. `/hora-auto` never writes into `specs/` and never runs `/hora-spec`. A spec that has not been through stage 7 has never been checked for the holes the run would then fill alone, so the skill refuses to start on one.

**When you would rather review the result than answer as it goes.** Every decision the run takes in your place is recorded as a question you can read, answer and overturn later. What you give up is the chance to steer each one while it is still cheap to change.

**Not when a decision needs somebody who is not there.** A client who has to approve a screen, a team that owns an API you call — the run cannot ask them either, and it will lean every such gap to the safe side and move on. That is often right, and it is never the same as asking.

---

## What stays the same

| | |
|---|---|
| **unchanged** | `/hora-setup`, `/hora-plan`, `/hora-build`, `/hora-accept`, `/hora-hotfix`; the eighteen checkpoints and their exit conditions; every verifier, audit and suite; every branch and commit rule |
| **replaced** | every conversation after the spec, by a decision taken against your declaration and recorded |
| **added** | the declaration, the preflight, one record file — `.hora/tasks/<version>/_auto.md` — one display for every stop, and the end of the run |

**Nothing about verification changes.** Every checkpoint runs, every exit condition has to hold, and the sweep runs at full reach. A declaration can add to the checks — ranking `test-depth` writes more cases — and can never take one away.

**Either scheduler runs the features.** You choose `/hora` or `/hora-fast` during the declaration. With nobody answering checkpoints 1, 2, 9 and 11, the conversations that `/hora-fast` could never shorten are gone, so the two together are the fastest way through a version ([`parallel.md`](./parallel.md)).

---

## The declaration

**The one conversation the run has.** It takes a few minutes, and it ends with a ranked list written into `_auto.md`.

1. **Three questions, as choices.** What kind of project this is — an internal business system, a service for the public, a demonstration, a regulated business — which scheduler to use, and whether there is a date
2. **A draft ranking.** The kind gives a starting order; the spec moves it. Each entry names where in the spec it came from, and the draft is a proposal, not a finding
3. **Correction in your own words.** "Security first", "the looks can be plain", "put auditability below 2". You never need to know the key an axis is filed under
4. **Only the pairs the spec could not order are asked.** `simplicity` or `extensibility`, `delivery-speed` or `completeness` — each as a choice of two, and skipped where the spec already decided

```
This order is the priority, exactly as written.

👍 1. data-integrity
👍 2. access-control
👍 3. auditability
👍 4. usability
👍 5. delivery-speed

📝 candidates: observability, operation-safety, error-experience
   Not in the order above. Type "more" to see the next ones.

────────────────────────────────

👎 excluded: i18n, seo
   Nothing is built for these alone.
```

**It is a ranking, not a set of weights.** With weights, three axes marked "high" leave the run nowhere to go when two of them pull apart. A ranking has no ties, so every such pull has an answer.

**Excluding an axis is weaker than it sounds.** It means nothing is built for that axis alone. A ranked axis that needs part of an excluded one's work still gets it, and a spec that asks for two languages gets them, whatever you said about `i18n` — the run points out that disagreement before it starts.

**The last screen has no marks.** It shows exactly the text that goes into `_auto.md`, because what an approval protects is that you read the words that are written.

Thirty-four axes are on offer, in seven groups. [`priorities.md`](../kit/skills/hora-auto/references/priorities.md) lists every one, with the decision it changes and the side it leans to.

---

## The preflight

**The last thing done while you are still there.** Every command the run will need is run once, in a harmless form, so that whatever would stop the run later stops it now, in front of somebody who can fix it: git in every repository, a remote in each, a dry-run push, `gh auth status`, the package manager, and the environment's start commands.

**Before any command that may raise a Claude Code permission prompt, the run says so on a line of its own, marked 🔐.** A prompt that appears under that line is Claude Code asking, not hora. Choosing not to be asked again there is what lets the run go on without you later. The skill never writes the permission settings itself; what Claude Code may run unasked is yours to allow.

**One failed check keeps the run from starting.** A repository with no remote, a `gh` that is logged out, a database that is not up — each is cheaper to fix now than to find at the end. It is shown in the same shape as every stop, headed `🚫 The automatic run cannot start` rather than 🚨, because nothing has run yet: it did not stop, it never began.

**On a new project, the environment is checked a little later.** The repositories do not exist until `/hora-setup` has run on the route, so the first preflight holds the environment line, and the environment is checked on its own as soon as setup has recorded how to start it, before planning begins. A failure there stops the run with 🚨 rather than 🚫, because setup has already done its work.

**The preflight runs again at every resume.** The environment may have stopped, and a login may have expired, while the run was waiting.

---

## How it decides without you

**Every question a person would have been asked falls into one of three kinds**, and the kind decides what happens.

| Kind | What it is | What the run does |
|---|---|---|
| **a reading** | the spec admits more than one reading | takes the one your highest-ranked axis favours, and records it (`auto-reading`) |
| **a gap** | filling it would state intent the spec never stated — who may see something, what counts as accepted | **leans to the side that is easier to loosen later**, and records it loudly (`auto-default`) |
| **a stop** | nothing the run could decide resolves it | stops the one feature, or the whole run |

**The side easier to loosen later is the whole idea behind the second kind.** A permission the spec never stated is granted to exactly the roles the use cases need, and past that to the highest role alone. If that guess is wrong, somebody who should see the data cannot yet — and granting it later is one line. The opposite guess ships data to people who should never have seen it, and nothing takes that back. Soft deletes, database constraints, history kept, personal data not stored: the same rule, axis by axis.

**No kind writes into `specs/`.** A reading and a gap are both run on, and both wait in `.hora/questions/<version>/open.md` as questions. You answer them the way every question is answered, by editing the spec, and the next `/hora-plan` takes the change in.

**Every gap is named at the top of every pull request.** Leaning shut is safe only for as long as somebody checks that nobody who needed access was shut out, and the person who merges is the person best placed to check.

---

## When it stops

**Every stop looks the same**, like the display on a washing machine that has stopped: the fact and a code, then why, how far it got, and how to resume.

```
🚨 The automatic run stopped  [E-ENV]

Cause
  The backend database does not answer (#payroll, checkpoint 6, running tests)
  Tried: the recorded start command, once -> still no answer

How far it got
  1.0.0         4 of 11 features done
  in progress   #payroll, checkpoint 6 of 18. No uncommitted changes
  blocked       ⛔ #bonus  [E-NPM]  Q12
  remote        nothing pushed

How to resume
  1. Start the backend database
  2. Run /hora-auto (/hora resumes in auto mode as well). It continues from here
```

| Code | Stopped because |
|---|---|
| `E-SPEC` | the spec itself has to change, and only `/hora-spec` may change it |
| `E-SETUP` | setup needs a value nothing can decide, or the stack handbook has no answer |
| `E-ENV` | the environment does not answer, after one restart |
| `E-NPM` | an install, update or audit failed, after one retry |
| `E-RETAKE` | one feature failed acceptance three times |
| `E-GIT` | catching up with `main` needs a decision, or a push was refused |
| `E-AUTH` | `gh` is logged out, or a permission prompt could not be answered |
| `E-BLOCKED` | every feature left is blocked, each listed with its own code |
| `E-INTERRUPTED` | the previous run ended without a display |
| `E-UNCLASSIFIED` | none of the above — and a sign this table needs another row |

**Not every stop stops everything.** A dependency that will not install blocks the feature that needs it (⛔), and the run goes on with the rest. An environment that is down stops the whole run, because every feature needs it — a printer found switched off stops every job. **A feature blocked in the middle of a run is still blocked at the end**, and the version does not reach its pull request until it is not.

**"Tried" is there so you do not repeat it.** The run restarts an environment once and retries a dependency once, and never more; it never swaps in another package or lifts a quarantine. What it tried is on the display, and so is what it would not try.

**Failures are counted, not compared.** A feature whose acceptance fails three times is blocked, whether the three failures were the same or not. Sameness is too easy to argue either way to be a limit, and a limit with a way around it does not end the loop it exists for. The three failures are listed instead: the same one three times usually means a decision nobody made, and a different one each time usually means a design that breaks one thing whenever it fixes another.

**Progress is marked too.** A line marked 🟢 is a milestone — a gate merged, a feature accepted, the sweep passed. A line marked ⛔ is a feature blocked while the run carries on. Everything else is one plain line per checkpoint.

---

## Resuming and pausing

**A stop is where the next run starts.** Fix what the display named, then run `/hora-auto`. `_auto.md` still reads `auto: on`, so nothing is asked again: the preflight runs, and the version continues. `/hora` does exactly the same on such a version.

**Running out of a usage allowance is ordinary.** An automatic run is paced by nobody, so it spends more than any other. When a session ends before the run can say why, the next run notices — `auto: on`, and no recorded stop — and shows `E-INTERRUPTED` before carrying on. **It does not claim to know the cause.** A usage limit, a closed terminal and a sleeping machine leave the same files behind.

**Nothing is lost to an interruption.** Every checkbox is written the moment its checkpoint passes, and a checkpoint that was cut short runs again from its start against the code already there. That is the re-entrancy the whole method rests on ([`architecture.md`](./architecture.md)).

**Three things can be said while it runs.** A message typed into a working session reaches it mid-turn.

| Said | What happens |
|---|---|
| "pause" | the checkpoint in progress finishes, and the run stops with ⏸️ `PAUSED`. Resuming is the same as after any stop |
| "put security first" | the declaration is corrected from here on. Decisions already taken stand |
| "stop auto" | the run goes back to asking you, as `/hora` does. Every decision already recorded stays open for you to settle |

**Claude Code's own interrupt works too, but it does not wait for the end of a checkpoint.** A run interrupted that way comes back as `E-INTERRUPTED`, and the checkpoint it was in starts again.

---

## Where it ends, and why there

**Merging into `main` is the deployment.** It tags the version and ships it. So the run stops just before it:

1. every condition of a finished version holds except the merge, and no feature is blocked
2. `main` is caught up with once more. A hotfix brought in moves the code the sweep drove, so the sweep runs again before anything is pushed
3. `release/<version>` is pushed, in every declared repository and in app
4. a draft pull request into `main` is opened for each, every gap listed at the top, and app's marked to merge last
5. `✅ The automatic run is complete  [DONE]`

**The person who merges is the person who releases.** A run that went on to merge would have shipped a version nobody looked at, with every guess it made about intent inside it. Stopping at a draft keeps that one decision where it belongs, and "I would still like to fix this" stays possible until the moment you merge.

**Invoking `/hora-auto` is the permission for that push and those drafts, and for nothing else.** Never `--force`, never another branch, never a pull request marked ready, never a merge.

---

## What it gives up

| Given up | What stands in its place |
|---|---|
| a person settling each hole in the spec as it is found | a decision against the declaration, recorded as a question |
| a use case walked with somebody who knows what it is for | the same walk, by the main session alone |
| a finding the project chooses to live with | a fix, or a blocked feature — nobody is there to choose |
| `/hora`'s ways out when a version cannot proceed | the same choices, on the stop display, taken by nobody |

**The trade is written where you read it afterwards.** `_auto.md` holds what you declared, every change to it and every stop; `open.md` holds every decision taken in your place, as the kind it was.

---

## Things worth knowing

- **Every other skill knows it is in auto mode from `_auto.md`, not from the conversation.** A compacted context or a new session forgets how a run was started; the file does not
- **`_auto.md` is never deleted.** It reads `on` through every stop and pause, `off` when you turn it off, and `done` at the end. It belongs to one version, and the next version runs automatically only if you invoke `/hora-auto` for it
- **`/hora-setup` ships with the boilerplate, not with this package.** Where it would stop and ask, an automatic run stops with `E-SETUP` instead
- **The declaration is not a spec.** It decides only what the spec left open, and nothing in it is a requirement anybody has to meet

---

## Where to go next

| | |
|---|---|
| the skill itself | [`SKILL.md`](../kit/skills/hora-auto/SKILL.md) |
| every axis, its lean, and where each kind of project starts | [`priorities.md`](../kit/skills/hora-auto/references/priorities.md) |
| what each command does | [`commands.md`](./commands.md) |
| the parallel scheduler it can run | [`parallel.md`](./parallel.md) |
| why the method is re-entrant | [`architecture.md`](./architecture.md) |
