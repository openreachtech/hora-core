<!-- 日本語版: [parallel.ja.md](./parallel.ja.md) — 片方を直したら、同じコミットでもう片方も直してください -->

# The parallel route

*[日本語](./parallel.ja.md)*

The version holds eleven features, the last version's pace says one feature takes four days, and nobody wants to wait six weeks. The normal route — one feature through eighteen checkpoints, accepted, then the next — is the right route, and it is slow.

`/hora-fast` is the other one. **It builds the parts the features share first, then builds the features side by side, each in its own git worktree, and verifies the version live once at the end.** The spec, the plan, the feature files and the acceptance records are exactly what `/hora` writes, so either scheduler can continue what the other started.

```
/hora        one feature  →  18 checkpoints  →  accepted  →  the next feature
/hora-fast   the shared files once  →  features side by side, 18 each  →  one live sweep
```

**`/hora` never starts it.** Whether to build in parallel is a person's call, so you type `/hora-fast` yourself.

---

## Contents

- [When it pays, and when it cannot](#when-it-pays-and-when-it-cannot)
- [What stays the same](#what-stays-the-same)
- [The foundation](#the-foundation)
- [One worktree per feature](#one-worktree-per-feature)
- [Keeping the tests apart](#keeping-the-tests-apart)
- [What a feature proves, and what the version proves](#what-a-feature-proves-and-what-the-version-proves)
- [Switching between the two](#switching-between-the-two)
- [What it gives up](#what-it-gives-up)
- [Things worth knowing](#things-worth-knowing)
- [Where to go next](#where-to-go-next)

---

## When it pays, and when it cannot

The skill estimates before anything else: the measured pace per feature, times the features remaining, is what `/hora` would take from here. It says that number, and it asks whether there is a date. **It does not assume one.** Most versions have none, and wanting the version sooner is reason enough. Where a date exists and the serial estimate fits it, the skill says so, and the person chooses — parallel building has a cost, listed below, and a version that fits serially may prefer not to pay it.

The pace comes from the run record every checkpoint line carries — `wall-time:`, the seconds from entering a checkpoint to marking it. Four of the eighteen are conversations: 1, 2, 9 and 11 put the use cases to a person, and their `wall-time:` is mostly that person answering.

**Those four take the same time under either scheduler.** Agents run side by side; a person answers one question at a time. A version whose time sits mostly on those four lines gains nothing from `/hora-fast`, and the skill says so when the records show it.

---

## What stays the same

Everything except the order.

| | |
|---|---|
| **unchanged** | `/hora-spec`, `/hora-setup`, `/hora-plan`, `/hora-accept`, `/hora-hotfix`; the eighteen checkpoints and their exit conditions; the feature file, the run record, the acceptance records; every branch and commit rule; the three invariants |
| **replaced** | `/hora`'s "one feature to acceptance before the next starts" |
| **added** | the foundation, one worktree per feature, a merge step, a drain, and one record file — `.hora/tasks/<version>/_fast.md` |

**The feature file is what makes the two schedulers interchangeable.** `/hora-fast` writes the same eighteen checkboxes, the same marks and the same run record `/hora-build` would have written. So `/hora` reads a version `/hora-fast` half-built as an ordinary version with some features done, and the reverse holds too ("Switching between the two", below).

A checkpoint runs exactly as `/hora-build` runs it — the same skills match, the same agents, the same verifier — with one difference: it runs inside that feature's worktree.

---

## The foundation

`/hora-build` already runs the units of one checkpoint side by side, and the rule that makes that safe is exclusivity: a file two units would both write belongs to one of them. **`/hora-fast` lifts the same rule one level: a file two features would both write belongs to the foundation, and the foundation is built once, before any feature starts.**

| In the foundation | Found where |
|---|---|
| the contracts, per server | `/hora-plan` already derives and pins them |
| a table more than one feature reads or writes | the spec's data model |
| the types generated from the contracts | the equipped schema skills |
| a planned change to a conflict-proof file — an environment key, a compose profile, a `Base` member | `/hora-build`'s own list of files no checkpoint may edit alone |
| a dependency the plan can already see | the spec's key file map and the stack handbook |
| the master rows every feature reads | the seed |
| any file `/hora-plan` marked `Conflict:` in more than one feature | the feature files |

It is built in the main working copy, on `release/<version>`, through the same checkpoints and the same agents a feature gets, and it ends with two checks: **a mechanical comparison of the declared contract, the generated types and the stubs**, and every repository's suite on the tip. The comparison exists because parallel transcription fails by silent divergence — three artefacts each correct alone and different from each other — and prose does not catch that.

**The foundation is derived against the tip, so on a version `/hora` started it is mostly already there.** A table an earlier feature built is done, not foundation work.

---

## One worktree per feature

[`architecture.md`](./architecture.md), "Why it is serial", records the problem: one working directory holds one branch, so two features in one tree cannot each have their own commits. **A git worktree gives each feature a directory of its own, and the problem goes away.** The branch is still `feature/<feature-id>`, cut where `/hora-build` cuts it and merged where `commits.md` merges it; what changes is that it lives under `.worktrees/` instead of in the main working copy.

```
<project>-app/
  <project>-backend/                            the main working copy, on release/<version>
  .worktrees/attendance/<project>-backend/      feature/attendance
  .worktrees/payroll/<project>-backend/         feature/payroll
  .worktrees/payroll/<project>-frontend-admin/  feature/payroll, in the frontend row
```

Every rule that says "from inside the repository" reads the worktree as the repository. Lint, tests and the change-set derivation run there, and a command run in the main working copy for a feature in flight is the wrong-directory failure [`structure.md`](../kit/skills/hora/references/structure.md) already warns about.

**A second working copy needs its own dependencies, its own database and its own ports, and what those are is the stack handbook's answer.** `/hora-fast` states the need; the handbook, read at run time, says how. Where the handbook has no answer, the run stops with a `lacked-environment` question rather than guessing.

The number of features open at once is a limit a person sets, three by default. It bounds machine load and the main session's attention; correctness does not depend on it.

### The merge step

When a feature's gate ends — checkpoint 9 for the backend, 17 for a frontend — its branch merges into `release/<version>` as always. Because other features are in flight, three things follow:

1. the main session regenerates every aggregation file on the tip, from the folder scan
2. the contract comparison and that repository's whole suite run on the tip. **A red here names its owner**, because the merged feature's files are exclusive, and that feature goes back to the checkpoint that produced it
3. every other worktree rebases onto the new tip at its own next merge

---

## Keeping the tests apart

[`hora-verifier.md`](../kit/agents/hora-verifier.md) already requires every feature's tests to survive running together, in any order, against one database. `/hora-fast` adds nothing to that requirement; it makes it bite from the first checkpoint instead of the eighteenth. Four things keep N features' tests apart:

| | |
|---|---|
| **a band per feature** | `/hora-build` already allocates each feature a row-id prefix. Every row a feature seeds or creates carries an id in its band |
| **two kinds of seed** | master rows every feature reads live in the foundation. A feature's own rows live in its own seeder file, in its band |
| **no assertion on a total** | "the list returns three rows" breaks the moment another feature seeds one. A test asserts inside its band |
| **a database per worktree** | so a suite in flight never sees another feature's half-written rows |

**The merged suite on `release/<version>` is where two features' tests first meet**, and it runs at every merge for that reason.

---

## What a feature proves, and what the version proves

**Each feature's checkpoint 18 is the gate run `/hora-accept` already defines: every repository's unit suite, the scenario list, the review's static checks — and no browser.** It runs on the tip once the feature's last gate has merged, the same place and the same reach `/hora` gives it, and it writes the same record. That keeps the two schedulers' files identical, and it catches a finding while the feature is one merge old.

**The version is driven live once, at the whole-version sweep.** `/hora-accept` at full reach: the environment, every suite executed for real, every scenario, the browser-driven review, UX, security, the version's own criteria. This is the run the design rests on. What a browser-less gate cannot see — a screen empty because the feature that fills its table was built beside it, a flow that crosses two features — is found here.

Findings route as they always do: a checkpoint cleared in a named feature, rebuilt through a `retake/` branch — and a retake opens a worktree like any feature.

---

## Switching between the two

Both schedulers read and write the same files, so nothing is converted. What has to line up is git: `/hora` keeps one feature in the main working copy; `/hora-fast` keeps none there.

**To `/hora-fast`: any time.** The one feature `/hora` may have left mid-gate is moved into a worktree, uncommitted work included — a stash in the main copy, a switch to `release/<version>`, a worktree on the feature's branch, a pop. No commit is invented, so the package's commit conventions are untouched.

**Back to `/hora`: drain first.** Say "drain" in the run. `/hora-fast` opens nothing new, runs every feature in flight to the end of its current gate, merges it, and closes its worktrees. When `git worktree list` shows nothing under `.worktrees/`, every feature is at a gate's entrance and every main working copy is on `release/<version>` — `/hora`'s own starting state.

The foundation needs nothing from `/hora`. It is code on the tip, and a checkpoint run against existing code reconciles rather than creates.

**Skipping the drain fails loudly.** `/hora` builds features that have no worktree as usual, and stops at git the first time it picks one that has — a branch checked out in a worktree cannot be checked out again. The parked worktrees wait until `/hora-fast` runs again.

---

## What it gives up

The serial route catches a regression in the run that caused it, one commit old, and drives every feature's screens before the next feature starts. `/hora-fast` trades both.

| Given up | What stands in its place |
|---|---|
| a regression caught at the checkpoint that caused it | caught at the merge step, attributed by the merged feature's exclusive files |
| a feature's screens driven at its own gate | the static gate run per feature; every screen driven once, at the sweep |
| the person's conversations spread over the version | batched: several features reach checkpoint 9 in the same hour |
| cross-feature findings arriving one at a time | arriving together at the sweep, each opening a retake worktree |
| one working copy and one database per repository | one more per feature in flight |
| a `Conflict:` line `/hora-plan` missed | a merge conflict at the merge step, instead of a mark at planning |

**The trade is written where the next run reads it.** `.hora/tasks/<version>/_fast.md` holds who chose the scheduler, the limit and the foundation; a skipped conversation checkpoint sits on its own line in the feature file; open worktrees are read from git, never copied into a file.

---

## Things worth knowing

- **Four things can be said to it, and none is an argument.** Invoking it chooses the scheduler; "three at a time" sets the limit; "drain" winds it down; "skip 9 for #payroll" skips one conversation checkpoint, once, on record. `/hora-fast drain` typed after the name arrives as the same sentence
- **Checkpoint 1 cannot be skipped while the spec is missing.** Skipping a check gives up a verification; skipping the spec invents one
- **`.worktrees/` is ignored by the hora repository**, like the nested rows. The skill adds the line when it is missing
- **The merge into `main` is never hurried.** It is the one step that leaves the machine, and the momentum a parallel run builds is exactly what that step has to resist
- **It edits no hora file.** Where a rule reads like one in `/hora-build`, it is a pointer to it

---

## Where to go next

| | |
|---|---|
| the skill itself | [`SKILL.md`](../kit/skills/hora-fast/SKILL.md) |
| why the serial route is the default | [`architecture.md`](./architecture.md), "Why it is serial" |
| what each command does | [`commands.md`](./commands.md) |
| the branch rules the worktrees follow | [`commits.md`](../kit/skills/hora/references/commits.md) |
| the gate run and the sweep | [`hora-accept/SKILL.md`](../kit/skills/hora-accept/SKILL.md) |
