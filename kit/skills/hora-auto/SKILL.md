---
name: hora-auto
description: "Run a version from its finished spec to a pushed release branch and a draft pull request into main, asking a person nothing after one declaration of what to prioritize. The same /hora route with every conversation replaced by a recorded decision. Invoked directly as /hora-auto once /hora-spec has passed stage 7, and again to resume. Writing the spec belongs to /hora-spec; merging into main stays a person's."
---

# hora-auto

**`/hora` plus one precondition.** A person says once, before implementation starts, what matters most. From then on the run asks nobody anything: every point where `/hora` would have put a question to a person is decided by that declaration and written down, and the version runs until `release/<version>` is pushed and a draft pull request into `main` is open.

Read `../hora/references/structure.md` first, then `../hora/SKILL.md`. Both apply here unchanged except where this file says otherwise, and so does every git rule in `../hora/references/commits.md`.

---

## What is shared with `/hora`, and what is replaced

| | |
|---|---|
| **shared, unchanged** | `/hora-setup`, `/hora-plan`, `/hora-build`, `/hora-accept`, `/hora-hotfix`; the eighteen checkpoints and their exit conditions; every verifier, audit and suite; every branch and commit rule; the feature files, run records and acceptance records |
| **replaced** | every conversation after the spec — `/hora-plan`'s verification, checkpoints 1, 2, 9 and 11, and every stop on a `blocking: yes` — by a decision taken against the declaration and recorded ("Where a person would have been asked", below) |
| **added** | the declaration, the preflight, one record file, one display for every stop, and the end of the run: a push and a draft pull request |
| **not included** | `/hora-spec`. The spec is written in conversation, as always, before this skill starts |

**This is a lever, and it follows the rule every lever follows** (`../hora/references/structure.md`, "Where a lever lives"). **It gives up the person, never the check.** Every checkpoint still runs and every exit condition still has to hold; what changes is who settles a question the check raises. What was settled without a person is paid for in the record.

**The scheduler is chosen separately.** Either `/hora` or `/hora-fast` runs the features, and this skill changes neither ("The declaration", step 0).

---

## Whether it can start

```
1. The equipment check /hora runs (../hora/SKILL.md, "Whether hora can start
   at all")
2. .hora/spec/<version>/_stages.md exists and stage 7 reads [x]
                              if not -> stop. Say that the spec is finished
                                        through /hora-spec first, in
                                        conversation
3. .hora/tasks/<version>/_auto.md
     absent          -> the declaration, then the preflight
     auto: on        -> resume: the preflight, then "Deciding where you are".
                        Nothing is asked
     auto: off       -> ask one question: resume on the recorded declaration
                        (recommended), or declare again
     auto: done      -> report that this version already reached its end, with
                        the state of each draft pull request
```

**Step 2 is the whole boundary of this skill.** A spec is intent, and intent is only ever written by a person reading the exact words (`../hora/references/structure.md`, invariant 1). **This skill never writes into `specs/`, and never runs `/hora-spec`** — not to fill a hole, not to fix a typo.

**A spec somebody wrote by hand has to pass stage 7 too.** `/hora-spec` reads it, records the stages it already satisfies, and review is what stage 7 is.

**Invoking `/hora` on a version whose `_auto.md` reads `auto: on` resumes it the same way**, in auto mode (`../hora/SKILL.md`). Either command resumes; people reach for this one, and nothing about the run depends on which was typed.

---

## The declaration

**The one conversation this skill has.** It runs in the language of whoever invoked it, and it ends in `_auto.md`. The priority axes, their leans and the starting orders are `references/priorities.md`.

