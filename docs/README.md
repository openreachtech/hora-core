<!-- 日本語版: [README.ja.md](./README.ja.md) — 片方を直したら、同じコミットでもう片方も直してください -->

# Documentation

*[日本語](./README.ja.md)*

How Hora works — the method this package carries. Every document here is a pair, `x.md` and `x.ja.md`, and each opens with a link to its twin.

**Start with [`architecture.md`](./architecture.md).** It sets out the two halves — deciding what gets built, then building it — and the rest read against that shape.

| Document | What it settles |
|---|---|
| [`architecture.md`](./architecture.md) | **how work gets executed.** The four layers and where each ships from, one feature through eighteen checkpoints, re-entrancy, the git model, and the seven stages a spec is written through |
| [`commands.md`](./commands.md) | **what each command does.** Reads, writes, stops-when and run-it-directly for all six, plus what a session actually looks like |
| [`adopting.md`](./adopting.md) | **putting the kit on a project that already exists.** Which of the two adoptions it is, the six steps, and what to watch for |
| [`hotfix.md`](./hotfix.md) | **the emergency route.** What `/hora-hotfix` gives up, its six gates, and how the debt comes back as ordinary work |
| [`writing-style.md`](./writing-style.md) | **how the skills are written.** The three rules the files under `kit/` are held to, and what is never compressed |

**None of this is read at run time.** An agent reads `kit/`; a person reads here. That is why an argument costs nothing on this side and costs every run on the other ([`writing-style.md`](./writing-style.md), "Where the reasoning goes instead").

## What is documented elsewhere

| | |
|---|---|
| what a project built with the kit contains, and how to start one | [`hora-boilerplate`](https://github.com/openreachtech/hora-boilerplate) |
| how this package is installed and what its command does | [`README.md`](../README.md) |
| the eighteen checkpoints, the spec format, the branch and commit rules | the `references/` beside the skill that owns each one, under [`kit/skills/`](../kit/skills) |
