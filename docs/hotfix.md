<!-- 日本語版: [hotfix.ja.md](./hotfix.ja.md) — 片方を直したら、同じコミットでもう片方も直してください -->

# The emergency route

Something is broken in production and you have two hours. The normal route — write the spec, plan, eighteen checkpoints, acceptance — is the right route, and it is far too slow for this.

`/hora-hotfix` is the other one. **It fixes one defect, ships it, and writes down everything it skipped**, so the skipped part comes back as real work later instead of quietly disappearing.

```
/hora          one feature   →  18 checkpoints  →  accepted
/hora-hotfix   one defect    →  6 gates         →  landed, with a debt
```

**`/hora` never starts it.** Whether something is an emergency is a person's call, so you type `/hora-hotfix` yourself.

---

## Contents

- [What it gives up, and what it does not](#what-it-gives-up-and-what-it-does-not)
- [The six gates](#the-six-gates)
- [When it says no, it shows you the choices](#when-it-says-no-it-shows-you-the-choices)
- [Schema changes](#schema-changes)
- [What the record says](#what-the-record-says)
- [The debt comes back as ordinary work](#the-debt-comes-back-as-ordinary-work)
- [Things worth knowing](#things-worth-knowing)
- [Where to go next](#where-to-go-next)

---

## What it gives up, and what it does not

| | |
|---|---|
| **Gives up** | the acceptance review, the browser run, the UX audit, the scenario list, the version's own acceptance criteria, `/hora-spec`, `/hora-plan` |
| **Keeps** | one failing test, the full unit suites in every repository, lint on the files it touched, the git rules, the record |

**The unit suites are not the expensive part.** They run in minutes and they are the only thing standing between this fix and a regression somewhere else, so they stay. What actually costs hours is the review, and that is what gets deferred.

**The one test is what makes the deferral honest.** Without a test that failed before the fix, "the unit tests pass" says nothing at all about the bug you were fixing.

---

## The six gates

```
H1  Admit          can this be a hotfix at all, and what does "fixed" mean?
H2  Reproduce      a test that fails, and fails for this defect
H3  Fix            the smallest change that turns it green
H4  Blast radius   the unit suites, plus whatever the touched surface forces
H5  Record         .hora/hotfix/<hotfix-id>.md
H6  Land           merge into main, hand the catch-up to /hora
```

Each gate has one exit condition, and none starts until the one before it is done.

### H1 — Admit

Two things happen here.

**First, is this a hotfix at all?** Six properties say no:

- a schema change that is not backward compatible — it drops, renames, narrows or overwrites something
- a schema change touching a table an open `release/<version>` also has a pending migration for
- a change to a contract another repository is building against
- a dependency added, removed or updated
- a new operation, screen or background job
- work that does not fit one branch

**Second, what does "fixed" mean?** You write one sentence. Nothing else is allowed to write it — it says what the product should do, and that is yours. **That sentence is this run's entire acceptance criteria.**

### H2 — Reproduce

A test is written that **fails, and fails because of this defect**. It comes before the fix, not after.

Some defects cannot be caught by a test — a slow query, or a bug that only appears with production data. Then the record says `reproduced: no` with the reason, and carries a measurement instead: the number before, the number after.

### H3 — Fix

**The smallest change that turns H2's test green.** No refactoring, no tidying up along the way.

### H4 — Blast radius

The full unit suites, in every repository. Then whatever the fix touched forces:

| The fix touched | This cannot be skipped |
|---|---|
| authentication, authorization, a caller filter | a security audit scoped to the change |
| shared code | the full suites — they may not be narrowed here |
| data written to the database | a written answer for the rows the bug already wrote |
| the schema | four extra steps (below) |

### H5 — Record

`.hora/hotfix/<hotfix-id>.md` is written. **This is what pays for everything the run skipped**, so nothing in it is optional. See "What the record says", below.

### H6 — Land

`hotfix/<hotfix-id>` is cut from `main`, merged back into `main`, and **nothing is ever cut from it**. Then `/hora` rebases any open `release/<version>` onto the new `main`.

![The git model: main, release/<version>, and the branches cut from it](./images/git-model.svg)

---

## When it says no, it shows you the choices

**It does not refuse.** A refusal helps nobody at three in the morning. It works out a real alternative **for your defect** — naming the actual file and the actual change — and then puts three options to you:

```
1. Ship a code-only fix now  (the usual answer)
     Stop the exposure, stop the bad write, or add a guard.
     The destructive half waits for the next version

2. Do it as a patch-bumped release/<version>
     The normal route. Slower, but it gets accepted

3. A person does it outside hora     (destructive schema changes only)
     The kit does not pretend it gated this.
     It records who decided, and what they did
```

**It never picks for you.**

Option 3 exists on purpose. A gate with no way through is a gate people walk around, and then nothing is recorded at all.

---

## Schema changes

The question is not "does this need a migration". It is **"can the code be rolled back without rolling back the database"**. If yes, the migration stops being coupled to the release, and it can ride along.

**All three must hold:**

1. **Backward compatible** — the code running in production right now still works after the migration
2. **No loss** — nothing existing is dropped, renamed, narrowed or overwritten
3. **Timed** — the run time and the lock behavior are stated as numbers, against the real row count

Condition 3 is not paperwork. A `CREATE INDEX` that locks writes for an hour is not a two-hour fix.

When all three hold, the migration goes out first and the code follows, so no deploy has to be atomic.

| What is happening | Can it ride along? |
|---|---|
| a column is too small and writes are failing | **yes** — widen it |
| a missing index is melting the database | **yes** — online DDL, with the lock time measured |
| duplicate rows are piling up with no unique constraint | **half** — ship the code guard now; the constraint needs the duplicates cleaned up first |
| a column was named wrong | **half** — add the new column and write both now; drop the old one later |
| a leaked column has to go | **half** — stop the exposure now; the drop is planned work |
| production data is corrupted | **no** — this is not a migration at all |

**The destructive half never rides on a hotfix.** In almost every case there is a code-only equivalent that stops the bleeding now.

**Repairing bad rows is not a migration.** A migration file replays in every environment forever. Do the repair as a one-off script somebody runs and can undo from a backup.

---

## What the record says

```markdown
# Hotfix — session-expiry-blank

<!-- landed: 2026-08-23 -->
<!-- touches: attendance, sign-in -->
<!-- reproduced: yes -->
<!-- suites: full -->
<!-- data-damage: none -->
<!-- deferred: acceptance review, live run, UX audit, scenario list -->
<!-- debt: open -->

## What "fixed" means
<your one sentence from H1>

## What backs this
- <the test> — failed before the fix, passes after it
- unit suites: backend 214 passed, frontend-employee 51 passed

## What was skipped
This code has not been accepted. …
```

**Its verdict word is `landed`, never `passed`.** `passed` belongs to `/hora-accept`, and a hotfix record must never be mistaken for an acceptance.

**`touches:` names the features the changed files belong to.** The run works this out and shows it to you before writing it, because it decides which acceptance gets reopened later.

---

## The debt comes back as ordinary work

Nothing new blocks anything. **The debt turns into work the existing gates already know how to do.**

```
/hora, next run       reports every open debt, by name, with a link

/hora-plan, next run  for each feature on the touches: line, clears its
                      checkpoint 18 back to [ ] — and its entry in the plan
                      with it. Then writes debt: closed
```

From there the normal route takes over. `/hora-build` picks the feature up, `/hora-accept` accepts it at its real reach, and **the version cannot be finished until it passes.**

**So a hotfix is not free.** Using one adds work to the next version — which is what stops it from becoming the route everybody takes.

---

## Things worth knowing

- **One hotfix at a time.** Two heading for `main` together make the catch-up much harder to reason about
- **`/hora-hotfix` never writes `specs/`.** Like every skill but `/hora-spec` and `/hora-plan`, it reports a spec problem instead of fixing one
- **Narrowing the unit suites needs a stated reason**, and is not allowed where the fix touched shared code
- **A hotfix PR title containing a version in backticks will tag `main`** — the release workflow reads the title. Keep the version out of it

---

## Where to go next

| | |
|---|---|
| the gates in full, as the skill states them | [`SKILL.md`](../kit/skills/hora-hotfix/SKILL.md) |
| what each command does | [`commands.md`](./commands.md) |
| the branch rules, and how a `release/<version>` catches up | [`commits.md`](../kit/skills/hora/references/commits.md) |
| why the whole thing is shaped this way | [`architecture.md`](./architecture.md) |
