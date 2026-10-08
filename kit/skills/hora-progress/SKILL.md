---
name: hora-progress
description: Report that a checkpoint or a stage passed, or that a verdict sent the run back, in the one line hora's progress takes. Invoked by /hora-build each time a checkpoint passes or is sent back, by /hora-accept each time a finding sends the run back, and by /hora-spec each time a stage passes or is sent back — never by a person. Questions, proposals, stop displays and the closing report are not this skill's.
user-invocable: false
---

# hora-progress

**Invoke this skill each time a checkpoint or a stage passes, and each time a verdict sends the run back, and write the line it gives.** The shape lives here rather than in a file read at the start of the run, so it is read at the moment the line is written — the fortieth checkpoint as surely as the first.

---

## [wing] How to report progress

**One line, in this shape.**

```
✅️ <checkpoint or stage> passed | <the one fact it established> | <the blocker or decision, or -> what comes next>
```

```
✅️ checkpoint 3 passed | the attendance model and its migration hold | -> checkpoint 4, the resolvers
✅️ stage 2 passed | 4 use cases in scope, 3 deferred with a seam | -> stage 3
```

- **The line opens with `✅️` and the checkpoint or stage it reports**, so a reader scrolling back finds every pass by its mark and its first words
- **`✅️` marks a pass and nothing else.** A line between two progress lines never carries it
- **Never restate what the feature file or `_stages.md` already records.** The line replaces narration only
- **A check, a proposal, a question and a section shown for approval keep the form `../hora/references/asking.md` gives them.** None of them is progress

**A verdict that sends the run back is one line too, opening with `⏳️ [n]`.**

```
⏳️ [<n>] <feature> <what sent it back> sent back to checkpoint <k> | <the findings by number and severity, or the shortfall> | -> <what comes next>
⏳️ [<n>] stage <s> sent back to stage <t> | <the shortfall> | -> <what comes next>
```

```
⏳️ [3] #attendance checkpoint 8 sent back to checkpoint 6 | N5, N6 (MEDIUM) | -> a per-account limit on sign-in
⏳️ [1] #payroll checkpoint 18 sent back to checkpoint 15 | the month total ignores a reopened month | -> the summary screen
⏳️ [1] stage 7 sent back to stage 1 | a use case nobody stated: reopening a locked month | -> stage 1
```

- **Every verdict that re-enters a checkpoint or a stage takes it**, whatever gave the verdict: a verifier's `unmet`, the audit's findings at checkpoint 8, a failed gate at 2, 9, 11 or 18, a finding at the version sweep, and a stage that finds a shortfall an earlier stage owns
- **`n` counts the send-backs one checkpoint has made on one feature**, this one included. Checkpoint 8's audits on `#attendance` count `[1]`, `[2]`, `[3]`; a verifier's `unmet` at checkpoint 6 on the same feature counts on its own. A stage counts its send-backs the same way, per stage
- **A retry that re-enters nothing prints nothing.** A lint rerun or a suite fixed inside the checkpoint is a step toward the line, said as one below

---

## Between two progress lines

**What happens inside a checkpoint is not reported as it happens.** An implementer returning, a lint run, a test suite, a verifier awaited — each is a step toward the line, not a line of its own. Written as prose in the voice a pass is written in, they bury the pass, and nobody can find afterwards which checkpoints passed.

**Where something has to be said while the work goes on, it is one line, indented, opening with `📍`:**

```
  📍 checkpoint 6 | running the backend suite, second attempt
```

- **At most one such line for each step of the checkpoint** — implementing, lint, the suite, verifying. A step that needs nothing said says nothing
- **It never says that anything passed.** "The fix holds, so checkpoint 3 passes" is a progress line, and is written as one, through this skill
- **A pause in the output is not a reason to write.** A request to report how the work is going is answered with one such line, or with the last progress line again, never with a paragraph
