---
name: hora-progress
description: The rules behind the one line hora's progress takes — a checkpoint, a stage, a feature or the version passed, a verdict that sent the run back, and a wait for a person. /hora-build, /hora-accept, /hora-spec and the asking rules write these lines themselves, beside what each line reports, and read this skill wherever a line is in doubt — never invoked by a person. The questions themselves, stop displays and the closing report are not this skill's.
user-invocable: false
---

# hora-progress

**A progress line is written in the same reply that records what it reports** — a checkpoint's box, a stage's box, an acceptance record, a question put to a person. Each skill that records one carries the line's shape beside the step that records it, so the shape is in front of the run at the moment the line is due — the fortieth checkpoint as surely as the first — whether or not this skill is read again. **This skill holds the rules behind those shapes**, and is read wherever one of them is in doubt.

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
- **A check, a proposal, a question and a section shown for approval keep the form `../hora/references/asking.md` gives them.** None of them is progress; the wait before one is a `🤔` line ("Waiting for a person", below)

**Two passes stand above a checkpoint, and each takes a mark of its own in place of `✅️`.**

```
🎯 #attendance accepted | checkpoint 18 passed: every criterion holds, driven live | -> #payroll
🏁 1.0.0 swept | every done feature and 4 of 4 version criteria hold | -> merge release/1.0.0
```

- **`🎯` is checkpoint 18 passed: a feature accepted.** The run moves to the next feature
- **`🏁` is the sweep passed: the version reached its goal.** It is written once the newest `_sweep.md` block counts as a pass (`../hora/references/done-criteria.md`, "When a version is done")
- **`✅️`, `🎯` and `🏁` are three levels**, a checkpoint, a feature and a version. Each pass takes the mark of its level and no other

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

---

## Waiting for a person

**Where the run stops for a person's answer, it says so in one line opening with `🤔`, right before the check, the proposal or the question.**

```
🤔 checkpoint 2 waiting | whether a manager may edit a closed month | -> checkpoint 3 once answered
🤔 stage 3 waiting | the expected number of staff in two years | -> stage 4 once answered
```

- **The line names what is asked, never the answer it hopes for.** The asking itself keeps the form `../hora/references/asking.md` gives it
- **A run that asks nothing writes no `🤔`.** A decision taken without asking is not a wait
