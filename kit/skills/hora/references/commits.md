# Branches and commits

Every hora skill that touches git follows this file. **Every git operation runs in the main session** — `/hora`'s own hands, or a skill it invoked. The agents they start never touch git.

`git log .hora/` is the history of what ran, and the checkboxes hold what is done. **That is what the commits are for.**

---

## Where work lands

- **Never commit straight to `main`.** Work on `release/<version>` — the version whose `spec.md` is currently being worked on (`main-guard.yml` restricts PRs into main to `release/*`, `hotfix/*`, `dev` and `env`). This applies to the hora repository and to every declared row, under the same branch name
- **A feature's implementation commits go on a `feature/<feature-id>` branch first** (below), cut from `release/<version>`'s tip in each repository that feature touches. `install`/`update`/`retake` commit to `release/<version>` directly
- **Create the branch when it does not exist yet.** `git fetch origin --prune`, then branch from `origin/main` if `release/<version>` is still missing. For a row `/hora-setup` just set up with a fresh `git init`, branch from the current `HEAD` instead
- **The marker opening a `release/<version>` branch is `Release <version>`** — the version whose `spec.md` is being worked on, matching the branch name, never a version taken from anywhere else
- **`hotfix/xxxx` takes no branch-opening marker**, unlike every other trunk this project's git conventions ask one of. It exists to move fast on one emergency fix
- **That exemption holds only as long as `hotfix/xxxx` never becomes a trunk branch** — never cut a sub-hotfix or sub-feature branch from it. A fix that would need one is not a **hot**fix: do it as a patch-bumped `release/<version>` instead

---

## Per-change branches

Six kinds of change each get their own branch, cut from `release/<version>`'s current tip and merged back into it. **These branch names are deliberately descriptive**, unlike the merge message, because the name is what a reader scans `git branch` for while the work is in flight.

| Kind | Name | Example |
|---|---|---|
| **one feature's implementation** | **`feature/<feature-id>`** | `feature/attendance`, `feature/attendance--monthly` |
| a new dependency | `install/<package-name>-<version>` | `install/date-fns-4.1.0` |
| an existing dependency's version bump | `update/<package-name>-to-<version>` | `update/date-fns-to-4.2.0` |
| a conflict-proof file's expected, planned change | `update/<filename>-with-<what>` | `update/Base-with-SampleClassName` |
| the local end-to-end environment, extended by checkpoint 17 | `update/e2e-<what>-for-<feature-id>` | `update/e2e-seed-for-attendance` |
| reworking something already implemented, found lacking later | `retake/<member-name>-of-<class-name>-for-<why>`, or `retake/<filename>-for-<why>` when no single member is at fault | `retake/save-of-UserRepository-for-no-restricted-syntax` |

**`update` is planned growth; `retake` is a redo.** Name the branch by which of the two it is.

**`feature/` always holds the feature's `id` verbatim, never a summary** — not even where the `id` reads as opaque (`fr-010`). Look the `id` up in `.hora/tasks/` or `specs/` for what it means.

**When more than one is waiting to merge, `install`/`update`/`retake` go first, ahead of any `feature/`.** A feature's branch may depend on what one of these provides.

### One feature, several repositories, one branch name

A feature's checkpoints cross repositories. **Each repository gets its own `feature/<feature-id>` branch, under the same name, cut and merged independently.**

| | When it is cut | When it merges back |
|---|---|---|
| the backend row | entering checkpoint 3 (the first one that writes backend code) | **once checkpoint 9 passes** |
| a frontend row | entering checkpoint 10 | **once checkpoint 17 passes** |

**A feature's branches merge at their own gate's boundary, not after acceptance.** Checkpoint 18 runs suites spanning every feature so far and can fail on any of them, so waiting for it would hold these branches open across other features' work. What acceptance turns up comes back as a `retake/` branch.

**A repository the feature does not touch gets no branch.**

