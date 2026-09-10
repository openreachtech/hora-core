---
name: hora-fast
description: Build a version's features several at a time, each in its own git worktree, after the parts they share have been built once. Uses the same spec, plan, feature files and acceptance as /hora, and replaces only the scheduling. Invoked instead of /hora, by an explicit /hora-fast, when one feature at a time does not fit the date.
---

# hora-fast

**The parallel scheduler.** Same spec, same plan, same feature files, same acceptance as `/hora`. What changes is *when* a feature's checkpoints run: several features at once, each in its own worktree, after the parts they share have been built once and fixed.

**The design in one sentence: each feature is verified statically as it lands; the version is verified live, once, at the end.** A feature's checkpoint 18 is the browser-less gate run `/hora-accept` already defines. The browser-driven review runs once, over the whole version, at the sweep.

Read `../hora/references/structure.md` first, then `../hora-build/references/checkpoints.md`. Both apply here unchanged, and so does every git rule in `../hora/references/commits.md`.

---

## What is shared with `/hora`, and what is replaced

| | |
|---|---|
| **shared, unchanged** | `/hora-spec`, `/hora-setup`, `/hora-plan`, `/hora-accept`, `/hora-hotfix`; the three invariants; every branch and commit rule; the eighteen checkpoints and their exit conditions; the feature file, its run record and the acceptance records; what "done" means |
| **replaced** | `/hora`'s "one feature to acceptance before the next starts", and `/hora-build`'s "never alongside another feature" |
| **added** | the foundation, the worktrees, the parallel loop, the merge step, the drain, and one record file |

**The feature file is the contract between the two schedulers.** Every checkbox this skill writes into `.hora/tasks/<version>/<feature-id>.md` is one `/hora-build` would have written, with the same marks, the same run record and the same checkpoint 18. Either scheduler can continue a version the other started: each reads the first `[ ]` and goes on from there ("Switching between the two schedulers", below).

**This skill edits no hora file and restates none.** Where a rule below reads like one in `/hora-build`, it is a pointer.

---

## Whether this is the right skill

Run the equipment check `/hora` runs (`../hora/SKILL.md`, "Whether hora can start at all"). Then the arithmetic:

```
pace       seconds per feature, from the run records of the features already
           done in this version (agent-time: summed over a feature's lines),
           or from the previous version while none is done
remaining  features in _plan.md still [ ]
days       the date, from whoever invoked this. It is not in the spec, and it
           is never inferred

pace x remaining <= days   -> say so, and run /hora instead
```

**The run record measures agents, not people.** Checkpoints 1, 2, 9 and 11 run in conversation under either scheduler, so a version that waits mostly on a person gains nothing here. Say so when that is the case.

**A person chooses this skill by invoking it, and the invocation is the whole decision** (`../hora/references/structure.md`, "Where a lever lives", question 2). The record says who chose it ("The record", below).

---

## Deciding where you are

`/hora`'s steps, with 4a and 5 inserted. Do this every time.

```
0.   As /hora: fetch and prune everywhere, catch up with a hotfix, read the
     open hotfix debts. Then, in every declared repository:
       git -C <repository> worktree list
     Every worktree under .worktrees/ is a feature in flight. Report them

1-4. As /hora: spec -> /hora-spec, missing row -> /hora-setup, always
     /hora-plan, a blocking question -> stop

4a.  Is a main working copy on a feature/ branch — a feature /hora left
     mid-gate?                     if so -> move it into a worktree ("Moving
                                            a mid-gate feature", below).
                                            Stop only if the move fails

5.   Is the foundation built and fixed?
                                   if not -> build it ("The foundation")

6.   Are there features still [ ] whose depends are satisfied?
                                   if so -> run them, up to the limit ("The
                                            parallel loop"). A feature whose
                                            only open checkpoint is 18 gets
                                            its gate run ("Checkpoint 18, and
                                            the sweep")

7-8. As /hora's 6, 6a and 7: no [ ] left and no passing full sweep
     -> /hora-accept, whole-version; then the merge into main
```

Report the decision in one line before starting — "continuing 1.0.0 in parallel. Foundation fixed, 4 of 11 features done, 3 in flight, opening #payroll".

---

## The foundation

**Every file two features would both write is built once, before any feature starts.** This is `/hora-build`'s exclusivity rule one level up: there, a file two *units* would both write goes to one of them; here, a file two *features* would both write goes to the foundation.

**It is derived against `release/<version>`'s tip.** What the remaining features share and the tip already holds — a table an earlier feature built, a `Base` member already merged — is done, not foundation work. On a version `/hora` started, most of it is.

