---
name: flatten
description: "Repository-specific build convention: everything under kit/ is copied into dist/ whole and unchanged, kit/ holds one directory per thing .claude/ accepts (agents/, skills/ today), the test suite checks that dist/ mirrors kit/ byte for byte and that each name: matches its folder, and dist/ — not kit/ — is both what this package publishes and what its installer mirrors into a consuming repository. Use when rebuilding the dist/ output, or when adding, renaming or placing anything under kit/."
---

# Flatten

`kit/` is what this repository's maintainers author. `dist/` is what npm publishes. The build is the only thing that connects them, and it runs from `prepack`, so every publish rebuilds `dist/` from the current `kit/`.

`dist/` is read twice over: npm packs it, and `lib/equip/` mirrors it into a consuming repository's `.claude/` (see the README). So what lands under `kit/` does not merely ship — it is written into someone else's repository.

## Why this skill is called `flatten`

**Nothing is flattened here.** `kit/` is already the shape consuming repositories install, and this build copies it through unchanged.

The name is borrowed from `@openreachtech/hora-skills`, whose build genuinely does flatten — its `kit/skills/` is grouped into `_core/`, `backend/` and `frontend/` domain directories, and the build drops that level to produce `dist/skills/`. Both repositories distribute a skill set, both build `kit/` into `dist/` under `prepack`, and both put that build behind a skill of this name. **One name across the two repositories means one thing to learn**: whichever you open, `flatten` is where the publish payload is produced, and the answer to "what does this repository do to its skills before shipping them?" is on this page.

Here the answer is "nothing at all". That is a fact about today's `kit/`, not a promise — the seam exists so a transformation can be added on one side without the other side's reader having to relearn where to look.

## Source layout

**Everything placed under `kit/` is published, and then installed.** The build copies whatever it finds, and the installer carries each directory of `dist/` into the directory of the same name under `.claude/`. So the layout below describes what `kit/` holds today; it is not a rule that would stop another directory from being added. **Anything `.claude/` accepts, `kit/` may carry** — `commands/`, `hooks/`, `output-styles/` — and neither the build nor the installer needs a change to take it.

`kit/` currently holds two payload directories:

| Payload directory | Installs to | What it holds |
|---|---|---|
| `agents/` | `.claude/agents/` | One Markdown file per agent |
| `skills/` | `.claude/skills/` | One directory per skill, each with a `SKILL.md` |

### Nothing sits at the top level but a directory

**Never place a file directly under `kit/`.** A payload directory is merged into its counterpart, entry by entry, so an installed skill never disturbs one the consuming repository authored. A file at the top level has no such unit: it would land at `.claude/`'s own root, where the names are already taken by files that repository owns.

`settings.json` and `settings.local.json` are the concrete case. Both are the consuming repository's own — permissions and hooks it decided on — and mirroring either would overwrite that decision wholesale. Project-level configuration belongs to the boilerplate the project was created from, never to this package. **This is a rule about what may be authored here, not a filter in the installer**: the installer mirrors `dist/` as it finds it.

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

**The build checks nothing.** It has no idea what a skill is; it copies a directory. The test suite (`tests/__tests__/kit/build.js`) runs the build and then asserts three things: that `dist/` holds exactly the paths `kit/` holds, that every one of those files matches byte for byte, and that every skill and agent declares a `name:` equal to its folder or file name. CI runs `npm test` on every pull request, so a break there is caught at the merge gate rather than at pack time.

What no test asserts is what `kit/` may hold. Anything added at its top level — a settings file, a scratch note — passes the suite, ships, and is written into every repository that installs this package, because copying `kit/` whole is the point rather than an oversight. Keeping the payload to what belongs in it is a review question, not an automated one.

That division is deliberate for now: the build stays trivial while `kit/` needs no transformation, and the checking lives where it can grow without making the publish path conditional.

## Adding to the kit

Create the folder under `kit/skills/` — or the file under `kit/agents/` — and declare the same string as `name:`. There is no index to update and no manifest to register in: the build reads the directory.

`dist/` is gitignored and never committed. To see what a publish would contain, run the build and then `npm pack --dry-run`.