**Checkpoint 17 falls outside this.** It extends the local end-to-end environment, which lives in the backend repository — whose `feature/` branch merged back at checkpoint 9. Its changes go on their own **`update/e2e-<what>-for-<feature-id>`** branch. An environment is shared by every feature, so a change to it is planned growth of something common.

---

## Commit messages

**What goes into one commit, and how its subject is worded, are not `/hora`'s to state.** The granularity of a commit, which changes are split apart, and whether this repository's subjects are imperative or Conventional Commits are its git conventions, held by an equipped skill and matched at run time (`structure.md`). Below is only what `/hora` adds on top of them.

- **Stamp the spec ID into the commit message.** It is the only way to follow one change across every declared repository

```
Declare the RpaFlow model

spec: 1.0.0#data-model
```

- **`package.json` is committed before `package-lock.json`.** Which of them a change belongs to is settled by the convention that splits generated output from what a human wrote; the order between the two is `/hora`'s
- **The `package-lock.json` commit message is always `Update package-lock.json after npm install`** (or `... after npm uninstall`). The diff is not meant to be read
- A dependency left in `package.json` after its feature was dropped is not worth a cleanup commit
- **A dependency update can break `npm test` / `npm run lint`.** A fix commit right after the `package-lock.json` commit is fine — **but only when the fix is dependency-specific**. When the identical fix would have applied before the update too, it is not part of the update: commit it on its own, before the `package.json` commit
- **A conflict-proof change (`.env.development`, `docker-compose.development.yml`, the `Base` class) gets its own commit**, one per file, never mixed into a feature's own commit

---

## Committing `.hora/`

An update to `.hora/` never goes in the same commit as the implementation it belongs to. They are separate repositories.

**Write a checkpoint's checkbox the moment it passes; commit at the gate boundary.**

| | Written | Committed |
|---|---|---|
| when | immediately, as each checkpoint passes | at the end of each gate (after checkpoints 2, 9, 17 and 18) |
| why | an interrupted run must resume from the exact checkpoint it stopped at | `git log .hora/` has to stay readable |

The gate-boundary commit message names the gate and the feature:

```
Pass the backend gate of #attendance

spec: 1.0.0#attendance
```

`/hora-plan`'s own output (`_plan.md`, the feature files, questions, contracts, the glossary) is committed when planning finishes, before any feature starts.

---

## Merging into a trunk branch

**The merge itself is not `/hora`'s to state.** Which branches hold the trunk role and how it nests, whether the merge fast-forwards, what its commit's subject says, what becomes of the branch afterwards, and how a rebase preserves the merges inside it are this project's git conventions, held by an equipped skill and matched at run time (`structure.md`). Below is only what `/hora` adds on top of them.

- **The branches `/hora` itself opens as trunks are `release/<version>` and `hotfix/xxxx`**, both merging into `main`. `hotfix/xxxx` is the one branch the role must never reach beyond that: nothing is cut from it (above)
- **Immediately after merging anything into `release/<version>`, run the check in "Keeping `release/<version>` current" again.** `/hora` has no scheduler, so a merge is the next-best occasion to notice `origin/main` moved

---

## Keeping `release/<version>` current

**`release/<version>` is not rebased, with one exception.** Nothing already merged into it is ever reverted or rewritten away.

**The exception is a `hotfix/*` landing on `main` while `release/<version>` is still open.** Check at the start of every `/hora` invocation, and again right after every merge into `release/<version>`.

```bash
git merge-base --is-ancestor origin/main release/<version>   # 0 = nothing new landed / 1 = it did
```

A `1` means `origin/main` holds a commit `release/<version>` does not — ordinarily only possible through a `hotfix/*` merge.

