---
name: hora-addon
description: How an add-on extends the hora skills — the Hora Kit range it is built for, the wings every hora skill resolves before it acts, how several add-ons combine where they touch the same section, and the precedence a person may set between them. Read by every hora skill once its version is fixed, and again after a resume or a compacted context. Invoked directly as /hora-addon to set or check that precedence. What an add-on itself decides belongs to that add-on's own skill.
---

# hora-addon

**The rule every hora skill follows about add-ons.** An add-on is a package installed beside Hora Kit that lets the hora skills do what they could not do on their own. This skill says what an add-on may carry, when it takes effect, and what happens where several of them reach the same place. Each add-on describes itself, and the examples here use invented names (`alpha-example-addon`, `beta-example-addon`). **Hora Kit may name an add-on, public files included.** An add-on is protected by its distribution channel — a private package of the npm organization, readable only by the teams that bought it — not by keeping its name out of public files.

**An add-on that is not installed changes nothing, and neither does one that is installed but not active.** Every rule below starts from the skills as they are written and changes them only where an active add-on says so.

---

## What an add-on carries

**An add-on carries skills, wings, or both.**

| Part | What it is | Installed at |
|---|---|---|
| a skill | a skill in its own right, invoked as any other | `.claude/skills/<skill-name>/` |
| a wing | a file that extends what an existing skill can do. The skill itself stays as written | `.hora/wings/<skill-name>/<addon-name>/` |
| its definition | the add-on's name, when it is active, and the Hora Kit it needs | `.hora/addons/<addon-name>.json` |

**The name "wing" carries two readings, and both are meant.** A wing lets something fly that could not — a skill gains what it could not do. A wing of a building is joined to the original, which stays standing as it was — the skill is never replaced.

**Wings and definitions sit under `.hora/`, not `.claude/`.** `.claude/` holds what Claude Code reads, and both are read only by the hora skills, so they belong in Hora's own directory.

**Everything under `.hora/wings/` and `.hora/addons/` is written by the add-on's installer**, and nothing else writes there. Hora Kit's own installer never touches either, so reinstalling Hora Kit leaves every add-on in place. **Neither is committed**: both are regenerated on every install, unlike the records under `.hora/`.

**The definition goes with the wings pass**, whether or not the add-on carries any wings. `hora-addon-<name> install --only wings`, and `install` with no `--only`, places it; uninstalling the wings part removes it; `--only skills` alone leaves it as it is.

### The Hora Kit it was built for

**Every add-on states the range of `@openreachtech/hora` it was built against, as `horaKit` in its definition, whatever it carries — skills, wings or both.** Its definition is read by Hora Kit's resolving, and its wings find their sections by heading. A heading exists in some versions of Hora Kit and not in others, so the range is what says which headings the add-on relies on.

```json
"horaKit": "^0.10.0"
```

- **A condition on the consuming repository, never a dependency.** The add-on uses nothing of Hora Kit; Hora Kit's skills read the add-on. As a peer dependency, npm would install Hora Kit into the add-on's own repository as well, where nothing uses it. As a dependency, each add-on could install a Hora Kit of its own, and its wings would be checked against a copy the project never runs.
- **The field is never left out.** A forgotten range is not read as *any*: that would place wings beside a Hora Kit that may carry none of their sections.
- **The range is the one source.** Nothing else restates it.
- **The lower bound is the first Hora Kit release carrying every `[wing]` section the add-on's wings extend, and the caret stays.** Renaming or removing a `[wing]` section is a breaking release ("The `[wing]` sections", below), so every version the caret admits still carries them.
- **The add-on's installer checks the installed Hora Kit against it, before placing anything, and changes nothing** where the definition declares no range, or one `semver` does not read, where no Hora Kit is installed, or where the one installed is outside the range. It resolves `@openreachtech/hora/package.json` from the consuming repository as Node would, reads its version, and holds it against the range with the `semver` package. npm never reads the field, so this check is the only one, and a wing installed against headings that are not there does nothing at all, without a word. The cheapest place to stop that is before anything is copied. `uninstall` checks nothing.

### A wing overlays, it never copies

**A wing file sits at the same relative path, under its skill's name, as the file it extends**, and holds nothing but the `[wing]` sections it changes.

