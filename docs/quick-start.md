<!-- 日本語版: [quick-start.ja.md](./quick-start.ja.md) — 片方を直したら、同じコミットでもう片方も直してください -->

# Quick start

*[日本語](./quick-start.ja.md)*

You do not have to write the specification before you start. **Put what you want into `specs/1.0.0/request/`, the material around it into `specs/1.0.0/annex/`, and run `/hora`** — the version has no spec yet, so `/hora` starts by invoking `/hora-spec`, which drafts the specification with you out of what you dropped in.

What counts as material is whatever you actually have: a mail, a ticket, a page of bullets, a mockup somebody drew, an ER diagram, an old design document, a spreadsheet the work is really done from. None of it has to be tidy, and none of it becomes a requirement until you have read the words and approved them.

---

## The three steps

```
1. create <myproject>-app from hora-boilerplate, then npm install

2. drop what you have into the version directory
     specs/1.0.0/request/   what you want this version to build
     specs/1.0.0/annex/     material that explains it
     specs/1.0.0/sources/   documents whose content is already settled

3. run /hora at the Claude Code prompt
     the version has no spec yet, so /hora invokes /hora-spec
     /hora-spec reads what you dropped in, then asks its way through the
     document with you, one section at a time
```

**Step 2 is the whole of the preparation.** Everything after it is conversation.

---

## Step 1 — Create the repository