```
0. Ask, through the question tool, in one batch:
     the kind of project       an internal business system / a service for the
                               public / a demonstration or a trial / a regulated
                               business. Other is always offered
     the scheduler             /hora (one feature at a time) or /hora-fast
                               (several at once), and the limit if /hora-fast
     a date                    whether there is one. Do not assume it
1. Draft the ranking from the kind's starting row, moved by what the spec
   states. Show it as an ordered list — five by default — each with one line
   naming where in the spec it came from, and say that this order is the
   priority exactly as written
2. Below it, the three strongest candidates that were not ranked
3. "more" shows the next five candidates; "all" shows every axis, by group
4. For each pair the spec could not order (references/priorities.md, "Axes
   that pull against each other"), ask which comes first, through the question
   tool, up to four at a time. Where the spec settled every pair, skip this
5. Take additions in the person's own words, each with where it goes —
   "above 3", "below 1" — and exclusions the same way. Map each onto its key
6. After every input, show the list again and ask whether to go ahead
7. On yes, show the final text (below), then write it to _auto.md
```

**Step 1 is a proposal, and it is said as one** (`../hora/references/asking.md`). The ranking is drawn from the spec, but what the spec says is not a ranking; somebody still has to take it.

**The person never has to know a key.** They say "security first" or "the looks can be plain", and the run maps it, shows it back, and lets them correct the mapping.

**A ranked list has no ties.** Two axes cannot share a position, so no decision can land between two equal weights.

**Where an exclusion contradicts the spec, say so at step 6.** Exclusion never beats the spec (`references/priorities.md`, "How an excluded axis is read"), and a person who learns that at the sweep has learned it too late.

### How the list is shown

**While it is being built — steps 1 to 6 — every group carries a mark and one line saying what it means.**

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

- **👍 ranked, 📝 candidate, 👎 excluded.** The rule puts what can be ranked above it and what was taken out below it
- **With nothing excluded, the rule and everything under it are left out**

### The final text

**The last confirmation shows exactly what `_auto.md` will hold, and nothing else** — no marks, and no candidates, since candidates are not recorded and decide nothing. What an approval protects is that the person read the words that are written (`../hora/references/structure.md`, invariant 1).

```
This goes into .hora/tasks/1.0.0/_auto.md, and implementation starts.

priority:
  1. data-integrity
  2. access-control
  3. auditability
  4. usability
  5. delivery-speed
excluded:
  - i18n
  - seo

Go ahead?
```

**A correction at this point goes back to step 5**, and the list is shown with its marks again.

---

## The preflight

**The last thing done while a person is still there.** Every command the run will need is run once, in a harmless form, so that whatever would stop it later stops it now, in front of somebody who can fix it. **It runs after the declaration, and again at every resume.** Between the two, the environment may have stopped and a login may have expired.

| Checked | By |
|---|---|
| git, in every declared repository and app | `git status` |
| a remote, in every declared repository and app | `git remote get-url origin` |
| the push | `git push --dry-run origin release/<version>` |
| GitHub | `gh auth status` |
| the package manager | `npm --version`, in every repository |
| the environment | the start commands `/hora-setup` recorded in `.hora/tree/<repository>.md`, then the check each records for it. **Held until they exist** (below) |

**On a new project the environment cannot be checked yet.** The declaration comes straight after stage 7, and `/hora-setup` runs later, on the route itself, so at the first preflight no repository exists and `.hora/tree/` records no start command. That is the ordinary first run, not a gap:

```
1. The preflight shows the env line as held — "checked once /hora-setup has
   recorded the start commands" — and does not fail on it. Every other line
   is checked as usual
2. When /hora-setup finishes, before /hora-plan starts, the env check runs on
   its own
3. It fails -> the recorded start command is tried once, then the run stops
   with 🚨 E-ENV. It did start: /hora-setup has already done its work
```

**Before any command that may raise a Claude Code permission prompt, say so, on its own line, marked 🔐.** The person has to see at a glance that the prompt is Claude Code's, not a question from hora.

```
🔐 Claude Code permission check (preflight 3 of 8)
   Running: git push --dry-run origin release/1.0.0
   If Claude Code asks for permission, choose not to be asked again.
   This is not a question from hora.
```

**Then the result, one line per check.**

```
🔐 Preflight
   git        passed
   remote     ⛔ frontend-admin has no remote
   push       passed (dry run)
   gh         passed (logged in)
   npm        passed
   env        passed (the backend database is up)
```