```
.claude/skills/hora-plan/SKILL.md                         the skill as written
.claude/skills/hora/references/asking.md

.hora/wings/hora-plan/alpha-example-addon/SKILL.md              overlays hora-plan/SKILL.md
.hora/wings/hora/alpha-example-addon/references/asking.md       overlays hora/references/asking.md
```

- **A wing is looked up by the file it extends, never by the skill reading it.** A skill reading a file that holds a `[wing]` section takes the skill that file belongs to, and looks for a file at the same relative path under `.hora/wings/<that skill>/*/`. `asking.md` belongs to `/hora`, so every skill that reads it finds the same wing.
- **A file that extends no `[wing]` section does not belong under `wings/`.** Material an add-on adds of its own goes into the add-on's skills, where a wing may point at it.
- **A wing file whose counterpart does not exist is an error**, not an addition. It usually means the skill renamed or moved the file, and the wing no longer reaches anything. **Such a wing is reported and left out, and so is one whose heading matches no section; the run goes on.** Only two active add-ons that exclude each other stop a run.

---

## Resolving the add-ons

**Every hora skill resolves the add-ons as soon as it knows which version it is working on**, whatever started it. `/hora` resolving them does not excuse `/hora-plan` when `/hora` starts it: `/hora-plan` resolves them again at its own start. **Resolve them again after a resume and after the context is compacted**, because what the conversation remembers about them does not survive either.

```
1. Read every .hora/addons/<addon-name>.json.
2. For each, decide whether it is active for this version:
     activeWhen is "always"       -> active whenever it is installed
     activeWhen is "declared"     -> find the record _<addon-name>.md
       .hora/tasks/<version>/_<addon-name>.md exists  -> read it
       otherwise .hora/tasks/_all/_<addon-name>.md    -> read it
       neither exists                                  -> not active
     active when the record read holds the line <addon-name>: on
     activeWhen is missing, or anything else
                                  -> the definition is at fault: not active,
                                     and reported
3. Do two active add-ons exclude each other — either one's exclusiveWith
   naming the other?                 -> stop the run, with neither applied
                                        ("Add-ons that are never active
                                        together", below)
4. Where at least one add-on is installed, report the active ones in one line
     "add-ons active for 1.0.0: alpha-example-addon"
     "add-ons active for 1.0.0: none"
   Where none is installed, report nothing.
```

**The line is for catching a mistake before it runs.** An add-on a person believes they declared and did not, or one active that nobody remembers declaring, shows in it. **`none` is reported too**, because an installed add-on that is not active is exactly the case worth seeing. A project with no add-on at all gets no line, since there is nothing it could be mistaken about.

**The file decides, never the conversation.** A person who says an add-on is on, while its record says otherwise, has not turned it on; the add-on's own skill is what writes the record.

**`.hora/tasks/_all/` holds a declaration for every version, and a version's own record overrides it.** It holds declarations only. What happens during one version's run — a stop, an end — is that version's, and is written under `<version>/`.

### The definition file

```json
{
  "name": "alpha-example-addon",
  "activeWhen": "declared",
  "description": "Active while it is declared on, for the version or for the whole project.",
  "horaKit": "^0.10.0"
}
```

| Field | Holds |
|---|---|
| `name` | the add-on's name, and the directory its wings sit under |
| `activeWhen` | `"declared"` — active while its record declares it on. `"always"` — active whenever it is installed |
| `description` | one line for whoever lists the add-ons |
| `exclusiveWith` | optional: the add-ons this one is never active together with |
| `horaKit` | the range of Hora Kit the add-on was built against ("The Hora Kit it was built for", above) |

**The add-on's source carries its definition as `kit/addon.json`, without `name`.** The installer reads the name from the package name, `@openreachtech/hora-addon-<name>`, and writes it in as the first field, so the definition can never name the add-on differently from its package.

**An add-on's record is named after the add-on: `_<addon-name>.md`, declaring itself on with the line `<addon-name>: on`.** Its name is already unique among the add-ons, so no two records can claim one file, and a reader of `.hora/tasks/<version>/` can tell whose record each one is without opening it. **That is why the definition names no record**: a record's name that followed from the add-on's and were also written down could disagree with it, the day either is renamed.

