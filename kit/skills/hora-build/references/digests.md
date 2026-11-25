# The digest each matched skill is read through

**Step 3 of `../SKILL.md` runs this, once the checkpoint's work is matched against the equipped skills.**

**A matched skill can run to thousands of lines, and it stays resident in the agent's context for every turn.** A checkpoint's cost is close to that resident size multiplied by its turn count. `.hora/digests/<skill-name>.md` is the short form.

```
1. For each matched skill, find the record under .hora/ that names it. There is
   one record per equipped skills package, the file is named after the package,
   and its version: is the version of that package now installed
2. For each matched skill, use .hora/digests/<skill-name>.md while its
   header names that package and that version
3. For the rest, start hora-digester — one agent per skill, all in one
   message — and use the files they write
4. Hand those paths to the agent, alongside the skill names
```

**Nothing matched, nothing digested.** When the match came back empty, this step is skipped whole — there is no version to read and no digest to take — and the checkpoint runs on what it stated itself.

**The package and version in the header are what keep a digest honest.** A digest holds only while it names what it came from, so updating one package leaves that package's digests to be rewritten before they are read again — and leaves the others alone.

**A digest names the skill it came from, and the agent reads that skill whenever a question stays open** (`../../../agents/hora-digester.md`), so a convention a digest states too thinly costs one read.

**Record the version alongside the names**, so the checkpoint stays re-derivable after the next package update.

**A verifier at step 9 of `../SKILL.md` is handed the same digests its implementer had.** Judging a checkpoint against a fuller text than the implementer was given fails work for a convention nobody handed it.

**Checkpoint 8's audit skills are invoked in full, and a digest has no part in it.** A step whose skill *is* the criteria runs that skill whole (`../../hora/references/structure.md`, "How the match is made").

**Once per run, report the orphan digests, and never delete them.** An orphan is a `.hora/digests/<skill-name>.md` with no `.claude/skills/<skill-name>/` beside it, left by a renamed or removed skill, and a reader listing the directory takes it for an equipped one. Report each path to the user and leave the file, because whether it goes is the user's call.