**A single ⛔ keeps the run from starting, and that is shown as a stop display headed 🚫** ("How every stop is displayed", below). Nothing has run yet, so it says the run cannot start rather than that it stopped. The code follows the check that failed: the environment `E-ENV`, git, a remote or the push `E-GIT`, `gh` or a permission prompt `E-AUTH`, the package manager `E-NPM`. Cause holds the result above; How far it got says nothing has started, or, at a resume, where the version stands.

```
🚫 The automatic run cannot start  [E-ENV]

Cause
  The preflight did not pass
    git      passed
    env      ⛔ the environment does not answer

How far it got
  Nothing has started

How to resume
  1. Start the environment
  2. Run /hora-auto (/hora resumes in auto mode as well)
```

**This skill never writes the permission settings.** What Claude Code may run without asking is the person's to allow. The preflight reduces the prompts a run meets; it cannot remove them — `gh pr create` has no harmless form, and a command shaped differently from its check may still be prompted for.

---

## The record

```
.hora/tasks/<version>/_auto.md
```

```markdown
# 1.0.0 — automatic

<!-- auto: on; asked for by: <who invoked it>; since: 2026-09-25 -->
<!-- kind: an internal business system; scheduler: hora; date: none -->

priority:
  1. data-integrity
  2. access-control
  3. auditability
  4. usability
  5. delivery-speed
excluded:
  - i18n
  - seo

## Pairs decided at step 4

| Pair | First | Asked because |
|---|---|---|
| simplicity / extensibility | simplicity | the spec states no later version |

## Changes

| Since | Said by | What changed |
|---|---|---|

## Stops

| At | Code | Where | Resumed |
|---|---|---|---|
| 2026-09-26 10:12 | E-ENV | #payroll, checkpoint 6 | 2026-09-26 11:02 |
```

**Every line above `## Stops` is what a person said in the run, recorded with who said it** — the form `_fast.md` and an acceptance record's widening already use. **None of it is a declaration about the product.** It is how this invocation settles what the spec left open, and it asserts nothing `specs/` has to agree with.

**`## Stops` is appended at every stop, before the stop is displayed**, and its `Resumed` cell is filled in when a run picks the version up again. It is how an interrupted run is recognized ("Resuming", below).

**Every line added is committed at once, on its own** — the declaration before the preflight runs, a change as it is said, a stop before it is displayed, the end with `auto: done` (`../hora/references/commits.md`, "Committing `.hora/`"). A stop hands the run to whoever resumes it, so the record has to be in the history by then, not only in the working tree.

**The file is never deleted.** `auto:` moves instead: `done` at the end of the run, `off` when a person turns the mode off, and `on` through every stop and pause, because `on` is what a resume reads. **It belongs to one version**; the next version runs in auto mode only if somebody invokes this skill for it.

**`scheduler: fast` also writes `_fast.md`**, exactly as invoking `/hora-fast` does (`../hora-fast/SKILL.md`, "The record"). The two files stay apart: one says who decides, the other says when features run.

---

## How every other skill knows

**Every hora skill reads `_auto.md` before it would put anything to a person, and before it would stop on a `blocking: yes`.** `auto: on` means nobody is there: it asks nothing, and takes the three kinds below instead (`../hora/references/asking.md`, "When nobody is there to ask").

**The file decides, never the conversation.** `/hora-plan` and `/hora-build` run in the main session, so within one session the conversation remembers that this skill started the run. It stops remembering when the context is compacted and when a new session resumes, and a skill that forgot starts asking and waits forever.

**The agents never need to know.** `hora-implementer` and `hora-verifier` talk to nobody; they report, and the main session decides what the report drives.

**A person who invokes a skill directly on an `auto: on` version is still in auto mode.** To be asked again, they say "stop auto" ("What a person says to this skill", below).

---

## Deciding where you are

**`/hora`'s steps, or `/hora-fast`'s where `_auto.md` names it, with three replaced.** Do this every time.

```
0-3. As the scheduler named: fetch, hotfix catch-up, spec, setup, /hora-plan.
     /hora-plan runs without its conversation (below)

4.   An unresolved blocking: yes in open.md
       names a feature  -> that feature is blocked (⛔). Carry on with every
                           feature that does not depend on it
       names no feature -> stop (🚨)
       every feature remaining is blocked
                        -> stop (🚨 E-BLOCKED)

5-6a. As the scheduler named: build, sweep

7.   The version is done except that nothing has merged into main
       -> the end of the run (below). Never the merge
```