### What is in it

| | Found where |
|---|---|
| the contracts, per server | already derived and pinned by `/hora-plan`, step 3. They are the foundation's core |
| a table more than one remaining feature reads or writes | the spec's data model, read against each feature section. The data model is already a task of its own (`spec: <version>#data-model`) |
| the types generated from the contracts | whatever the equipped skills covering API schemas generate |
| a conflict-proof file's planned change — an environment key, a compose profile, a `Base` member | `/hora-build`, "Conflict-proof files are reported, not written directly". A feature in flight cannot wait for one, so they go in first |
| a dependency the plan can already see | the spec's key file map and the stack handbook. One that surfaces during implementation is handled in flight (below) |
| shared seed data — master rows every feature reads | the manual verification section and the use cases |
| every file `/hora-plan` marked `Conflict:` in more than one feature file | `../hora-plan/SKILL.md`, "Mark what overlaps" |

**An aggregation file is derived, so it is regenerated at every merge rather than built here.**

### How it is built

```
1. List the files from the table above in _fast.md, each with what it is for.
   The main session reads and records this before anything is written
2. Run the checkpoints that apply — 3 for tables and schema, 5 for a shared
   module, and the seed — exactly as /hora-build runs one checkpoint: the
   skills match, the digests, one implementer per exclusive unit, lint, the
   verifier, the run record. The record goes on the foundation's own lines
   in _fast.md
3. Each change lands as commits.md says a planned change to something shared
   lands: an update/ branch into release/<version>, in the main working copy
4. The contract check (below), then every repository's whole suite on the tip
5. Mark the foundation fixed in _fast.md
```

### The mechanical contract check

**Parallel transcription fails by silent divergence**: the declared surface, the generated types and the stubs each correct alone and different from each other. Prose misses it.

| | |
|---|---|
| **Delegate to** | the skills covering the API schema and the types generated from it |
| **What this skill adds** | the check is a command, and its output is read whole. It runs here and again at every merge |
| **Exit condition** | the foundation's files are on `release/<version>`'s tip in every repository, the contract check passes, the shared seed loads, and every repository's suite passes on that tip |

---

## Worktrees

**One worktree per feature, per repository it touches, on the `feature/<feature-id>` branch `commits.md` names.** The branch rules stay as they are; the branch gets a directory of its own.

```
<project>-app/                                  cwd, as always
  <project>-backend/                            the main working copy. Stays on release/<version>
  .worktrees/<feature-id>/<project>-backend/    feature/<feature-id>, this feature only
  .worktrees/<feature-id>/<project>-frontend-*/ the same, per frontend row the feature touches
```

**`.worktrees/` is ignored by the hora repository, like the nested rows.** Add the line to its `.gitignore` when it is missing.

**A worktree is the repository, for every rule that says "from inside the repository".** `cd`, `git -C`, lint, tests, the change-set derivation — all run in the worktree (`../hora/references/structure.md`, "Where a per-repository command runs"). Running one of them in the main working copy for a feature in flight is that file's wrong-directory failure, one level up.

**What a second working copy needs — dependencies, a database, ports — is the stack handbook's answer**, read at run time like every other stack fact. A missing answer is a `lacked-environment` question, never a guess.

```
open   on entering the gate's first checkpoint — 3 for the backend row, 10
       for a frontend row — where /hora-build cuts the branch:
         git -C <repository> worktree add ../.worktrees/<feature-id>/<repository> \
             -b feature/<feature-id> release/<version>
         then what the handbook says a second copy needs, run inside it

close  once that gate has merged — 9, or 17:
         git -C <repository> worktree remove ../.worktrees/<feature-id>/<repository>
         the branch is handled as commits.md handles a merged branch
```

**How many features are open at once is a limit a person sets; the default is three.** It bounds machine load and the main session's attention. Correctness does not depend on it.

**A session that ends mid-feature loses nothing.** Step 0 finds every open worktree from git, and the next run re-enters the feature at its first `[ ]`, in the worktree it already has.

### Moving a mid-gate feature into a worktree

`/hora` keeps the feature it is building in the main working copy, on its `feature/` branch, and mid-gate that copy may hold uncommitted work: implementation commits follow the package's convention, and `.hora/` commits at the gate's end. A branch checked out in the main copy cannot be checked out in a worktree as well, so the feature moves, and its uncommitted work moves with it:

```
git -C <repository> stash push -u                       everything uncommitted, untracked included
git -C <repository> switch release/<version>
git -C <repository> worktree add ../.worktrees/<feature-id>/<repository> feature/<feature-id>
git -C ../.worktrees/<feature-id>/<repository> stash pop
```

**The stash creates no commit**, so the package's commit granularity is untouched. The work lands in a fresh checkout of the same branch, so the pop has nothing to conflict with. Ignored files stay behind; the worktree gets its own, as the handbook says.

**Stop only when a step fails, and say which.**

---

## The parallel loop

```
1. ready = every feature in _plan.md that is [ ], not in flight, and whose
   depends are all [x] or listed
2. while fewer than the limit are in flight and ready is not empty:
     start the first one at its first [ ] checkpoint
3. each feature in flight runs /hora-build's "Running one checkpoint",
   steps 1-11, in its worktree — the same split between interactive,
   implementing and auditing checkpoints, the same units, the same skills
   match, the same run record. Step 4's "cut the branch" is "open the
   worktree"
4. at checkpoint 9 and at 17, its branch merges ("The merge step")
5. once its last gate has merged, checkpoint 18 runs ("Checkpoint 18, and
   the sweep") and its entry in _plan.md is set, as /hora-build sets it
6. back to 1
```

**Nothing waits unless it must.** The main session is the only orchestrator, so its time is the critical path, and most of the waiting is off it. Before every long command, ask what the next step is and whether it needs this answer. If it does not, run the command in the background and start the next feature's next step. Two commands that do not read each other's output go out together. A backgrounded command's directory does not persist, so write the worktree path into the command. A background job's result arrives later: no checkbox, record or verdict is written before it does.

**Reading less is not speed.** Every result is read whole. Anything that can refuse is never piped through `tail`.

### The interactive checkpoints

**1, 2, 9 and 11 run in the main session, one feature at a time, as `/hora-build` says.** When several features reach one together, they are taken in turn, and the person is told how many are waiting.

**A person may say that 2, 9 or 11 is to be skipped for one feature.** It goes on that checkpoint's line — `<!-- skipped: asked for by … -->` — and into the closing report. **Checkpoint 1 cannot be skipped while the spec is missing**: skipping a check gives up a verification; skipping the spec invents one (`../hora/references/structure.md`, invariant 2).

### What surfaces in flight

| A feature reports | This skill does |
|---|---|
| `dependencies`, `conflictProof` | as `/hora-build`: an `install/` or `update/` branch into `release/<version>`, in the main working copy. The reporting feature rebases at once; every other worktree rebases at its next merge |
| everything else | as `/hora-build`, "What an implementer agent may not do" and "What the verifier's report drives" — in that feature's worktree, against that feature's file |

---

## Keeping N features' tests apart

**Every feature's tests eventually run together, against one database, in whatever order the run gives them** (`../../agents/hora-verifier.md`). This skill adds no requirement; it makes that one bite from the first checkpoint instead of the eighteenth.

| Rule | Why, and who owns the how |
|---|---|
| **Every row a feature seeds or creates has an id in that feature's band** | the band is the row-id prefix `/hora-build` allocates once per feature. The allocator's skill owns it |
| **Seed data comes in two kinds, in two places** | master rows every feature reads: the foundation. A feature's own rows: its own seeder file, in its band. The seeders' aggregation file is regenerated at merge |
| **A test asserts inside its band, never on a total** | "the list returns three rows" breaks when another feature seeds one. The skills covering unit tests own the form; this skill only rules the total out |
| **In flight, each worktree has its own database** | so a suite never sees another feature's half-written rows. The stack handbook says what a second database is |
| **On `release/<version>`, the merged suite shows interference** | the one place two features' tests meet before the sweep, and why the merge step runs the whole suite |

---

## The merge step

At checkpoint 9 for the backend row and 17 for a frontend row, as `commits.md` says. What this skill adds, because other features are in flight:

```
1. install/ and update/ branches waiting to merge go first (commits.md)
2. merge feature/<feature-id> into release/<version>, in the main working copy
3. regenerate every aggregation file on release/<version>, from the folder
   scan, as /hora-build step 6
4. run the contract check and that repository's whole suite on the tip
     red -> the merged feature's files are exclusive, so the failing test
            names its owner. Clear that feature's checkpoint in its file,
            with reopened-by: merge, and re-enter it in its worktree
5. close the worktree
6. every other worktree rebases onto the new tip at its own next merge
```

**A feature's change set is still derived from the repository.** Each commit carries its `spec: <version>#<id>` trailer, so `/hora-build`'s third line finds a landed feature, worktree or not.