**`activeWhen` is never left out.** An add-on that is to take effect whenever it is installed says so, as `"activeWhen": "always"`. A missing field is not a value: were it to mean *always*, a definition that simply forgot the field would take the strongest effect there is, and nothing reading it could tell the forgetting from the intent. The add-on's installer refuses a definition without it, or with any value but `"declared"` and `"always"`, before placing anything.

### Add-ons that are never active together

**Two add-ons that build different kinds of thing are never active for one version.** One building toward a release and one building a proof of concept, say: nothing either decides means anything to the other's product, so no precedence and no judgment could combine them.

```json
{
  "name": "beta-example-addon",
  "activeWhen": "declared",
  "exclusiveWith": ["alpha-example-addon"],
  "description": "…",
  "horaKit": "^0.10.0"
}
```

- **Naming it on one side is enough.** An add-on built later states the relation without the earlier one being changed.
- **Found at resolving, the pair stops the run, with neither add-on's wings applied**, reported as `../hora/references/structure.md`, "[wing] How to close a run", says. The way on is to take one declaration back. Which one is a decision about what the project is building, so it is the person's: no precedence set in `.hora/addon/config.json` and no judgment decides it.
- **The add-on's own skill refuses first.** It does not record a declaration while an add-on it excludes, or one that excludes it, is active for the version. Resolving is the guard behind it.
- **`exclusiveWith` may be left out**, unlike `activeWhen`. Its absence means no exclusion, which is true of most add-ons, and forgetting it grants nothing stronger than what the add-on already had.

---

## The `[wing]` sections

**A skill marks the sections an add-on may change, and only those.** A section a skill has not marked cannot be changed by any add-on.

```markdown
## [wing] Whether the run may go on past an open blocking question
## [wing] How to decide without asking
```

**The marker is `[wing]`, in the skill's own files, on a heading of any level.** Where the skill's text depends on the section, it calls it by its full heading, marker included — "stop, unless `[wing] Whether the run may go on past an open blocking question` says yes". **A reader of the calling line can then see that what follows may be changed by an add-on.**

**A marked section is a decision the skill has taken out of its text.** Where the text would have said *if even one `blocking: yes` is unresolved, stop*, it says *stop as the section says*, and the condition lives in the section. An add-on then changes the condition without touching the sentence that uses it — the way a method called by name can be redefined while its caller stays the same.

**The heading is a contract.** An add-on finds a section by its heading, so rewording one silently cuts every wing that extended it. Keep headings unique within a file.

**Renaming or removing a `[wing]` section is a breaking change to Hora Kit**, released as one: a minor version while it is below 1.0, a major one after. That is what lets an add-on's `horaKit` range mean what it says — the headings it relies on are the headings every version in the range still carries. Adding a `[wing]` section breaks nothing, and neither does changing what a section says while its heading stays.

**Two shapes of section, told apart by the heading.**

| Heading | Returns | Example |
|---|---|---|
| `Whether …` | yes or no | whether the run may go on past an open blocking question |
| `How to …` | what to do | how to decide without asking |

**A `Whether …` section is worded so that yes takes the run further** — goes on, skips, decides without waiting. Worded the other way round, an add-on that lets the run through would have to narrow and one that holds it back would have to widen, and every rule below would read backwards. The skill's own answer is often no.

---

## How a wing changes a section

**A wing's heading carries the effect it has**, after the same text the skill's heading carries. Matching is on that text, with the marker left out.

| Wing marker | Used on | Effect |
|---|---|---|
| `[wing:or]` | `Whether …` | widens: the answer is also yes where this holds |
| `[wing:and]` | `Whether …` | narrows: the answer is yes only where this holds as well |
| `[wing:replace]` | `How to …` | the skill's section is not read. This one is read instead |
| `[wing:overlay]` | `How to …` | read on top of the skill's section. Where the two disagree, the wing's text holds; the rest stays as the skill wrote it |
| `[wing:add]` | `How to …` | steps added to the skill's section, which stays whole. It never contradicts it |