**Step 4 is where a blocked feature waits.** It carries its reason in the question that blocked it, so nothing about blocking is written anywhere else; the next run reads `open.md` again, and a feature whose question was resolved is ready again. **A feature that depends on a blocked one waits with it**, and carries no question of its own.

**Step 7 reads `../hora/references/done-criteria.md`, "When a version is done", conditions 1 to 6.** Condition 7 — every repository merged into `main` — is the one this skill never meets, by design.

**Decide where you are from the files, never from memory.** `_plan.md`, the feature files, `open.md` and `_auto.md` say where the run stands. After the context is compacted, and at every resume, read them again rather than trusting what the conversation still holds.

Report the decision in one line before starting — "continuing 1.0.0 automatically. 4 of 11 features done, 1 blocked, building #payroll from checkpoint 6".

---

## Where a person would have been asked

**Every conversation the route has after the spec, and what replaces it here.**

| Where | In `/hora` | Here |
|---|---|---|
| `/hora-setup`, a value the project has to supply | asked | a value nothing can decide stops the run (`E-SETUP`) |
| `/hora-plan`, verifying the spec | each finding settled in conversation, and an edit to `specs/` approved | each finding classified into the three kinds and recorded. **No edit to `specs/` is proposed** |
| checkpoint 1 | the spec read closely; a hole routed to `/hora-spec` or `/hora-plan` | read closely as always. A hole is one of the three kinds, and routed nowhere |
| checkpoints 2, 9 and 11 | the use cases walked with the person | walked by the main session alone, against the declaration. A use case that cannot be completed goes back to the checkpoint its own entry names (`../hora-build/references/checkpoints.md`) — a design fix within the spec is taken; a fix that needs the spec changed is one of the three kinds |
| checkpoint 11's UI/UX context file | filled in with the person | filled in from the spec and the declaration. Every entry the spec did not state is a kind 1 decision |
| `/hora-fast`, a skip at 2, 9 or 11 | a person may ask for one | never. Nobody is there to ask, so every checkpoint runs |
| an acceptance finding the project decides to live with | a person decides, by name | **never decided here.** The finding is fixed, or the feature is blocked ("Acceptance", below) |
| `/hora`'s choices when a version cannot proceed | laid out for a person | laid out in the stop display. **Nothing is dropped, deferred or split** |

**The main session still runs 1, 2, 9 and 11 itself.** Nothing about an automatic run lets an agent take one (`../hora-build/SKILL.md`, "Which checkpoints the main session must run itself").

---

## The three kinds of problem

**Everything a person would have been asked, and everything that would have stopped the run, falls into one of three kinds.** The kind — never the question's category alone — decides what happens.

**No kind writes into `specs/`.** A reading and a gap are both run on, and both wait in `open.md` for a person to settle them in `specs/` later — which is where invariant 2 is kept: the run acted on a guess, and the guess is on record as a guess.

**A category already `blocking: no` is untouched.** `spec-proposal`, `undeclared-behavior`, `inferred-annotation`, `spec-assumption`, `reinvention`, `upstream-defect` and `orphan` are recorded and run on, as they always are; `hotfix-debt` and `eslint-exception` stay fail-loud.

### Kind 1 — a reading

**The spec admits more than one reading, and one has to be chosen.** The reading the highest-ranked axis favours is taken, and recorded as `auto-reading`, `blocking: no`.

| Category | Taken |
|---|---|
| `contradiction`, where one reading can still be met | the side the highest-ranked axis favours |
| `undefined-detail` | the same |
| `common-file` | the handwritten content kept |
| a checkpoint's own judgment at 2, 9 or 11 | the same, against the declaration |

### Kind 2 — a gap

**Filling it would state intent the spec never stated.** It is **leaned to the side that is easier to loosen later** (`references/priorities.md`, "Which lean applies"), and recorded as `auto-default`, `blocking: no`, **fail-loud**.

