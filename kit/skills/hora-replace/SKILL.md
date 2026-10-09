---
name: hora-replace
description: Describe a running application as it is, from its code alone, so a new system can be specified to replace it. Reads the reference code beside the kit, writes an as-is specification in several passes that each start from something different, and proposes a scope for a person to decide. Invoked directly as /hora-replace before /hora-spec when a system is to be replaced, not adopted. Writing the new system's spec belongs to /hora-spec.
---

# hora-replace

**Describe what runs. Check the description. Hand it over for a person to scope.**

Read `../hora/references/structure.md` and `../hora/references/asking.md` first. **This skill is read-only on `specs/` and on the reference code.** It writes under `.hora/replace/<version>/` and nowhere else.

Runs at the root of the hora repository, like every other hora skill. It touches git only to read.

---

## What this skill is

`/hora-spec` specifies a product in conversation, and stage 0 reads what exists **breadth first, in one pass** (`../hora-spec/references/investigation.md`, the section on the stage 0 inventory). That is enough to adopt a product in place. **It is not enough to replace one**, because a replacement is specified from the old system's behavior, and the new system silently loses every feature the first reading missed.

| | |
|---|---|
| **What it reads** | the reference code in `reference-backend/` and `reference-frontend/` (or any directory the kit's exclusion lists already cover), and every document inside them |
| **What it writes** | `.hora/replace/<version>/reference.md`, `as-is-spec.md` and `scope.md` |
| **What it gives a person** | an overall description of the old system, read more than once, and a proposed scope |
| **What it never does** | decide scope, conclude `Authority`, `Treatment` or `built:`, write `specs/`, edit the reference code |
| **Where it meets `/hora-spec`** | the drop-off directories `annex/` and `request/`, which stage 0 already reads. **A person places the files**, and stage 0 confirms each placement as a check (`../hora-spec/references/investigation.md`, "The three drop-off directories") |

**`/hora` never starts this skill.** Whether a system is to be replaced is a person's call, and it comes before any spec of the new system exists.

---

## The five gates

**A gate has one exit condition. Run them in order.** No gate starts until the one before it is done.

| | Gate | Runs in | Exit condition |
|---|---|---|---|
| **R1** | Place | the main session | the reference code is read-only, ignored by git and by lint, and its commit shas are recorded |
| **R2** | Read | a separate agent | `as-is-spec.md` holds the capabilities of the old system, found area by area |
| **R3** | Verify | a separate agent per pass | at least two more passes have run, each from a different starting point, and the passes are merged into one overall specification |
| **R4** | Propose | the main session, in conversation | a scope proposal was shown in full, and the approved text is written to `scope.md` |
| **R5** | Hand over | the main session | the person has been told exactly which file goes where, and what `/hora-spec` will ask |

**The version is the one stage 0 will run for.** Take the directory under `specs/` whose name is a semver version and that has no `spec.md` yet, or `1.0.0` on a first run, and say which one you took.

---

## R1. Place

**Check each of these and report the result. Repair none of them.**

| Check | How | If it fails |
|---|---|---|
| the reference directories exist | `ls` at the root | stop and say what is expected |
| both exclusion lists cover them | `git check-ignore` on a file inside each (or `git status --ignored` where that is refused), and the root lint configuration's ignore patterns | stop. Name the directory a pattern covers (`reference-backend/`, `reference-frontend/`), because a name such as `reference/` matches neither list |
| they are read-only | `find <directory> -type f -perm -u+w` prints nothing. **A write test is never made.** | report how many files print, ask the person to run `chmod -R a-w` on the directory, and carry on |
| the shas are known | `git -C` on the source clone, or the person's statement. **A directory with no `.git` has no sha to read** | ask for the shas, and record "as stated by <person>" |

**A clean lint run inside a reference directory proves nothing.** The directory is ignored, so lint exits 0 with a warning that the file was ignored, and the same exit code means "all good" elsewhere. Never cite it as evidence.

**Write `.hora/replace/<version>/reference.md`.** It records, for each reference directory, its name, its sha, where the sha came from, and the result of the checks above. A person copies this file into `annex/`, where stage 0 reads it.

**The reference directories are not rows of the repository layout.** `/hora-setup` would try to set a row up. They are read, never declared.

---

## R2. Read

**Say what the pass costs before it starts, and get a yes.** State the size of each reference (files and lines, tests excluded) and that R2 and R3 each read the code in full. In one measured run, two repositories of about 72,000 lines used about 810,000 agent tokens across both gates.

**Read area by area, and finish one area before the next.** An area is read from its code, never from file names.

```
the screens, layouts and what guards them
the operation surface: every call a screen can make and everything the
    backend answers, with what each one does and who may make it
the data, and what each group of tables is for
background and scheduled work: processes, schedules, queues, job handlers,
    and what starts each of them
the external services the system talks to
deployment, operations and CI
the documents and diagrams that already exist
```

**Write `.hora/replace/<version>/as-is-spec.md`**:

- a short summary of what the system is, who uses it, and its architecture (the parts that run and how they connect)
- a table of capabilities, one row each. **A capability is what a person using or operating the system would name**, never a table, a class or a dependency. Columns: an id (`P1-01`), the capability, what it does in a sentence or two including the rules read (who may do it, what is checked, what it triggers), its kind (screen, request path, background, operation, integration, silent or dead, frontend and backend disagree), and its evidence as paths
- **Cross-checks**: what a screen calls that the backend does not offer, what the backend offers that no screen uses, and anything present and apparently unused
- **Not settled**: what the code alone cannot decide

**Write a behavior read as a defect as a finding with its evidence. Never fix it, and never drop it from the table.** Scope decides what happens to it.

---

## R3. Verify

**One reading is never the description.** Repeating the same reading finds the same gaps again, so each pass starts from a point the previous one never used, and each runs in an agent that has not seen the earlier passes' reasoning.

| Pass | Starts from | What it adds |
|---|---|---|
| **2. Lists** | lists made by a command, never by memory: every top-level entry of each reference, every process, schedule and queue, every call a screen makes, every call the backend answers, every screen, every deploy and CI file, every document | each name missing from the spec is looked up, then either added as a row or named as deliberately left (a lint configuration, a lock file) |
| **3. Journeys** | the screens a person can reach, traced down through the operation each one calls to the data and the background work it touches | every step is compared with the row that describes it, and **every claim of a defect, a gap or a missing piece in the spec is audited: confirmed, refuted or unverified, each with the file and line that settles it** |

**Each pass writes its own file**, `pass-2.md` and `pass-3.md` beside `as-is-spec.md`, and the main session merges them. Two agents never write one file. A pass proposes corrections to a row with a note, and never rewrites a row it did not audit.

**Merge the passes into one document.** `as-is-spec.md` ends with a section "Verification": how many passes ran, what each started from, the corrections made, and what the audit found that no row described.

**Every verdict comes with a count of what was checked, copied from the output of the command that produced it.** "The lists were checked" is not a result. "212 of 215 names appear, three are configuration files left deliberately" is.

---

## R4. Propose

**The scope is a person's decision** (`../hora-spec/SKILL.md`, the principle that the requester decides what a release carries). **What this skill writes here is a proposal, and it labels it so.**

Show the proposal in full, in conversation, in these groups:

```
Move as it is          capabilities to carry over unchanged
Drop (confirm each)    capabilities to leave behind, each with the reason
Improve: security      what the audit found about who may do what
Improve: experience    defects and gaps in what a person sees and does
Decide                 behavior nothing provides today, and what it would take
Not in scope           what is left out unless somebody says otherwise
```

**Ask one thing at a time where the answer changes what is built** (`../hora/references/asking.md`). **Approval is per group and never blanket.** Write the approved text, and only that, to `.hora/replace/<version>/scope.md`, headed with who approved it, and marked as a statement of what a requester wants, not a requirement.

---

## R5. Hand over

**Tell the person, in these words or close to them:**

```
1. copy .hora/replace/<version>/reference.md and as-is-spec.md
   into specs/<version>/annex/
2. copy .hora/replace/<version>/scope.md into specs/<version>/request/
3. run /hora-spec
```

**Then say what `/hora-spec` will ask, and that this skill answered none of it.** Stage 1 asks `Treatment`, `Authority` and `Baseline` with no option recommended, and asks whether the new repositories start empty or take the reference in place (`../hora/references/spec-format.md`, "5. Existing assets").

**Say one thing about `Authority`.** The annotation is one per feature section. Where the scope marks a behavior to be fixed or improved inside a feature, stage 1 splits that behavior into a section of its own. A scope with many improvements splits many features.

---

## What this skill never does

- **write `specs/`**, or place a file in `annex/` or `request/`. A person places them
- **edit, tidy or annotate the reference code**, or run it, install its dependencies or use the network
- **decide scope**, or let a proposal stand as a requirement
- **conclude `Authority`, `Treatment` or `built:`**
- **cite a clean lint run, or a clean test run, as evidence about the reference**
- **commit.** `.hora/replace/` is a record, and a person decides what to keep

---

## Re-entry

**Resume at the first gate whose exit condition is not met.** If the shas in `reference.md` differ from the reference code as it now stands, say so, and redo R2 and R3 for what changed. **A description of a different version of the code is not the description.**

---

## References

| File | Content |
|---|---|
| `../hora/references/structure.md` | **the layout and the ownership rules** this skill stands on |
| `../hora/references/asking.md` | **a check, a proposal or a question** |
| `../hora/references/spec-format.md` | "5. Existing assets", where `Treatment`, `Authority` and `Baseline` are declared, and the drop-off directories |
| `../hora-spec/references/investigation.md` | stage 0, and where a document has to sit before it is read |
