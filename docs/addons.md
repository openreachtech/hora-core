<!-- 日本語版: [addons.ja.md](./addons.ja.md) — 片方を直したら、同じコミットでもう片方も直してください -->

# Add-ons

*[日本語](./addons.ja.md)*

The skills are written for a person who is there to be asked. They stop on a question nobody has answered, they walk the use cases with someone, and they take a skip only when someone asks for one. That is the right default, and there are runs it does not fit.

**An add-on is a package installed beside Hora Kit that lets its skills do what they could not do on their own.** It never edits a skill. It declares, in files of its own, where a skill's decision goes another way while the add-on is active. A project without the add-on runs exactly as the skills are written.

`/hora-addon` is the rule every hora skill follows about add-ons. This page is its explanation for a person.

---

## What an add-on carries

Skills, wings, or both.

| Part | What it is | Installed at |
|---|---|---|
| a skill | a skill in its own right, invoked like any other | `.claude/skills/<skill-name>/` |
| a wing | a file that extends what an existing skill can do, while the skill itself stays as written | `.hora/wings/<skill-name>/<addon-name>/` |
| its definition | the add-on's name, when it is active, and the Hora Kit it needs | `.hora/addons/<addon-name>.json` |

**The name "wing" is meant both ways.** A wing lets something fly that could not: the skill gains what it could not do before. A wing of a building is joined to the main house, which stays standing as it was: the skill is never replaced, and the wing is read together with it.

A wing overlays the skill, and never copies it. A wing file sits at the same relative path as the file it extends, under that skill's name, and holds nothing but the sections it changes.

```
.claude/skills/hora-plan/SKILL.md                          the skill as written
.claude/skills/hora/references/asking.md

.hora/wings/hora-plan/alpha-example-addon/SKILL.md         extends hora-plan/SKILL.md
.hora/wings/hora/alpha-example-addon/references/asking.md
                                                           extends hora/references/asking.md
```

A wing is looked up by the file it extends, not by the skill reading it: the skill that file belongs to names the directory, and the wing is found at the same relative path under `.hora/wings/<that skill>/*/`. `asking.md` belongs to `/hora` and is read by every skill that talks to a person, and every one of them finds the same wing.

Wings and definitions sit under `.hora/` rather than `.claude/`. `.claude/` holds what Claude Code reads, and both are read only by the hora skills, so they belong in Hora's own directory.

**Hora Kit's own installer never touches `.hora/wings/` or `.hora/addons/`.** Reinstalling Hora Kit leaves every add-on in place. Each add-on's installer writes its own files there, and nothing else does. Neither directory is committed: both are regenerated on every install, unlike the records under `.hora/`.

---

## When an add-on takes effect

**Installed is not the same as active.** The definition says which of two kinds the add-on is.

| `activeWhen` | Active |
|---|---|
| `"declared"` | while its record declares it on |
| `"always"` | whenever it is installed |

**The field is never left out.** A missing field meaning *always* would let a definition that simply forgot the field take the strongest effect there is, and nothing reading it could tell the forgetting from the intent. The add-on's installer refuses a definition without it, or with any value but these two, before placing anything. One that reaches `.hora/addons/` anyway is at fault, and the add-on is not active.

A declared add-on keeps its declaration in a record named after itself: `_<addon-name>.md`, holding the line `<addon-name>: on`.

```
.hora/tasks/1.0.0/_alpha-example-addon.md    this version's declaration
```

A declaration is one version's, so an add-on can be on for one version and off for the next. There is no record for every version: an add-on that is to be on for every version says so in its definition, with `always`. What happens during a version's run is written in that version's record too.

**Every hora skill works out which add-ons are active as soon as it knows which version it is on**, whatever started it. When `/hora` hands over to `/hora-plan`, `/hora-plan` works it out again for itself, and every skill does so again after a resume or a compacted context. The records decide, never the conversation: what a session remembers about how it was started does not survive either of those.

Where at least one add-on is installed, the skill says which are active before it does anything else:

```
add-ons active for 1.0.0: alpha-example-addon
```

`none` is reported too, because an add-on that is installed and not active is exactly the case worth catching. A project with no add-on installed sees no line at all.

---

## The sections an add-on may change

**A skill marks the sections an add-on may change, and only those, with `[wing]` in the heading.** A section left unmarked cannot be changed by any add-on.