| Category | Leaned to |
|---|---|
| `missing-authorization` | the two steps of `references/priorities.md`, "Leaning a permission" |
| `missing-usecase`, `missing-acceptance`, `unmet-usecase` | only what the spec states is built. No use case is made up |
| `scope` | outside the scope |
| `existing-assets` | the existing code left untouched |
| `undefined-api-kind` | a mutation where the operation changes state, a query where it does not |

**Kind 2 is fail-loud because it is a guess about intent.** A closed permission hides nothing it should show only for as long as somebody checks that nobody who needed it was shut out. So every `auto-default` is named at the top of the stop display and at the top of every pull request, where the person who merges cannot miss it.

### Kind 3 — a stop

**No decision resolves it.** It is raised as its category says, `blocking: yes`, and it stops either the one feature it names (⛔) or the whole run (🚨).

| Where | Stops | Code |
|---|---|---|
| `versioning`, an `id` collision, a dependency cycle, a layout outside the catalog's bounds, a spec that declares no roles for a permission to lean to | the run | `E-SPEC` |
| `forward-reference`, a `target` naming no row, `contractDrift`, a `contradiction` no reading can meet | the feature | `E-SPEC` |
| a version criterion that fails in the part it rests on | the run, at the sweep | `E-SPEC` |
| `/hora-setup` needing a value nothing can decide, or the stack handbook holding no answer | the run | `E-SETUP` |
| an operation on the dependency tree fails — anything that reads or writes `package-lock.json`: install, ci, update, uninstall, audit | the feature, after one retry | `E-NPM` |
| `lacked-environment`, `unreliable-measurement` | the run, after one restart | `E-ENV` |
| three failed acceptance runs of one feature | the feature | `E-RETAKE` |
| a catch-up with `main` that has to ask, a push refused | the run | `E-GIT` |
| `gh` no longer logged in | the run | `E-AUTH` |

**A command run through npm is not `E-NPM`.** `npm test` and `npm run lint` touch no lock file; their failures are a test and a lint failing, and are fixed and retried as always.

**An environment is restarted once, never more.** The start command `.hora/tree/<repository>.md` records is run again, and nothing else — nothing is rebuilt and no setting is changed. If the environment still does not answer, the whole run stops: every feature needs it, and going on would only reach the same wall. A printer found switched off stops every job, and says so.

**A dependency is retried once, then its feature is blocked.** No other package is chosen in its place and no quarantine is lifted: either would be a decision nobody made.

### The two categories this skill adds

| category | Content | Default blocking |
|---|---|---|
| `auto-reading` | an automatic run chose one reading of the spec, or took a checkpoint's judgment, against the declaration. It names the axis that decided it | no |
| `auto-default` | an automatic run filled a gap in the spec's intent by leaning to the side easier to loosen later. It names the lean taken and what a person would have to state to change it | no, but **fail-loud** |

```markdown
## Q7. Who may read a department's monthly totals is not stated
<!-- spec: payroll -->
<!-- blocking: no -->
<!-- category: auto-default -->

The use cases reach the totals only through the payroll administrator, so that
role is granted. Nothing states whether a department head may read their own
department's, so they may not.
Lean: access-control, "the least the use cases need".
To open it, state in #payroll who else may read the totals.

- [ ] resolved
```

**Both are answered the way every question is: by editing `specs/`.** The next `/hora-plan` reconciles the change like any other.

---

## Acceptance

**`/hora-accept` runs exactly as it does under `/hora`**, at every gate and at the sweep. What changes is what happens to a finding a person would have weighed.

```
a finding the implementation can fix
  -> fixed, through a retake/ branch, as always
     the feature's third failed acceptance run -> the feature is blocked (⛔
                                                  E-RETAKE), with an
                                                  acceptance-finding question,
                                                  blocking: yes
a finding the project might live with
  -> never decided here. Fixed, or blocked as above
a finding that is a spec defect
  -> one of the three kinds
```

