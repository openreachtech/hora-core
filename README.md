# Hora Kit

The container that carries the core of Hora — the skills and agents an AI agent tool reads — to the repositories that build with it.

Everything it ships lives under a single directory, `kit/`, laid out the way an agent tool expects to find it:

```
kit/
├── agents/   subagent definitions
└── skills/   skill definitions
```

`kit/` is named after what it holds rather than after any one tool, so the same payload can be delivered to whichever agent tool a repository uses. The target documented here is Claude Code, whose configuration directory is `.claude/`.

How Hora itself works — the method this kit carries — is documented with the boilerplate: [openreachtech/hora-boilerplate](https://github.com/openreachtech/hora-boilerplate).

## Installation

Requires the current Node.js LTS (the version the CI builds against).

```sh
npm install @openreachtech/hora
```

A project created from the Hora boilerplate already declares this package as a development dependency, so `npm install` in that project brings the kit in. To add it to a project directly:

```sh
npm install --save-dev @openreachtech/hora
```

The package ships instructions for AI agents only. There is no JavaScript to import.

## Usage

Once installed, `kit/` is cloned into the project's `.claude/` — the directory an agent tool reads its skills and agents from. The boilerplate's setup does this for you. In a project set up some other way, copy it in:

```sh
mkdir -p .claude
cp -R node_modules/@openreachtech/hora/kit/. .claude/
```

`kit/agents/` lands at `.claude/agents/` and `kit/skills/` at `.claude/skills/`, which is where skill discovery looks — a package's own directory is never on that path, so the clone is what makes the kit visible. Repeat it after every upgrade of this package.

The skills are then invocable as slash commands for the rest of the session.

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
