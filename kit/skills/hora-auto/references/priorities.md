# The priorities a person ranks before an automatic run

**This file is the vocabulary of the declaration** (`../SKILL.md`, "The declaration"): every axis a person may rank or exclude, the side each one leans to where the spec says nothing, and the order each kind of project starts from.

**An axis is admitted to this list by one test: it changes a decision the run makes.** An axis whose weight could not move any choice at a checkpoint, in a reading of the spec, or in a gap the spec left, is noise in the ranking, and it does not belong here.

**No axis reaches past the spec, and none reaches past the equipped conventions.** A ranking decides where the spec leaves room. The security level, the availability and every other non-functional requirement the spec states are already decided, and how code is written is the equipped skills' to say (`../../hora/references/structure.md`, "The division of labor").

---

## The axes

**The key is what the declaration and `_auto.md` hold.** A person never has to type one: what they say in their own words is mapped onto a key and shown back.

**`Leans to` is the side taken where the spec is silent on the matter and filling it in would invent intent** (`../SKILL.md`, "The three kinds of problem", kind 2). **It is always the side that is easier to loosen later than to tighten.** A dash means the axis only breaks ties, and has no side of its own to lean to.

### A. The person using it

| Key | What it means | A decision it changes | Leans to |
|---|---|---|---|
| `usability` | done without hesitation, in few steps | a filter on a list, or paging alone | — |
| `visual-polish` | how finished it looks | motion and spacing tuned, or the default components as they come | — |
| `accessibility` | usable by assistive technology and by keyboard | whether a state may be shown by colour alone | labels, roles and keyboard reach on every control |
| `error-experience` | how carefully failure, emptiness and loading are shown | a failure showing its cause and the next step | — |
| `operation-safety` | the user's own mistakes are headed off | a confirmation, or an undo, before a deletion | a confirmation before anything irreversible |
| `mobile` | usable on a small screen | a table stacked, or scrolled sideways | — |
| `i18n` | several languages and regions | text moved to a catalogue, a date formatted per region | — |

### B. The data

| Key | What it means | A decision it changes | Leans to |
|---|---|---|---|
| `data-integrity` | contradictory data cannot get in | a constraint in the database, or validation in the application alone | the constraint in the database; ambiguous input refused |
| `auditability` | who changed what, and when, can be traced | a history table | the history kept. **What is not recorded now cannot be recovered later** |
| `recoverability` | what was deleted or broken can be restored | a logical delete, or a physical one | the logical delete |
| `privacy` | personal data kept to a minimum, and kept out of sight | a value masked on a screen or in a log, a retention period | not stored; masked where shown |

### C. Security

| Key | What it means | A decision it changes | Leans to |
|---|---|---|---|
| `security` | stands up to an attack | how strictly input is validated, a rate limit | validated strictly; refused by default |
| `access-control` | how finely access is divided | by role, or down to the row | **the least the use cases need, and past that the highest role alone** ("Leaning a permission", below) |
| `compliance` | law and industry standards | consent recorded, data kept in one region | nothing collected or kept that the spec does not name |

### D. Performance and scale

| Key | What it means | A decision it changes | Leans to |
|---|---|---|---|
| `runtime-performance` | responds fast | an aggregate computed in advance, or on the spot | — |
| `scalability` | holds up as data and users grow | everything read at once, or a page at a time | — |
| `resource-cost` | keeps the running cost down | a cache or a queue added, or done without | — |

### E. Reliability and operation

| Key | What it means | A decision it changes | Leans to |
|---|---|---|---|
| `availability` | does not stop | heavy work moved to a background job | — |
| `fault-tolerance` | keeps its behaviour when an outside service fails | a retry, or carrying on with less | — |
| `observability` | what happened can be traced afterwards | a structured log per operation | the log written, with no personal data in it. **What is not logged now cannot be read later** |
| `operability` | easy for whoever runs it | a setting changeable from an admin screen | — |

### F. The people building it

| Key | What it means | A decision it changes | Leans to |
|---|---|---|---|
| `maintainability` | easy to read and to change | shared, or written plainly per feature | — |
| `extensibility` | ready for what may be added | a set of values fixed in code, or held in a table | — |
| `simplicity` | only what is needed | nothing added the spec does not state | nothing added |
| `consistency` | matches the screens and code that exist | a new UI pattern, or the existing one | — |
| `compatibility` | lives beside existing systems and outside APIs | an API shaped for an existing client | — |
| `portability` | moves between environments | a feature of one cloud relied on | — |
| `test-depth` | tests beyond what the conventions require | how far boundaries and failure cases are covered | the extra cases written |

