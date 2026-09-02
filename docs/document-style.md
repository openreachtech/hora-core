<!-- 日本語版: [document-style.ja.md](./document-style.ja.md) — 片方を直したら、同じコミットでもう片方も直してください -->

# Document style

*[日本語](./document-style.ja.md)*

How the documents a person reads are written. **[`writing-style.md`](./writing-style.md) is the other half** — the files under `kit/`, read at run time by an agent.

The two are held apart by their cost. A rule in a skill file is paid for on every run, so all three of that document's rules are compression. Nothing here is read at run time, so an argument costs nothing — and a reader who cannot find the claim inside it has still been failed.

---

## What this covers

`README.md` and everything under `docs/`, in both languages, in every repository of the kit. Not `specs/`, which a project writes for itself, and not `kit/`, which is `writing-style.md`'s.

---

## The reader chose to open it

They are not an agent executing a step. They arrived with a question, and they leave when they have the answer or when they stop believing it is here.

**So length is not the budget. Findability is.** Explain the reasoning, state the alternative that was rejected, name the failure the rule prevents — all of that earns its space here. What does not earn it is a claim the reader has to reconstruct from four clauses.

---

## Bold marks what must not be missed

**Bold the imperative, the prohibition, or the one fact a reader who skims must still leave with. Never the topic of the paragraph**, which is what the heading is for. That is the rule; the rest of this section is how to tell when it has been broken.

Roughly two per section, in prose. **This is a target, not a hard limit** — a section carrying three parallel prohibitions is not a defect, and one where every paragraph opens bold has marked nothing. Over two is the signal to look, and what the extras turn out to be is almost always topic sentences.

The number matches the skills' and the reason does not: there, bold costs tokens; here, it costs its own meaning.

**A label does not count.** A table's label column, a condition a paragraph covers (`Under as-built`), a UI path, or a term being marked as a term (`carry-over`, `resolved`) — in each the bold separates a name from what is said about it, which is structure rather than emphasis. This kit has used it that way throughout, and in Japanese it is the only way available, italics being out.

Measured in prose across the kit, bold runs from 0.1 to 3.8 per section. Fourteen of forty-six documents are over two, and the overflow is topic sentences in every one of them.

---

## One sentence, one claim

**No word ceiling.** A sentence may run long here in a way it must not in a skill file, because the reasoning is the point.

What it may not do is carry a second claim. **An em dash that joins one is a sentence break** — the same rule the skills are held to, and for the same reason, because this one is about parsing rather than cost. A second em dash in a sentence is the signal to look, and usually the signal to split.

---

## The Japanese is not a translation

It is the same document, written in Japanese. Whoever reads only the Japanese must not be reading a lesser version.

- **Put a space between Latin script and the Japanese around it** — `Hora Kit が`, never `Hora Kitが`. Inline code and identifiers count as Latin script.
- **Parentheses are full-width**: `（…）`, not `(…)`.
- A term the English states in English stays in English. No Japanese word is invented for `resolver` or `checkpoint`.
- Where the English argues, the Japanese argues. Summarising one side is how a pair starts to disagree.
- **Italics do not read in Japanese, so bold stands in for them.** The Japanese therefore carries more bold than the English, and the counts are not meant to match. `*works*` becomes `**動くかどうか**`.

---

## A document and its twin are one decision

They are edited in the same commit, and the subject names the document without its extension — `Kick out the registry setting from README`.

**The heading structure is identical in both.** Same levels, same order, same count. A figure, a table or a fenced block appears in both or in neither.

---

## Naming a skill

A skill carries **the leading slash it is invoked with, in backticks** — `/hoc-git-commit`, never `hoc-git-commit`. Without the slash the string reads as a directory, a package or a branch prefix, and this kit is full of all three.

**Name a convention by its skill rather than by its file.** A file inside another package is not this repository's to link, and its path is that package's to change: write "`/hoc-git-commit`'s `granularity.md`" and let the reader find it through the skill.

---

## Structure

| | |
|---|---|
| **language link** | `*[日本語](./x.ja.md)*` on its own line under the `# ` heading. The HTML comment above it is for whoever edits the file; this line is for whoever reads it |
| **table of contents** | over roughly 200 lines and 15 sections. Top level only, and a heading inside a fenced block is not a section |
| **closing** | `## Where to go next`, as a two-column table of question and destination |
| **figures** | where the subject they draw is discussed. A figure anywhere else is decoration, and this kit has drawings enough to be tempted |
| **links** | a `README` links by full URL, because npm renders it outside this tree. Everything under `docs/` links relatively |

---

## What is settled elsewhere

| | |
|---|---|
| the files under `kit/`, read at run time | [`writing-style.md`](./writing-style.md) |
| what belongs in one commit, and the pair rule it states | `/hoc-git-commit`'s `granularity.md` |
| identifiers, abbreviations and spelling | `/hoc-naming` |
| whether a document is needed at all | nothing settles it. That is a judgement, and it is yours |
