# Hora Kit

The container that carries the core of Hora — the skills and agents an AI agent tool reads — to the repositories that build with it.

Everything it ships lives under a single directory, `kit/`, laid out the way an agent tool expects to find it:

```
kit/
├── agents/   subagent definitions
└── skills/   skill definitions
```

`kit/` is named after what it holds rather than after any one tool, so the same payload can be delivered to whichever agent tool a repository uses. The target documented here is Claude Code, whose configuration directory is `.claude/`.

What npm publishes is `dist/`, built from `kit/` on every pack. The two trees are identical, so the layout above is also the layout of the installed package.

Alongside it the package carries one executable, and its only job is to place that payload into a repository. There is nothing here to `import`.

How Hora itself works — the method this kit carries — is documented with the boilerplate: [openreachtech/hora-boilerplate](https://github.com/openreachtech/hora-boilerplate).

## Installation

Requires Node.js 20.0.0 or newer, the floor `engines` declares. The CI builds against the current LTS.

```sh
npm install -D @openreachtech/hora
```

This package ships no install script of its own, so adding it as a dependency installs the package and places nothing. Declare the command as your own project's `postinstall`, and `npm install` alone equips the repository:

```json
{
  "scripts": {
    "postinstall": "hora-core install"
  }
}
```

A project's own scripts are outside what npm holds back from v12 on, so this asks nothing of whoever clones the repository. `npx` is not needed here either: a lifecycle script runs with `node_modules/.bin` on its PATH.

The hook you just declared takes effect from the next `npm install` on, so run the command by hand for the first placement — and for a one-off, or a repository that is not yours to add a hook to:

```sh
npx --no hora-core install
```

**`--no` stops npx before it downloads**: the name is still resolved against the registry, but nothing is fetched, so neither the install script nor the bin of a stranger's package ever runs. Without it, a bin that is not installed becomes a fetch of whatever has been published under `hora-core`, an unscoped name this package does not hold.

## Usage

The kit lands in your repository's `.claude/`, the directory an agent tool reads from — `dist/agents/` at `.claude/agents/`, `dist/skills/` at `.claude/skills/`. A package's own directory is never on that path, so this clone is what makes the kit visible. The skills are then invocable as slash commands, `/hora`, `/hora-plan`, `/hora-build`.

Every directory of `dist/` is carried into the directory of the same name, and what that directory already holds is left in place. A skill your own repository authored sits beside the installed ones, untouched, as long as its name is not one this package distributes.

### Directories, not links

`.claude/`, and the payload directories inside it, have to be directories of your repository rather than symbolic links. An installation verifies every step it is reached through, and finding a link at any of them it writes nothing and removes nothing. `.hora/equip-core.json`, the record of what was installed, is verified the same way: a link there would send the write to whatever it stands for and overwrite it.

An installation that carries nothing says why and ends with a failing exit code. Where the command runs as your project's own `postinstall`, that is what `npm install` reports; run on its own, `npx --no hora-core install` tells you the same.

A link is content of the repository rather than an instruction of whoever runs the command, so following one would let the repository decide where entries are written and, worse, where the entries of the previous run are removed from.

Where `.claude/` as a whole points at a directory shared between repositories, name that directory instead — `npx --no hora-core install --dir <the directory it resolves to>` reaches the same state, and the link still makes the kit visible at `.claude/`. Where a single payload directory is the link, no arrangement installs into it: `--dir` names the directory holding the payloads, never one of them. Replace it with a directory of its own.

### Keeping the installation current

The installed kit is this package's build output rather than source of your repository, so ignore it, and name your own back in:

```gitignore
.claude/agents/*
.claude/skills/*
!.claude/skills/my-own-skill/
.hora/
```

Matching on the whole directory rather than on a name prefix is deliberate: what this package distributes changes with every release, and a pattern written against today's names goes stale without saying so.

An `npm install` with no arguments re-runs your project's `postinstall`, so the kit follows along. Naming the package on the command line — `npm install @openreachtech/hora@latest` — does not, and neither does a repository without a hook. Run the command again yourself:

```sh
npx --no hora-core install
```

`install` is repeatable: it removes what the previous run installed — recorded in `.hora/equip-core.json` — along with anything named after an entry this package distributes, before copying the current kit. A renamed or dropped skill therefore leaves nothing behind, and a repository that had copied `dist/` by hand is tidied up on its first run.

### Commands

| Command | What it does |
| :-- | :-- |
| `hora-core install` | Install the kit, replacing what the previous run installed |
| `hora-core list` | Print the entries the kit installs, installing nothing |
| `hora-core uninstall` | Remove every entry this package installed, along with the manifest |
| `hora-core help` | Print the usage text |

`--dir <path>` installs into a directory other than `.claude`.

## Contribution

Bug reports, feature requests, and code contributions are welcome.

Feel free to contact us through GitHub Issues.

```sh
git clone https://github.com/openreachtech/hora-core.git
cd hora-core
npm install
npm run lint
npm test
```

## License

This project is released under the Apache License 2.0.

For more details, please see [in the LICENSE file](./LICENSE).

## Developer

[Open Reach Tech Inc.](https://openreach.tech)

## Copyright

© 2026 Open Reach Tech Inc.