---

## Checkpoint 18, and the sweep

**Checkpoint 18 runs per feature, as the gate run `/hora-accept` defines: every repository's unit suite, the scenario list, the review's static checks, no browser** (`../hora-accept/SKILL.md`, "What is in scope"). It runs in the main working copy on `release/<version>`'s tip, once the feature's last gate has merged — the same place and reach `/hora` gives it. Its record goes to `.hora/acceptance/<version>/<feature-id>.md`, its `[x]` to the feature file, its entry to `_plan.md`.

**This keeps the two schedulers' files identical, and it catches a finding while the feature is one merge old.** It costs one static review per feature, run in the background while other features go on.

**The version is verified live once, at the sweep**: `/hora-accept` at full reach, unchanged — the environment, every suite executed for real, every scenario, the browser-driven review, UX, security, the version's own criteria. **This is the run the design rests on.** What a browser-less gate cannot see — a screen empty because the feature that fills its table was built beside it, a flow that crosses two features — is found here.

**Findings route as they always do** — a checkpoint cleared in a named feature, rebuilt through a `retake/` branch (`../hora-accept/SKILL.md`, "What a failure does") — **and a retake opens a worktree like any feature**, up to the limit.

---

## Switching between the two schedulers

**Both schedulers read and write the same files, so switching converts nothing. What has to line up is git: where each main working copy stands.** `/hora` keeps one feature there; this skill keeps none.

### From `/hora` to this skill

**Any time.** Step 4a moves the feature `/hora` may have left mid-gate into a worktree, uncommitted work included. Every other feature is done or not started, and both states read the same to either scheduler. Finished features keep their records, their accepted checkpoint 18 and their `[x]` entries, and their run records give the arithmetic its pace.

### From this skill to `/hora`

**Drain first.** `/hora` does not know worktrees, and `/hora-build` cuts `feature/<feature-id>` in the main working copy — git refuses while that branch is checked out in a worktree. A drain is asked for in the run ("What a person says to this skill", below):

```
a drain
  opens nothing new
  runs every feature in flight to the end of its current gate, merges it,
    and closes its worktrees — the loop without step 1
  ends when git -C <repository> worktree list shows nothing under .worktrees/
  writes drained into _fast.md, and reports where it left each feature
```

After a drain, every feature is at a gate's entrance and every main working copy is on `release/<version>`: `/hora`'s own starting state. The foundation is code on the tip, and a checkpoint run against existing code reconciles rather than creates (`../hora-build/references/checkpoints.md`, "On a repository that is not empty"). `_fast.md` stays as the record.

**A drain finishes gates rather than moving features back, because `/hora` has room for one feature.** The mirror of the move above — stash in the worktree, remove it, switch the main copy, pop — would spare one feature its remaining checkpoints. Add it when a drain proves slow.

**Skipping the drain fails loudly.** `/hora` builds features that have no worktree as usual, and stops at git the first time it picks one that has. The parked worktrees wait until this skill runs again. A guard line in `/hora`'s step 0 would turn that stop into a sentence ("What this asks of hora"); it is a courtesy.

---

## What a person says to this skill

**Everything here is said in the run and recorded with the name of whoever said it** — the form `/hora-accept` uses for a widening (`../hora-accept/SKILL.md`, "What is in scope"). Four things can be said:

| Said | Read as | Recorded |
|---|---|---|
| **invoking this skill** | choose the parallel scheduler for this version | `_fast.md`, `scheduler: fast; asked for by:` |
| **a limit** — "three at a time", "raise it to five" | how many features may be in flight. Three by default | `_fast.md`, `limit:` |
| **a drain** — "drain", "close the worktrees", "hand over to `/hora`" | open nothing new; finish what is open to its gate; close | `_fast.md`, `drained: yes; asked for by:` |
| **a skip** — "skip 9 for #payroll" | 2, 9 or 11, for one feature, this once | that checkpoint's line in the feature file |

**Typed after the skill's name — `/hora-fast drain` — it arrives as the same sentence and is read the same way.** There are no arguments, so there is no rule for an unknown one.

**Anything else about how much to do belongs to another skill's rule** — the reach of an acceptance run to `/hora-accept`, a not-applicable mark to `checkpoints.md`.

---

## What this gives up, and where it is written

**The serial scheduler catches a regression in the run that caused it, one commit old, and drives every feature's screens before the next feature starts.** This skill trades both, and writes the trade where the next run reads it.

