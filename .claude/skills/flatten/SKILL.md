---
name: flatten
description: "Repository-specific build convention: kit/ holds exactly two payload directories (agents/, skills/), the build copies kit/ into dist/ whole and unchanged, the test suite is what checks the layout, and dist/ — not kit/ — is what this package publishes. Use when rebuilding the dist/ output, or when adding, renaming or placing anything under kit/."
---

# Flatten

`kit/` is what this repository's maintainers author. `dist/` is what npm publishes. The build is the only thing that connects them, and it runs from `prepack`, so every publish rebuilds `dist/` from the current `kit/`.

## Why this skill is called `flatten`

**Nothing is flattened here.** `kit/` is already the shape consuming repositories install, and this build copies it through unchanged.

The name is borrowed from `@openreachtech/hora-skills`, whose build genuinely does flatten — its `kit/skills/` is grouped into `_core/`, `backend/` and `frontend/` domain directories, and the build drops that level to produce `dist/skills/`. Both repositories distribute a skill set, both build `kit/` into `dist/` under `prepack`, and both put that build behind a skill of this name. **One name across the two repositories means one thing to learn**: whichever you open, `flatten` is where the publish payload is produced, and the answer to "what does this repository do to its skills before shipping them?" is on this page.

Here the answer is "nothing at all". That is a fact about today's `kit/`, not a promise — the seam exists so a transformation can be added on one side without the other side's reader having to relearn where to look.

## Source layout

**This section is a convention, not something the build enforces.** The build copies whatever it finds; the test suite is what fails when the layout below stops holding.

`kit/` contains exactly two directories, and nothing else:

| Payload directory | Installs to | What it holds |
|---|---|---|
| `agents/` | `.claude/agents/` | One Markdown file per agent |
| `skills/` | `.claude/skills/` | One directory per skill, each with a `SKILL.md` |

Every skill is at exactly this depth:

```
kit/skills/<name>/SKILL.md
```

A skill folder may hold its own subdirectories (`references/`, `scripts/`), but no `SKILL.md` below its top level — those subdirectories are the skill's own files, never more skills. There are no grouping directories under `kit/skills/`: the list is flat, exactly as it is installed.

### The folder name is the skill's name

A skill folder's name is the skill's `name:`, and the folder name it gets under `dist/skills/`, all one string:

```
kit/skills/hora-plan/   name: hora-plan   →   dist/skills/hora-plan/
```

The same holds for agents, with the file name standing in for the folder name:

```
kit/agents/hora-verifier.md   name: hora-verifier   →   dist/agents/hora-verifier.md
```

### No prefix rule

Unlike `hora-skills`, this repository enforces no prefix. Its skills are named `hora-*` by convention because they are Hora Kit's own commands, but that is a convention, not a checked rule.

`bank-id` is the one name outside it, deliberately: it is to be moved into `hora-skills` as `hb-bank-id` later, and renaming it here first would only be undone by that move.

## The build

```
node .claude/skills/flatten/scripts/build.js
```

It deletes `dist/` outright and copies `kit/` in whole: `dist/` is a function of the current `kit/` alone. Without the deletion, a skill renamed or removed at the source would keep its stale folder in `dist/` indefinitely, and every publish would go on shipping a skill that no longer exists — a failure invisible in a diff, because nothing about the stale folder changes.

Everything under `kit/` is copied **byte for byte**, whatever it is. Nothing is filtered, and nothing is rewritten: no `name:` is adjusted, no source note is appended, no path is rewritten. A file that differs between `kit/` and `dist/`, or that exists in one and not the other, is a bug in this script.

**The build checks nothing.** It has no idea what a skill is; it copies a directory. The layout above is a convention, and what holds the convention up is the test suite (`tests/__tests__/kit/build.js`), which runs the build and then asserts that `dist/` matches `kit/` file for file and byte for byte, and that every skill and agent declares a `name:` equal to its folder or file name. CI runs `npm test` on every pull request, so a break is caught at the merge gate rather than at pack time.

That division is deliberate for now: the build stays trivial while `kit/` needs no transformation, and the checking lives where it can grow without making the publish path conditional.

## Adding to the kit

Create the folder under `kit/skills/` — or the file under `kit/agents/` — and declare the same string as `name:`. There is no index to update and no manifest to register in: the build reads the directory.

`dist/` is gitignored and never committed. To see what a publish would contain, run the build and then `npm pack --dry-run`.
