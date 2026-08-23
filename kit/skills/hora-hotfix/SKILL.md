---
name: hora-hotfix
description: Fix one urgent defect and ship it through six gates, giving up the acceptance review but writing down everything it gave up. Invoked directly as /hora-hotfix when a live product is broken and the normal /hora route is too slow.
---

# hora-hotfix

**Fix one defect. Ship it. Write down what you skipped.**

Read `../hora/references/structure.md` and `../hora/references/commits.md` first. **This skill is read-only on `specs/`.** It reports a spec problem; it never fixes one.

Runs at the root of the hora repository, like every other hora skill. Every git command runs in the main session.

---

## What this skill is

`/hora-build` takes one **feature** through eighteen checkpoints. This skill takes one **defect** through six gates. **It is not a short version of `/hora-build`.** The unit of work is different, so the gates are different.

| | |
|---|---|
| **What it gives up** | reach — the acceptance review, the browser run, the UX audit, the scenario list, the version's own criteria, `/hora-spec` and `/hora-plan` |
| **What it never gives up** | one failing test, the full unit suites, lint on the files it touched, the git rules, the record |
| **Where the skipped work goes** | `.hora/hotfix/<hotfix-id>.md`, as a written debt. `/hora-plan` turns it back into real work later ("Paying the debt back", below) |
| **What it changes in the normal route** | nothing. `/hora-accept` and the eighteen checkpoints are untouched, so a version's own acceptance is exactly as strict as before |

**This is a lever, and it follows the rule every lever follows** (`../hora/references/structure.md`, "Where a lever lives"). It reduces work. **It may not reduce verification, and it may not reduce what is recorded.** A run that gave up a step pays for it in the record.

---

## The six gates

**A gate has one exit condition. Run them in order.** No gate starts until the one before it is done.

| | Gate | Runs in | Exit condition |
|---|---|---|---|
| **H1** | Admit | the main session, in conversation | this fix has none of the properties that stop a hotfix, or a person chose a way forward. **The one sentence saying what "fixed" means is written** |
| **H2** | Reproduce | an implementer agent | a test exists that fails, and it fails because of this defect |
| **H3** | Fix | an implementer agent | H2's test passes, the change is the smallest one that does that, and lint passes on the files it touched |
| **H4** | Blast radius | the main session | the unit suites pass in every repository — in full, or narrowed against a stated reason — and every step this fix's touched surface forces has run |
| **H5** | Record | the main session | `.hora/hotfix/<hotfix-id>.md` is written, and says what was skipped, which features were touched, and what happens to bad data already written |
| **H6** | Land | the main session | `hotfix/<hotfix-id>` is merged into `main`, and the catch-up is handed to `/hora` |

**The `<hotfix-id>` is a short kebab-case name for the defect** — `session-expiry-blank`, not `fix-1`. Propose one at H1 and get it confirmed.

---

## H1. Admit

**This gate is where most of the value is.** A hotfix that should have been a release is the failure this gate exists to stop.

### Six properties stop a hotfix

```
a schema change that is not backward compatible
    (it drops, renames, narrows, or overwrites something that already exists)
a schema change touching a table that an open release/<version> also has a
    pending migration for
a change to .hora/contracts/<version>/
a dependency added, removed or updated
a new operation, screen or background job
work that does not fit one branch, so you want to cut a branch from
    hotfix/<hotfix-id>   (../hora/references/commits.md)
```

### When one of them holds, do not refuse. Show the choices

**A refusal helps nobody at three in the morning.** Work out a real alternative for **this** defect first, then put the choices to the person (`../hora/references/asking.md` — this is a proposal, not a check).

```
1. Ship a code-only fix now  (recommend this one)
     Stop the exposure, stop the bad write, or add a guard. The destructive
     half waits for the next version. State the actual change you would make
2. Do it as a patch-bumped release/<version>
     The normal /hora route. Slower, but it gets accepted
3. A person does it outside hora            <- offer only for a destructive
     The kit does not pretend it gated this.   schema change
     Record who decided and what they did
```