| Given up | What stands in its place |
|---|---|
| a regression caught at the checkpoint that caused it | caught at the merge step, attributed by the merged feature's exclusive files |
| a feature's screens driven at its own gate | the static gate run per feature; every screen driven once, at the sweep |
| the person's conversations spread over the version | batched: several features reach checkpoint 9 in the same hour |
| cross-feature findings arriving one at a time | arriving together at the sweep, each opening a retake worktree |
| one working copy and one database per repository | one more per feature in flight |
| a `Conflict:` line `/hora-plan` missed | a merge conflict at the merge step, instead of a mark at planning |

### The record

```
.hora/tasks/<version>/_fast.md
```

```markdown
# 1.0.0 — parallel

<!-- scheduler: fast; asked for by: <who invoked it>; since: 2026-09-10; limit: 3 -->
<!-- drained: no -->

## Foundation

<!-- fixed: 2026-09-11; contract-check: passed 2026-09-11 -->

| File | For |
|---|---|
| `db/migrations/…-create-departments.js` | #attendance, #payroll read it |
| `.env.development` | QUEUE_URL, for #payroll and #notifications |
| `db/seeders/…-master-departments.js` | master rows every feature reads |

- [x] 3. DB and API schemas  <!-- skills: …; digests: … --> <!-- agents: 2; agent-time: 310s; verify-time: 90s -->
- [x] 5. Shared modules      <!-- … -->
```

**Every line is a record or a derivation.** Who chose the scheduler is a fact about an invocation, recorded as an acceptance record's `asked for by:` is. The foundation table is derived from the spec and the tip. The checkpoint lines are the run record a feature file carries. **Open worktrees are read from `git worktree list`, never recorded here** — a copy is what goes stale. A skipped checkpoint is on its own line in the feature file.

---

## What must never be traded

Everything above changes *when* a checkpoint runs. Nothing above changes what one checks.

- **The order holds inside a feature.** No checkpoint is entered before every earlier one in its own feature is `[x]`, whatever runs beside it
- **No test is weakened, skipped, loosened or waited out.** The suites on `release/<version>` run whole, at every merge and every gate run
- **Every verdict carries its real reach.** A gate run records `live: no`; the sweep records `full`; a skipped checkpoint is on its line and in the report
- **No environment is left broken, and every worktree is visible to git**
- **The merge into `main` is never hurried.** It is the one step that leaves the machine. Every warning the remote prints is a stop. The momentum this skill builds is what that step has to resist

---

## The closing report

As `/hora`'s, plus:

```
the scheduler, who chose it, and the limit
the foundation's state, and the contract check's last result
every feature in flight — its worktrees, and the checkpoint it stands at
every checkpoint skipped, by feature, and for whom
git status --short --branch for the main working copy AND every open
  worktree of every repository. The outer git status sees none of them
what a drain would have to finish, if /hora is to take over
```

---

## What this asks of hora

Edits the other files need before this skill ships. None is made here.

| File | Edit |
|---|---|
| `../hora/references/structure.md`, "What lives in `.hora/`" | one row for `tasks/<version>/_fast.md` |
| `../hora/references/levers.md` | rows for: the scheduler chosen at the invocation; a checkpoint skipped on instruction; the drain |
| `../hora-build/SKILL.md`, "A checkpoint line's run record" | `wall-time:` per line, so the arithmetic above has its number |
| `../hora/SKILL.md`, "The shape of a run" | one line naming this skill as the alternative scheduler, and where it is chosen |
| `../hora/SKILL.md`, "Deciding where you are", step 0 | the courtesy guard: a worktree under `.worktrees/` in any repository stops the run and points at a drain through `/hora-fast` |
| `../hora-accept/SKILL.md`, "What is in scope" | the gate-run row reads "checkpoint 18 of `/hora-build`"; it is checkpoint 18 of this skill too |

---

## References

| File | Content |
|---|---|
| `../hora/SKILL.md` | the serial scheduler — its decision steps and its closing report |
| `../hora/references/structure.md` | the layout, the invariants, where a command runs, where a lever lives |
| `../hora/references/commits.md` | every branch and commit rule, unchanged here |
| `../hora-build/SKILL.md` | how one checkpoint runs — this skill runs it in a worktree |
| `../hora-build/references/checkpoints.md` | the eighteen checkpoints, and why a checkpoint reconciles against existing code |
| `../hora-plan/SKILL.md` | the plan, and the `Conflict:` marks the foundation reads |
| `../hora-accept/SKILL.md` | the gate run each feature gets, and the sweep the version gets |
| `../../agents/hora-verifier.md` | why every feature's tests must already survive each other |