- **A wing's text states no condition of its own.** Whether the add-on is active was settled by "Resolving the add-ons", above; a wing only says what changes. A condition written inside `[wing:and]` or `[wing:replace]` is the one place a forgotten *otherwise* changes the run without anyone noticing.
- **One wing file may carry both `[wing:or]` and `[wing:and]` for one heading**, and at most one of each.
- **`[wing:or]` and `[wing:and]` on a `How to …` section, or a `[wing:replace]`, `[wing:overlay]` or `[wing:add]` on a `Whether …` one, is an error.** Replacing a decision outright would undo what every other add-on's `or` and `and` said about it.
- **`[wing:replace]` is the strongest and the costliest.** The skill's section is gone for as long as the add-on is active, including every later correction the skill makes to it. Take it only where the add-on's procedure has nothing in common with the skill's.

---

## Where several add-ons reach the same section

**Every active add-on's wings are read**, and they combine.

**A `Whether …` section combines in one expression, and order never matters:**

```
answer = (the skill's section  OR  every [wing:or])  AND  every [wing:and]
```

**`and` prevails over `or`.** An exclusion one add-on states is not undone by another add-on widening the same decision. Where no add-on narrows, one add-on saying yes is enough. Most add-ons exist to let the run go further, and one that can let it through should not be held back by one that has nothing to say. An add-on that exists to hold the run back says so with `[wing:and]`, and that is what `and` prevailing is for.

**A `How to …` section combines in a fixed order:**

```
the skill's section
  -> [wing:replace]   at most one takes effect
  -> [wing:overlay]   every one, in turn
  -> [wing:add]       every one
```

`add` never conflicts, by what it is. `overlay` conflicts only where two overlays speak to the same point. `replace` conflicts whenever two add-ons both replace.

### When they conflict

**Take the first of these that decides:**

```
1. .hora/addon/config.json, where a person has put one add-on ahead of another
2. the add-on whose wing rests on what the person stated — a declaration they
   made, a line of specs/ — over one resting on the add-on's own defaults
3. the one that leaves the spec more precise, and closer to what the person
   asked for. Judge it, and record it
```

**The principle behind all three: the person gains the most.** Once nobody is being asked, an add-on decides in their place, and the decision closest to what they said they wanted is the one they would have taken. A declaration they wrote says more about that than any add-on's defaults; an add-on built to get something working at all says less than one built on the ranking they declared.

**A judgment taken under 3 is recorded as a question**, in the question file and in its format (`../hora-plan/SKILL.md`), so a person can see it and overrule it, and so a resumed run does not take it again differently.

```markdown
## Q12. Two add-ons decide differently at "[wing] How to decide without asking"
<!-- blocking: no -->
<!-- category: addon-precedence -->

alpha-example-addon's procedure was taken: it rests on the declared ranking.
beta-example-addon's rests on its own default. To settle it for good, set the
precedence with /hora-addon.

- [ ] resolved
```

**An add-on's record is committed on its own, every time a line is added to it** (`../hora/references/commits.md`).

---

## What a person says to this skill

| They say | What happens |
|---|---|
| `/hora-addon` | the add-ons installed, which are active for the current version, and the precedence set |
| put one add-on ahead of another | written to `.hora/addon/config.json`, and committed |
| check the add-ons | every wing checked against the rules above: a counterpart that exists, a `[wing]` section of the same heading in the Hora Kit installed now, a marker that fits the section's shape. Each fault listed with its file. A heading gone while the `horaKit` range still matches is reported as a fault in Hora Kit's release, not in the add-on |

### `.hora/addon/config.json`

```json
{
  "precedence": ["alpha-example-addon", "beta-example-addon"]
}
```

**Earlier in the list comes first**, wherever two add-ons conflict. An add-on missing from the list comes after every add-on on it. **A person writes it, through this skill or by hand; no installer does.** It is a record, committed like the rest of `.hora/`'s records, so everyone working on the project gets the same precedence.

---

## References

| File | Content |
|---|---|
| `../hora/references/structure.md` | the layout of `.hora/`, and why a record decides rather than the conversation |
| `../hora/references/asking.md` | what a skill asks a person, which an active add-on may change |
| `../hora/references/commits.md` | how a record under `.hora/` is committed |
| `../hora-plan/SKILL.md` | the question format, and its categories |