`<myproject>-app` comes from the [`hora-boilerplate`](https://github.com/openreachtech/hora-boilerplate) template, and running `npm install` inside `<myproject>-app` is what sets up the tooling `/hora` runs on, under `<myproject>-app/.claude/`. The steps, and what to have installed first, are in `hora-boilerplate`'s README.

**Under `specs/` there is one directory per release, and `specs/1.0.0/` is the first of them.** The three directories arrive inside it, empty, with the template, so there is nothing to create before step 2.

---

## Step 2 — Drop in what you have

| Put a file here | `/hora-spec` understands it as |
|---|---|
| `specs/1.0.0/request/` | **this is what I want this version to build.** An idea, a wish, an agenda — nobody has worked out yet whether it is coherent |
| `specs/1.0.0/annex/` | **this only explains it.** A mockup, a screen design, a diagram, an old design document, a spreadsheet |
| `specs/1.0.0/sources/` | **this is part of the specification.** A current requirements list, an API reference — something somebody is willing to be held to |

**`request/` is for what you want; `annex/` is for the material around it.** Nothing in either becomes spec text on its own: it reaches the document as a proposal or a question you answer, and only what you approve is written.

`sources/` is the one to place a file into deliberately. A document put there and declared in the spec's `Sources` section is read exactly as the spec itself is — `/hora-plan` turns its content into tasks, and `/hora-build` implements them — so a wish list filed there is a wish list somebody implements. **When in doubt, `annex/`**, where nothing is lost: if its content matters, it reaches the spec through the conversation and becomes a feature from there.

Four things worth knowing as you put files in:

- **Binary files are fine.** A PDF, a PNG, an exported mockup — `/hora-spec` links each one from the spec and adds a line saying what it shows, never transcribing a drawing into the document as though it were a stated requirement
- **No file is required, and no directory is either.** `/hora-spec` raises nothing over an empty one, and a document placed anywhere else under `specs/1.0.0/` is found all the same — but its location then says nothing about your intent, so you get asked which of the three it is, one file at a time
- **Never link into the implementation repositories** — the repositories of actual code, created inside `<myproject>-app`. They are gitignored, so a link into one opens on your disk and breaks in every other clone. Copy what you need into `specs/1.0.0/`
- **Something you cannot bring in is still worth naming.** A wiki page, a drive, a ticket tracker — `/hora-spec` asks what exists where it cannot reach, precisely because the most useful document is regularly the one nobody thought to mention

---

## Step 3 — Run `/hora`

```
/hora
```

**`/hora` is a Claude Code skill.** Start Claude Code in `<myproject>-app`, and type it at that prompt.

A version whose `specs/1.0.0/spec.md` is still empty sends the run there first: `/hora` invokes `/hora-spec`, which is the same as typing `/hora-spec` yourself. Setup, planning, building, acceptance — `/hora` is the command you type to start any of the ordinary work that follows.

`/hora-spec` begins by reading what it has been given, and that first pass is its stage 0: `request/` first, then `sources/` and `annex/`, then the rest of `specs/1.0.0/`. **Your placement comes back as a check, batched** — one exchange for everything in `sources/`, one for `annex/`, one for `request/` — rather than as one question per file. Twenty documents therefore cost three exchanges, plus one more for whichever of them you want moved.

Then the seven stages: the use cases first, then what the release will and will not carry, the numbers (user counts, retention, and the rest of the non-functional requirements), the data model and the API, the screens, security, and a review of the whole document. **Each section is shown to you in full and written into `spec.md` only once you approve it**, and anything `/hora-spec` thought of itself arrives labelled as a proposal.

**Be there while the spec is written.** All seven stages are conversations, and this is where a version stops being a list of feature names and becomes something that can be built. The phases after it — setup, planning, building, acceptance — `/hora` runs on its own, stopping to ask whenever it needs an answer.

---

## What your material becomes

| | `request/` | `annex/` | `sources/` |
|---|---|---|---|
| What stage 0 does with it | reads it as **this version's agenda** | reads it **to interpret** | declares it in the `Sources` section, as **the specification** |
| How it reaches `spec.md` | as proposals and questions, in the stage that covers the subject | only through what you confirm in the conversation | extracted, exactly as a feature file is |
| Declared in `spec.md`, and linked from it | **never** | yes | yes |
| `/hora-plan` extracts tasks from it | **never reads it at all** | no | yes |
| Once the version is written | **spent** — the record of what was asked for | still the explanation | still the specification |

**Never move a file from `request/` into `sources/`.** A source says what the product must do; a request says what somebody wants worked out, and moving one would put a wish list among what `/hora-plan` extracts tasks from.

**Leave the files where they are once the version is written.** `request/` is the record of what was actually asked for, and reading that record later against the spec that came out of it is how you see what the conversation changed.

---

## A later version starts the same way

```sh
mkdir -p specs/1.1.0/request
$EDITOR specs/1.1.0/request/csv-export.md   # "the admin wants a month of attendance as a CSV"
```

Then `/hora` again. Only `1.0.0` ships the three directories, so for a later version create the ones you need yourself.

**From the second version on, `spec.md` is a diff against the version before it**, so what comes out of the conversation is the version's own document information and the new feature, and nothing else. No past version's `spec.md` is touched.

**Keep each version's material inside that version.** A document 1.1.0 needs as well gets a copy of its own under `specs/1.1.0/`, because pointing both versions at one file means editing it for 1.1.0 silently changes what 1.0.0 was written against.

---

## What this route does not skip

**It is a shortcut past writing a specification, never past deciding one.**

| What it does not skip | What holds it |
|---|---|
| Nothing you dropped in becomes a requirement on its own | every section is shown in full, and written only once you approve those words |
| All seven stages still run | their order — use cases first, screens later — is a rule, and every stage is a gate with an exit condition |
| A question nobody can answer on the spot is not guessed at | it is recorded under `.hora/`, where the kit keeps its records. Every such question is a hole in the spec, so you answer it by editing `specs/` |

---

## Where to go next

| | |
|---|---|
| the format `spec.md` is written in, and what each section is for | [`spec-format.md`](../kit/skills/hora/references/spec-format.md) |
| what stage 0 reads, and how it puts something to you | [`investigation.md`](../kit/skills/hora-spec/references/investigation.md) |
| what each command does, and where a run stops | [`commands.md`](./commands.md) |
| putting the kit on a project that already holds working code | [`adopting.md`](./adopting.md) |
| how the whole thing is shaped, and why | [`architecture.md`](./architecture.md) |