A marked section is a decision the skill has taken out of its text. Where the text used to say *if even one `blocking: yes` is unresolved, stop*, it now says *stop, unless the section says the run may go on*, and the condition lives in the section. An add-on changes the condition without touching the sentence that uses it, the way a method called by name can be redefined while its caller stays the same.

A section takes one of two shapes, and its heading says which.

| Heading | Answers | Worded so that |
|---|---|---|
| `Whether …` | yes or no | **yes takes the run further** — goes on, skips, decides without waiting |
| `How to …` | what to do | — |

The wording rule is what keeps the rest simple. An add-on that lets the run through always widens a decision, and one that holds it back always narrows it.

### The sections Hora Kit marks today

| Skill | Section | What the skill does on its own |
|---|---|---|
| `/hora` (`asking.md`) | `[wing] Whether a decision may be taken without asking` | no: whatever is to be put to a person is put to a person |
| `/hora` (`asking.md`) | `[wing] How to decide without asking` | not reached, since the section above says no |
| `/hora-plan` | `[wing] Whether the run may go on past an open blocking question` | no: `/hora-build` is not entered, and `/hora` stops at its step 4 |
| `/hora-plan` | `[wing] How to categorize a question` | the table of question categories |
| `/hora-build` | `[wing] Whether a feature is ready to build` | yes, where its entry is `[ ]` and every `depends` is satisfied. `/hora` and `/hora-fast` both take their next feature from it |
| `/hora-build` | `[wing] Whether a gate may open while a dependency is unfinished` | yes, where every unfinished dependency has reached what the step waits on, which is nothing before checkpoint 9 and the matching gate's merge from 9 on. Only `/hora-fast` reads it |
| `/hora-fast` | `[wing] Whether an interactive checkpoint may be skipped` | yes, for checkpoints 2, 9 and 11, once a person asks for it |
| `/hora-progress` | `[wing] How to report progress` | one line for each checkpoint or stage that passes, in the shape `<checkpoint or stage> passed \| <the one fact it established> \| <what comes next>`, with no emoji in front |
| the skill a person invokes (`structure.md`) | `[wing] How to begin a run` | nothing beyond resolving the add-ons |
| every skill (`structure.md`) | `[wing] How to close a run` | the skill's own closing report, whether the run stopped, was paused or finished |

**These headings are a contract.** An add-on finds a section by its heading, so renaming or removing one is a breaking change to Hora Kit and is released as one. Adding a section breaks nothing, and neither does changing what a section says while its heading stays.

---

## How a wing changes a section

A wing's heading carries the same text as the section it changes, and names the effect in its marker.

| Marker | On | Effect |
|---|---|---|
| `[wing:or]` | `Whether …` | widens: the answer is also yes where this holds |
| `[wing:and]` | `Whether …` | narrows: the answer is yes only where this holds as well |
| `[wing:replace]` | `How to …` | the skill's section is set aside, and this one is read instead |
| `[wing:overlay]` | `How to …` | read on top of the skill's section; where they disagree, the wing's text holds |
| `[wing:add]` | `How to …` | steps added to the skill's section, which stays whole |

**A wing states no condition of its own.** Whether the add-on is active was settled before any wing was read, so a wing only says what changes. A condition written inside a wing is where a forgotten *otherwise* would change a run with nobody noticing.

`[wing:replace]` is the strongest of the five and the costliest. The skill's section is gone for as long as the add-on is active, including every correction Hora Kit makes to it later.

---

## Where several add-ons meet

Every active add-on's wings are read, and they combine.

A `Whether …` section combines in one expression, and the order of the add-ons never matters:

```
answer = (the skill's section  OR  every [wing:or])  AND  every [wing:and]
```

**`and` prevails.** An exclusion one add-on states is not undone by another widening the same decision. Where nothing narrows, one add-on saying yes is enough, because most add-ons exist to let a run go further.

A `How to …` section combines in a fixed order: at most one `replace`, then every `overlay`, then every `add`. `add` never conflicts. `overlay` conflicts only where two speak to the same point, and `replace` whenever two add-ons both replace.

Where they do conflict, the first of these that decides wins:

1. the precedence a person has set in `.hora/addon/config.json`
2. the add-on whose wing rests on what the person stated — a declaration they made, a line of `specs/` — over one resting on its own defaults
3. the one that leaves the spec more precise and closer to what the person asked for, judged at the time and recorded as an `addon-precedence` question