**Failures are counted, not retakes, and not findings.** The first run fails, two retakes follow, and the third failure blocks the feature — three failures, three logs. **Whether the three failures are the same is never a condition.** Sameness is a judgment a changed line number or timestamp can argue either way, and a limit with a way around it does not end the loop it exists to end. A passing acceptance run starts the count again.

**Sameness is shown instead, as evidence.** The stop display lists the three failures: the same finding three times points at a decision nobody has made; a different one each time points at a design that breaks one thing when it fixes another.

**Every other limit `/hora-build` already holds stays as it is** — the five lint attempts among them.

---

## How progress is reported

**One line per step, in the shape `../hora/references/structure.md`, "Reporting progress", gives.** Two kinds of line carry a mark, so that a person scrolling back through a long run finds them.

| Mark | Line |
|---|---|
| none | a checkpoint passed |
| 🟢 | a milestone: the run starting, a feature's backend gate merged (after checkpoint 9), its frontend gate merged (after 17), its acceptance passed (18), the sweep passed, the push and the pull requests |
| ⛔ | a feature blocked. The run goes on |

```
🟢 #payroll accepted | 5 of 11 features done | next: #bonus
⛔ #bonus blocked | waiting on Q12 (E-NPM). #year-end, which depends on it, waits too | next: #notifications
```

**The words say what happened, whatever the mark.** A mark is where the eye lands; the sentence is what it reads.

**Never end the turn except with a stop display** (below). A line of progress is written and the work goes on; nothing waits for a reply. A turn ended on a progress line, or on "shall I go on?", stops the run with no display at all, and nobody notices that it stopped.

---

## How every stop is displayed

**Every stop, whatever caused it, is displayed in one shape**, like the window of a washing machine that has stopped. It opens with the fact of the stop and its code, then answers three questions in a fixed order: why it stopped, how far it got, and how to resume.

```
🚨 The automatic run stopped  [E-ENV]

Cause
  The backend database does not answer (#payroll, checkpoint 6, running tests)
  Tried: the recorded start command, once -> still no answer
  Recorded: .hora/tasks/1.0.0/_auto.md, "Stops"

How far it got
  1.0.0         4 of 11 features done
  in progress   #payroll, checkpoint 6 of 18. No uncommitted changes
  blocked       ⛔ #bonus  [E-NPM]  Q12
  remote        nothing pushed

How to resume
  1. Start the backend's environment, with the start command .hora/tree/ records
  2. Run /hora-auto (/hora resumes in auto mode as well). It continues from here
```

| Heading | When |
|---|---|
| `🚫 The automatic run cannot start  [<code>]` | the preflight did not pass. Nothing ran |
| `🚨 The automatic run stopped  [<code>]` | anything went wrong while it ran |
| `⏸️ The automatic run is paused  [PAUSED]` | a person asked for a pause |
| `✅ The automatic run is complete  [DONE]` | the end of the run was reached |

- **Cause says what was tried**, so that the person does not try it again
- **How far it got says what the remote holds**, because that is what somebody else can already see
- **Every blocked feature appears under How far it got**, with its own code, whatever stopped the run. A feature that waits on another carries no code, only the name of what it waits on
- **How to resume is a numbered list of what the person does**, ending with the command that resumes
- **It is said in the language of whoever invoked the run**, like everything said in the moment

**It is written to `## Stops` first, then displayed.** The display scrolls away; the record is what the next run and the next person read.

**It heads the closing report.** The four blocks every closing report carries (`../hora/references/structure.md`, "The closing report") follow it unchanged.

### The codes

| Code | Stopped because |
|---|---|
| `E-SPEC` | the spec itself has to change, and only `/hora-spec` may change it |
| `E-SETUP` | `/hora-setup` needs a value nothing can decide, or the stack handbook holds no answer |
| `E-ENV` | the environment does not answer, after one restart |
| `E-NPM` | an operation on the dependency tree failed, after one retry |
| `E-RETAKE` | one feature failed acceptance three times |
| `E-GIT` | a catch-up with `main` has to ask, or a push was refused |
| `E-AUTH` | `gh` is not logged in, or a permission prompt could not be answered |
| `E-BLOCKED` | every feature left is blocked (⛔). Each is listed with its own code |
| `E-INTERRUPTED` | the previous run ended without a display ("Resuming", below) |
| `E-UNCLASSIFIED` | none of the above |
| `PAUSED` | a person asked for a pause. Not a failure |
| `DONE` | the end of the run. Not a failure |

