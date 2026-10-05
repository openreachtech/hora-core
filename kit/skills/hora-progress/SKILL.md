---
name: hora-progress
description: Report that a checkpoint or a stage passed, in the one line hora's progress takes. Invoked by /hora-build each time a checkpoint passes and by /hora-spec each time a stage does, the moment its box is written — never by a person. Questions, proposals, stop displays and the closing report are not this skill's.
user-invocable: false
---

# hora-progress

**Invoke this skill each time a checkpoint or a stage passes, and write the line it gives.** The shape lives here rather than in a file read at the start of the run, so it is read at the moment the line is written — the fortieth checkpoint as surely as the first.

---

## [wing] How to report progress

**One line, in this shape.**

```
<checkpoint or stage> passed | <the one fact it established> | <the blocker or decision, or -> what comes next>
```

```
checkpoint 3 passed | the attendance model and its migration hold | -> checkpoint 4, the resolvers
stage 2 passed | 4 use cases in scope, 3 deferred with a seam | -> stage 3
```

- **The line opens with the checkpoint or stage it reports**, so a reader scrolling back finds every pass by its first words
- **Never restate what the feature file or `_stages.md` already records.** The line replaces narration only
- **A check, a proposal, a question and a section shown for approval keep the form `../hora/references/asking.md` gives them.** None of them is progress