### G. How it is delivered, and the business

| Key | What it means | A decision it changes | Leans to |
|---|---|---|---|
| `delivery-speed` | finished sooner. **Not `runtime-performance`** | the smaller of two options, when in doubt | — |
| `completeness` | built out between the lines of the spec | sorting or searching on a list nobody specified | — |
| `seo` | found by search engines | rendered on the server, metadata filled in | — |
| `analytics` | how it is used can be measured | an event recorded per operation | — |
| `onboarding` | a first-time user is not lost | guidance shown in an empty state | — |
| `notification` | the user is told | a change pushed, or left for the user to find | — |

---

## Axes that pull against each other

**These pairs are where a ranking earns its keep.** A single decision rarely turns on more than two axes, and these are the pairs it most often turns on.

| One side | The other |
|---|---|
| `simplicity` | `extensibility` |
| `delivery-speed` | `completeness` |
| `security` | `usability` |
| `runtime-performance` | `resource-cost` |
| `visual-polish` | `delivery-speed` |
| `privacy` | `observability` |

**The ranking decides between them: the higher one wins.** Where neither side is ranked, `simplicity` is the default — nothing is added the spec does not state — and the decision is recorded like any other.

**Step 4 of the declaration asks about these pairs**, and only where the spec does not already settle the order (`../SKILL.md`, "The declaration").

---

## How an excluded axis is read

**An excluded axis is not built for its own sake.** Where filling a gap would do something only that axis wants — metadata for `seo`, a catalogue for `i18n` — the run leaves it out.

**Exclusion loses to a ranked axis.** Where a ranked axis cannot be served without part of an excluded one's work, that part is done, and the decision is recorded.

**Exclusion never beats the spec.** A spec that asks for two languages gets them, whatever the declaration says about `i18n`. **The disagreement is pointed out at step 6 of the declaration**, before the run starts, and never discovered at the sweep.

**An excluded axis's lean is not taken.** `auditability` excluded means no history table is added to fill a gap — unless a ranked axis leans to one.

---

## Which lean applies

For a gap of kind 2 (`../SKILL.md`, "The three kinds of problem"):

```
1. the highest-ranked axis whose lean speaks to this gap
2. none ranked speaks to it -> the lean of the axis the gap itself belongs to
                               (a permission belongs to access-control), unless
                               that axis is excluded
3. excluded, or no lean      -> simplicity: nothing added
```

**Step 2 is why a gap is closed even when nobody ranked the axis it belongs to.** Nobody said to open it, and the side easier to loosen later is the one that costs nothing if the guess was wrong.

### Leaning a permission

**This is the lean that matters most, and it takes two steps.**

```
1. Collect every role the spec's use cases need to reach this data or this
   operation. Grant exactly that, and nothing wider
2. What the use cases do not settle goes to the highest role the spec
   declares, and to nobody else
```

**Step 1 comes first because step 2 alone breaks use cases.** "Only the highest role may see it" hides an employee's own payslip from the employee whose use case is reading it. Checkpoints 2, 9 and 11 walk the use cases and catch that shape; where they do, step 1 is taken again, wider.

**A spec that declares no roles at all has nothing for step 2 to reach.** That is not a lean — it is a gap with no side to take, and it is kind 3.

---

## Where each kind of project starts

**Step 0 of the declaration asks which kind this is, and the answer is the draft's starting point.** The spec then moves it: what the spec states outranks what the kind suggests. The draft is a proposal either way (`../../hora/references/asking.md`).

| Kind | Starting order | Candidates | Excluded |
|---|---|---|---|
| **an internal business system** | 1. `data-integrity` 2. `access-control` 3. `auditability` 4. `usability` 5. `operability` | `recoverability`, `consistency`, `error-experience` | `seo` |
| **a service for the public** | 1. `usability` 2. `security` 3. `runtime-performance` 4. `visual-polish` 5. `privacy` | `accessibility`, `scalability`, `onboarding` | — |
| **a demonstration or a trial** | 1. `delivery-speed` 2. `visual-polish` 3. `simplicity` 4. `usability` 5. `consistency` | `onboarding`, `error-experience`, `mobile` | `scalability`, `extensibility` |
| **a regulated business** (finance, healthcare) | 1. `security` 2. `compliance` 3. `data-integrity` 4. `auditability` 5. `access-control` | `privacy`, `recoverability`, `availability` | — |

**An exclusion in this table is only a starting point, like the rest of the row.** The spec removes one it contradicts before the draft is shown — a demonstration whose spec states a growth target does not start with `scalability` excluded.

**A kind the person names outside these four** starts from no row: the draft is built from the spec alone, and says so.