**`E-UNCLASSIFIED` is a defect in this table, never a place to put a stop that is hard to name.** Where a code above fits, it is the one used. Where none does, Cause says in full what happened, where, and what was printed — the code says nothing, so the sentence has to — and the run raises a question asking whether this table needs a new code. `levers.md` treats a missing lever the same way.

### When every feature left is blocked

```
🚨 The automatic run stopped  [E-BLOCKED]

Cause
  Every feature left is blocked (⛔)
    ⛔ #bonus      [E-NPM]     installing date-fns failed twice (Q12)
    ⛔ #year-end   waits on #bonus
    ⛔ #audit-log  [E-RETAKE]  acceptance failed three times (Q15)

How far it got
  1.0.0         8 of 11 features done
  remote        nothing pushed

How to resume
  1. #bonus: read Q12, and fix the install
  2. #audit-log: read the three failures in Q15, then change the spec or decide
  3. Run /hora-auto (/hora resumes in auto mode as well). Every feature that
     was fixed resumes; #year-end resumes with #bonus
```

**A blocked feature keeps the run from reaching its end.** `✅` never appears while one is left, and nothing is pushed.

---

## Resuming

**A stop is not the end of the run; it is where the next run starts.** A person fixes what the display named and invokes `/hora-auto` or `/hora`; `auto: on` is still in `_auto.md`, so the run asks nothing, runs the preflight, and continues.

**An automatic run spends more of a usage allowance than any other**, since nobody is there to pace it. Hitting that limit is ordinary, and so is resuming from it.

**A run that ended without a display is found by the next one.** `_auto.md` reads `auto: on`, and `## Stops` holds no row for the stop that ended it. The next run displays that first, then resumes:

```
🚨 The previous automatic run ended without a display  [E-INTERRUPTED]

Cause
  The session ended before the run could say why
  Likely: a usage limit (the most common), the terminal closed, the machine slept

How far it got
  #payroll, checkpoint 6 recorded. Uncommitted changes: in backend

How to resume
  Nothing to do. It continues from here
```

**Which of those causes it was is never claimed.** A usage limit, a closed terminal and a sleeping machine leave the same files behind, and a display that names a cause it did not see is worse than one that says it cannot tell.

**A checkpoint the interruption cut short is run again from its start.** Its box is still `[ ]`, and a checkpoint run against code already there reconciles rather than creates (`../hora-build/references/checkpoints.md`, "On a repository that is not empty"), so work left half-written is not lost and not duplicated.

**Who invokes the next run is not this skill's business.** A person, a loop or a scheduler all reach the same files; what this skill guarantees is that any of them can resume.

---

## The end of the run

**The run ends where the release begins.** Merging into `main` is the deployment: it tags the version and ships it. **So the run stops before it, and the person who merges is the person who releases.**

```
1. Every condition of done-criteria.md, "When a version is done", holds except
   condition 7, and no feature is blocked
2. Catch up with main once more (../hora/references/commits.md, "Keeping
   release/<version> current"). A hotfix brought in moves a tip the sweep
   drove, so the sweep no longer holds (done-criteria.md, "When a version is
   done", condition 3): back to /hora-accept, whole-version, then here again
3. In every declared repository, then app:
     git -C <repository> push origin release/<version>
4. In every declared repository, then app, open a draft pull request into main.
   The body is written as the equipped skills covering pull requests say.
   Wherever it opens, it opens with:
     every auto-default question — its Q<n>, one line, and the link
     every other fail-loud item
     app's pull request only: that it merges last, after every other
       repository's (../hora/references/commits.md, "Merge order into main")
5. Write auto: done into _auto.md, and display ✅ DONE. How to resume reads:
   review the draft pull requests, then merge app last
```