**If this check runs while `feature/<feature-id>` holds uncommitted work, commit that work first, as a single commit.** Use `saving-YYYYMMDD-HHii` as the message (today's date and the current time) — one save point, left undivided.

**This is a deliberate exception to the commit conventions**, which call a commit whose message records that time passed an anti-pattern and answer it with `git stash`. Here the branch itself is about to be rebased, and a stash sits outside the branch: the work would have to be popped back afterwards, onto a base it was not taken from. A commit travels with the branch and comes out of the rebase already on the new base. It is also exempt from the message conventions, and from the granularity ones: the commit is undone in the next step and never reaches a pull request, so no reader ever meets its subject or weighs what it holds.

**Once the rebase lands, `git reset --soft` that commit away and continue.** `--soft` keeps every change staged, as if the commit had never happened.

### The catch-up procedure

Never rewrite `release/<version>` directly. Build the caught-up result on a disposable `temp` branch, and move `release/<version>` once, at the end.

```
1. Branch temp from release/<version>'s current tip.
2. Attempt the whole thing in one shot:
     git rebase -r --onto origin/main origin/main temp
   Success → temp is release/<version>, fully caught up. Skip to step 6.
   Conflict → git rebase --abort.
3. Walk temp back one commit at a time and retry step 2 at each point,
   until one succeeds:
     git rebase --onto @^ @      # moves temp back one commit; replays nothing
   (Only an install/update branch and any hotfix-restacked branch ever touch a
   shared file, so this typically stops right after backing past the most recent
   merge — but it is a plain one-commit-at-a-time walk, not a jump to the nearest
   merge, and does not assume that in general.)
4. Call the point reached C. temp now holds release/<version>'s history up to C,
   rebased cleanly onto origin/main. The next commit after C, in release/<version>'s
   ORIGINAL history, is where catching up stopped working.
5. Handle exactly that next stretch, and no more:
   - An ordinary commit → cherry-pick it onto temp directly.
     Conflict → git cherry-pick --abort, redo it (below), commit the redone
     version onto temp, then continue.
   - A --no-ff merge commit M (some branch B) → reconstruct B on its own
     disposable line branched from temp, cherry-picking B's own commits
     (git log M^1..M^2) onto it one at a time, aborting and redoing (below)
     wherever one conflicts. Once every one of B's commits has landed, merge
     that line into temp the same way any branch merges into a trunk, and
     discard it.
6. Retry the bulk form for whatever remains after the stretch just handled:
     git rebase -r --onto temp temp <original release/<version> tip>
   Success → done. Conflict → go back to step 3, walking back from here instead
   of from origin/main.
7. Once release/<version>'s entire original history has landed on temp with
   nothing lost, fast-forward release/<version> to temp's tip and delete temp
   (and any leftover disposable line from step 5).
```

### Redoing a conflicting commit

Never hand-resolve a conflict textually. Redo means reproducing the same intent against the tree as it now stands.

| The commit's own kind | How to redo it |
|---|---|
| a feature's implementation commit (carries a `spec: <id>` trailer) | trace `<id>`, clear the checkpoints in `.hora/tasks/<version>/<id>.md` that produced it, and run them again through `/hora-build` against the tree as it stands |
| a `package.json`/`package-lock.json` commit | **stop instead of redoing it, if the commits being caught up on also touch this file.** Re-running `npm install` would silently pick some resolution, with no conflict to surface the disagreement. Report it and wait for a human. Otherwise re-run the same `npm install`/`npm uninstall` against the tree as it stands |
| a conflict-proof file commit | the same distinction: stop and ask if the hotfix side also touches this file; otherwise re-apply the change fresh |
| the branch's own empty opening marker | never conflicts — it carries no diff |

---

## Merge order into `main`

**app (the hora repository) may be merged into main only after every declared repository has been merged into main.**

app's merge causes `release.yml` to create a tag, and that tag means the version has been released. Because of this order, judging a release comes down to **checking a single tag on app.**

Check per declared row, against the row's own `release/<version>` branch — **not `HEAD`**, which may already sit on a later version's branch.

```bash
git -C <myproject>-<row> fetch origin main
git -C <myproject>-<row> merge-base --is-ancestor release/<version> origin/main   # 0 = merged / 1 = not yet
```

If even one returns `1`, **app must not be merged.** State that explicitly in the closing report. A repository with no remote configured has not been pushed yet — report it as such. If `release/<version>` no longer exists locally, a human deleted it after the PR merged — treat that as merged.