**The principle behind all three is that the person gains the most.** Once nobody is being asked, an add-on decides in their place, and the decision closest to what they said they wanted is the one they would have taken. A declaration they wrote says more about that than any add-on's defaults do. A judgment taken under 3 is written down so that they can see it and overrule it, and so that a resumed run does not take it again differently.

### Add-ons that are never active together

Some add-ons build different kinds of thing — one toward a release, one a proof of concept — and nothing either decides means anything to the other's product. **Such a pair is never active for one version.** One definition names the other in `exclusiveWith`, and that is enough. The add-on's own skill refuses a declaration while the other is active, and if both are active anyway, every skill stops at resolving, with neither applied. Which one to keep is a decision about what the project is building, so it goes back to the person; no precedence decides it.

---

## Setting the precedence

`/hora-addon`, invoked directly, shows which add-ons are installed, which are active for the current version, and the precedence set. Tell it to put one add-on ahead of another and it writes the file and commits it:

```json
{
  "precedence": ["alpha-example-addon", "beta-example-addon"]
}
```

**Earlier in the list comes first.** An add-on missing from the list comes after every add-on on it. The file is a record under `.hora/`, so it is committed and everyone on the project gets the same precedence. A person writes it, through `/hora-addon` or by hand, and no installer ever does.

Ask `/hora-addon` to check the add-ons and it compares every wing with the Hora Kit installed now: a counterpart file that exists, a section of the same heading, a marker that fits the section's shape.

---

## Building an add-on

| | |
|---|---|
| **package name** | `@openreachtech/hora-addon-<name>`, whatever the add-on carries, and `<name>` is the add-on's name. One package is one add-on, and a name that changed with its contents would mean renaming the package the day it gains a skill |
| **the Hora Kit it is built for** | a range of `@openreachtech/hora` in `horaKit` of its definition — `"^0.10.0"`, say — declared by every add-on, whatever it carries, since its definition is read by Hora Kit's resolving. The field is never left out. The lower bound is the first Hora Kit release carrying every `[wing]` section the add-on's wings extend, and the caret stays, since renaming or removing a `[wing]` section is a breaking release. It is a condition on the consuming repository, not a dependency, peer or otherwise: the add-on uses nothing of Hora Kit, Hora Kit's skills read the add-on, and a peer dependency would have npm install Hora Kit into the add-on's own repository, where nothing uses it |
| **its installer** | the package's own `bin`, run as `hora-addon-<name> install`. Before placing anything it resolves `@openreachtech/hora/package.json` from the consuming repository as Node would, reads its version, checks it against `horaKit` with the `semver` package, and changes nothing where the definition declares no range, or one `semver` does not read, where no Hora Kit is installed, or where the one installed is outside the range — npm never reads the field, so this check is the only one, and a wing installed against headings that are not there does nothing at all, silently. `uninstall` checks nothing. A project with several add-ons runs every add-on's skills pass first (`install --only skills`), then every add-on's wings pass (`install --only wings`) |
| **its definition** | `kit/addon.json` in the package, holding `activeWhen`, `description`, `horaKit` and, where it applies, `exclusiveWith`, but never `name`: the installer reads the name from the package name and writes it in as the first field of `.hora/addons/<addon-name>.json`. The wings pass places it, and `install` with no `--only` too, even for an add-on carrying no wings; uninstalling the wings part removes it, and `--only skills` alone leaves it as it is |
| **what goes under `wings/`** | only files that extend a `[wing]` section of Hora Kit, at the same relative path. Anything the add-on adds of its own goes into its skills |
| **its record** | `_<addon-name>.md`, committed on its own every time a line is added to it |

---

## Where to go next

| | |
|---|---|
| the rule itself, as the skills read it | [`hora-addon/SKILL.md`](https://github.com/openreachtech/hora-core/blob/main/kit/skills/hora-addon/SKILL.md) |
| what each command does | [`commands.md`](./commands.md) |
| how a question is recorded, and its categories | [`hora-plan/SKILL.md`](https://github.com/openreachtech/hora-core/blob/main/kit/skills/hora-plan/SKILL.md) |
| what a skill asks a person, and how | [`asking.md`](https://github.com/openreachtech/hora-core/blob/main/kit/skills/hora/references/asking.md) |
| the layout of `.hora/` | [`structure.md`](https://github.com/openreachtech/hora-core/blob/main/kit/skills/hora/references/structure.md) |