**Invoking this skill is the permission for steps 3 and 4, and for nothing else.** It covers one push of `release/<version>` per repository and one draft pull request each. **It never covers `--force`, a push to any other branch, a pull request marked ready, or a merge.** A push the remote refuses stops the run (`E-GIT`) as it was refused; it is never retried with a flag that would make it pass.

**Every pull request is opened as a draft.** Whether it is ready for review is the person's call (`gh pr ready`), and so is the merge.

**Where a pull request cannot be opened** — `gh` logged out since the preflight — the run stops (`E-AUTH`). Everything is committed and pushed by then, so logging in and resuming picks up at step 4.

---

## What a person says to this skill

**Everything here is said in the run and recorded in `_auto.md` with the name of whoever said it.** A message typed while the run is working reaches it mid-turn, so any of these can be said at any time.

| Said | Read as | Recorded |
|---|---|---|
| **invoking this skill** | run this version automatically, from the declaration — or resume it | `auto: on; asked for by:` |
| **a pause** — "pause" | finish the checkpoint in progress, write its box, and stop with ⏸️ `PAUSED`. Resumed by invoking this skill or `/hora` | a row under `## Stops`. `auto:` stays `on` |
| **a change to the ranking** — "put security first" | the declaration's steps 5 to 7, again | a row under `## Changes`. **Decisions already taken stand**; the new order decides from here on |
| **turning it off** — "stop auto", "back to asking" | ask again from the next point a person would be asked | `auto: off; asked for by:`. The run continues as `/hora`, or as `/hora-fast` |

**A pause waits for the end of a checkpoint; Claude Code's own interrupt does not.** A run interrupted mid-checkpoint is found as `E-INTERRUPTED` when it resumes, and that checkpoint starts again.

**Turning it off takes nothing back.** Every `auto-reading` and `auto-default` already recorded stays open in `open.md` for a person to settle.

---

## What this gives up, and where it is written

| Given up | What stands in its place |
|---|---|
| a person settling each hole in the spec as it is found | a decision against the declaration, recorded as `auto-reading` or `auto-default` |
| a use case walked with somebody who knows what it is for | the same walk, by the main session alone |
| a finding the project chooses to live with | a fix, or a blocked feature |
| `/hora`'s choices laid out when a version cannot proceed | the same choices, in the stop display, taken by nobody |

**Nothing about verification is on this list.** Every checkpoint, every verifier, every audit, every suite and the sweep run as they do under `/hora`. **A ranking can add to them — `test-depth` writes more cases — and can never take any away.**

---

## What must never be traded

- **The spec.** Never written, never edited, never worked around by an agent
- **Verification.** No checkpoint skipped, no test weakened, no audit narrowed, whatever the ranking says
- **A guess recorded as a guess.** Every decision a person would have taken is in `open.md`, as the kind it is
- **A stop displayed as a stop.** Every stop in the one shape, recorded before it is shown, and never a turn ended in silence
- **The merge into `main`.** Never made, never hurried. A draft pull request is where the run ends
- **The permission.** One push of `release/<version>` per repository and one draft pull request each. Nothing forced

---

## References

| File | Content |
|---|---|
| `references/priorities.md` | every axis, its lean, the pairs that pull against each other, and where each kind of project starts |
| `../hora/SKILL.md` | the serial scheduler — its decision steps and its closing report |
| `../hora-fast/SKILL.md` | the parallel scheduler, and its record |
| `../hora/references/structure.md` | the layout, the invariants, where a lever lives, how a question is cited, how progress is reported, the closing report |
| `../hora/references/asking.md` | a proposal and the question tool, at the declaration — and what every skill does when nobody is there to ask |
| `../hora/references/commits.md` | every branch and commit rule, catching up with main, and the merge order into main |
| `../hora/references/done-criteria.md` | when a version is done |
| `../hora-plan/SKILL.md` | the question categories this skill adds two to |
| `../hora-build/SKILL.md` | how one checkpoint runs, which run in the main session, and its retry limits |
| `../hora-build/references/checkpoints.md` | the eighteen checkpoints, where each sends a use case back to, and why a checkpoint reconciles |
| `../hora-accept/SKILL.md` | the gate runs, the sweep, and what a failure does |