**Never work out the alternative in general terms.** "There is usually a code-only version" is not usable. Name the file and the change.

**The destructive half never rides on a hotfix.** Option 3 exists so the work is recorded when a person decides to do it anyway. Without it, the same thing happens with no record at all.

### A schema change may ride along if all three hold

```
1. Backward compatible — the code running in production right now still works
                         after the migration is applied
2. No loss            — nothing existing is dropped, renamed, narrowed or
                         overwritten
3. Timed              — the run time and the lock behavior are stated as
                         numbers, against the real row count
```

When all three hold, the migration can be applied first and the code after it, so no deploy has to be atomic.

**Repairing bad rows is not a migration.** A migration file replays in every environment forever. Do the repair as a one-off script a person runs and can undo from a backup, and record it under `data-damage:`.

### Then get the one sentence

**Ask the person: what has to be true for this to count as fixed?** One sentence.

**Never work this out yourself.** It states what the product should do, which only a person may state (`../hora/references/structure.md`, invariant 2). That sentence is this run's whole acceptance criteria.

---

## H2. Reproduce

**Write the test before the fix.** Match the equipped skills covering where a test goes and how it is written, then hand the work to an implementer agent.

**The test must fail, and it must fail for this defect.** A test that fails for any reason proves nothing.

**Some defects cannot be caught by a test.** A performance problem, or a bug that only appears with production data. Then record `reproduced: no` with the reason, and put a measurement in the record instead — the number before and the number after.

---

## H3. Fix

**Make the smallest change that turns H2's test green.** No refactoring, no new abstraction, no tidying up on the way past.

Match the equipped skills covering the code being changed, and hand the work to an implementer agent. Run lint from inside that repository, on the files it touched (`../hora/references/structure.md`, "Where a per-repository command runs").

**If a test fixture needs an explicit row id, clear any stale `bank-id` lock, allocate one prefix, and use it.** Nothing holds that lock across invocations, so one still standing at the start of a run is leftover.

---

## H4. Blast radius

### Always, at every run

**Run the unit suites in full, in every repository, from inside each one.** They are cheap and their failures are exact. They are the only regression net this run has.

**Never weaken a test to make the suite pass.** No test skipped, deleted, loosened or waited out.

### What the touched surface forces

| The fix touched | This cannot be skipped |
|---|---|
| authentication, authorization or a caller filter | a read-only security audit, scoped to the change |
| a shared module, or a conflict-proof file | the full unit suites. `suites: partial` is not allowed here |
| data that gets written to the database | a written answer for the rows the bug already wrote (`data-damage:`) |
| the schema | the four steps below |

```
1. Run the pre-fix code against the new schema, and pass the unit suites
     This is the proof that the migration is backward compatible. Run it;
     do not judge it
2. Write the rollback step, and actually run it on the local stack
3. State the run time and the lock behavior against the real row count
4. Confirm the migration works when applied before the code
```

### Narrowing the suites

**`suites: partial` needs a stated reason, and it is never the default.** It is forbidden where the fix touched a shared module or a conflict-proof file. Record the reason and which suites did not run.

---

## H5. Record

Write `.hora/hotfix/<hotfix-id>.md`. **The record is what pays for everything this run skipped**, so nothing here is optional.

```markdown
# Hotfix — session-expiry-blank

<!-- landed: 2026-08-23 -->
<!-- repositories: myproject-backend, myproject-frontend-employee -->
<!-- touches: attendance, sign-in -->
<!-- reproduced: yes -->
<!-- suites: full -->
<!-- security-audit: run (scoped) | not applicable (touched no auth surface) -->
<!-- data-damage: none -->
<!-- schema: none -->
<!-- deferred: acceptance review, live run, UX audit, scenario list -->
<!-- debt: open -->

## What "fixed" means

<the one sentence from H1>

## What backs this

- <path to the test> — failed before the fix, passes after it
- unit suites: backend 214 passed, frontend-employee 51 passed

## What was skipped

This code has not been accepted. …
```

**A schema change adds four more lines**, and the last one names the destructive half that was left behind:

```markdown
<!-- schema: expand-only (add notes.body_ext, nullable) -->
<!-- schema-rollback: verified — pre-fix code passes the full suites on the new schema -->
<!-- schema-timing: CREATE INDEX on orders (18M rows), online DDL, 4m12s on a staging copy -->
<!-- schema-contract-debt: drop notes.body -->
```

### The verdict word is `landed`, never `passed`

**`/hora-accept` owns the words `passed`, `reach:` and `passed over <n> of <m> features; <k> not accepted`,** and readers match those strings (`../hora-accept/SKILL.md`, "Recording the result"). **A hotfix record uses none of them.** It says `landed`, and nothing downstream can mistake it for an acceptance.

### `touches:` names feature ids, and it is checked with a person

Which features the changed files belong to is a label, so it may be worked out from the code (`../hora/references/structure.md`, invariant 2). **Put the answer up as a check before writing it.** It decides which checkpoints get reopened later, so a wrong one loses the debt.

**Where no feature id fits — a shared file, or code no spec describes — write `touches: none (<what it was>)`.**

---

## H6. Land

```
1. git fetch origin --prune
2. Cut hotfix/<hotfix-id> from origin/main. It takes no opening marker
   (../hora/references/commits.md)
3. Commit the code. Commit .hora/ separately — they are separate repositories
4. Merge into main, in every repository the fix touched
5. Never cut anything from hotfix/<hotfix-id>
6. Hand the catch-up to /hora, which rebases any open release/<version>
   onto the new main (../hora/references/commits.md, "Keeping
   release/<version> current")
```

---

## Paying the debt back

**No new blocking rule is added. The debt turns into work the existing gates already know how to do.**

```
/hora, step 0        reports every .hora/hotfix/*.md whose debt: reads open,
                     by name and with a link

the next /hora-plan  for each id on the touches: line, if that feature has an
                     entry in this version's _plan.md, clear its checkpoint 18
                     back to [ ]. Where it has none, add what the sweep rests
                     on to the ## Acceptance entry. Where a
                     schema-contract-debt line stands, carry it in as work for
                     this version. Then write debt: closed
```

Once checkpoint 18 is `[ ]` again, the ordinary route takes over: `/hora-build` picks the feature up, `/hora-accept` accepts it at its real reach, and the version cannot be done until it passes.

**Raise one `hotfix-debt` question per run** (`blocking: no`, but **fail-loud** — name it on its own line in every report, like `eslint-exception`).

**This is the one question not answered by editing `specs/`.** It is closed by `/hora-plan` writing `debt: closed` in the record, which is also the run that reopens the acceptance. **Where the record carries a `schema-contract-debt:` line, the question stays open until that work is specified too.**

---

## Matching the skills, and reporting

**Name no package skill anywhere in this file, and none may be added** (`../hora/references/structure.md`, "No hora file ever names one of those skills"). State the work, match the equipped descriptions at run time, and write the names you matched into the record.

**Where nothing equipped covers a step, say so and carry on.** Record the gap by the work that went uncovered. Never guess a substitute.

The closing report says, in the language of whoever ran it:

```
what was broken, and the one sentence from H1
what backs the fix — the test, and the suite counts
what was skipped, and which features carry the debt
whether a person chose one of H1's options, and which
every question raised, by id, with a link, never a count
    (../hora/references/structure.md, "Citing a question in a report")
git status for every repository the fix touched
```

**Say plainly that this code has not been accepted.** A report that ends at "shipped" is what makes a debt disappear.

---

## References

| File | Content |
|---|---|
| `../hora/references/structure.md` | the layout, the invariants, the division of labor, where a lever lives |
| `../hora/references/commits.md` | `hotfix/<hotfix-id>`, and how an open `release/<version>` catches up |
| `../hora/references/asking.md` | a check, a proposal, a question, and the question tool |
| `../hora-accept/SKILL.md` | the verdict grammar this skill must not use |
| `../hora-plan/SKILL.md` | the question categories, and where the debt is paid back |
