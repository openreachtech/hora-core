import KitFrontmatterInspector from '../../../tools/KitFrontmatterInspector.js'
import KitMarkdownTree from '../../../tools/KitMarkdownTree.js'

describe('KitFrontmatterInspector', () => {
  describe('constructor', () => {
    describe('should keep property', () => {
      describe('#tree', () => {
        const alphaTree = KitMarkdownTree.create({
          rootPath: '/tmp/acme/kit',
        })
        const betaTree = KitMarkdownTree.create({
          rootPath: '/tmp/sample-app/kit',
        })

        const cases = [
          {
            input: {
              tree: alphaTree,
            },
            expected: alphaTree,
          },
          {
            input: {
              tree: betaTree,
            },
            expected: betaTree,
          },
        ]

        test.each(cases)('rootPath: $input.tree.rootPath', ({ input, expected }) => {
          const inspector = new KitFrontmatterInspector(input)

          expect(inspector)
            .toHaveProperty('tree', expected)
        })
      })
    })
  })
})

describe('KitFrontmatterInspector', () => {
  describe('.create()', () => {
    describe('should be an instance of own class', () => {
      const cases = [
        {
          input: {
            tree: KitMarkdownTree.create({
              rootPath: '/tmp/acme/kit',
            }),
          },
        },
        {
          input: {
            tree: KitMarkdownTree.create({
              rootPath: '/tmp/sample-app/kit',
            }),
          },
        },
      ]

      test.each(cases)('rootPath: $input.tree.rootPath', ({ input }) => {
        const received = KitFrontmatterInspector.create(input)

        expect(received)
          .toBeInstanceOf(KitFrontmatterInspector)
      })
    })

    describe('should call constructor', () => {
      const cases = [
        {
          tally: {
            tree: KitMarkdownTree.create({
              rootPath: '/tmp/acme/kit',
            }),
          },
        },
        {
          tally: {
            tree: KitMarkdownTree.create({
              rootPath: '/tmp/sample-app/kit',
            }),
          },
        },
      ]

      test.each(cases)('rootPath: $tally.tree.rootPath', ({ tally }) => {
        const SpyClass = constructorSpy.spyOn(KitFrontmatterInspector)

        SpyClass.create(tally)

        expect(SpyClass.__spy__)
          .toHaveBeenCalledWith(tally)
      })
    })
  })
})

describe('KitFrontmatterInspector', () => {
  describe('.get:keysHash', () => {
    describe('when called as is', () => {
      test('should be fixed value', () => {
        const expected = {
          skill: [
            'name',
            'description',
            'when_to_use',
            'argument-hint',
            'arguments',
            'disable-model-invocation',
            'user-invocable',
            'allowed-tools',
            'disallowed-tools',
            'model',
            'effort',
            'context',
            'agent',
            'background',
            'hooks',
            'paths',
            'shell',
            'metadata',
            'license',
            'compatibility',
          ],
          agent: [
            'name',
            'description',
            'tools',
            'disallowedTools',
            'model',
            'permissionMode',
            'maxTurns',
            'skills',
            'mcpServers',
            'hooks',
            'memory',
            'background',
            'omitClaudeMd',
            'effort',
            'isolation',
            'color',
            'initialPrompt',
            'experimental',
          ],
        }

        const received = KitFrontmatterInspector.keysHash

        expect(received)
          .toEqual(expected)
      })
    })
  })
})

describe('KitFrontmatterInspector', () => {
  describe('.get:requiredKeys', () => {
    describe('when called as is', () => {
      test('should be fixed value', () => {
        const received = KitFrontmatterInspector.requiredKeys

        expect(received)
          .toEqual([
            'name',
            'description',
          ])
      })
    })
  })
})

describe('KitFrontmatterInspector', () => {
  describe('#get:Ctor', () => {
    class AlphaKitFrontmatterInspector extends KitFrontmatterInspector {}

    class BetaKitFrontmatterInspector extends KitFrontmatterInspector {}

    describe('should be constructor of instance', () => {
      const cases = [
        {
          input: {
            Inspector: KitFrontmatterInspector,
          },
          expected: KitFrontmatterInspector,
        },
        {
          input: {
            Inspector: AlphaKitFrontmatterInspector,
          },
          expected: AlphaKitFrontmatterInspector,
        },
        {
          input: {
            Inspector: BetaKitFrontmatterInspector,
          },
          expected: BetaKitFrontmatterInspector,
        },
      ]

      test.each(cases)('Inspector: $input.Inspector.name', ({ input, expected }) => {
        const inspector = input.Inspector.create({
          tree: KitMarkdownTree.create({
            rootPath: '/tmp/acme/kit',
          }),
        })

        const received = inspector.Ctor

        expect(received)
          .toBe(expected) // same reference
      })
    })
  })
})

describe('KitFrontmatterInspector', () => {
  describe('#collectViolations()', () => {
    describe('should collect the violations of every skill and agent, by file', () => {
      const cases = [
        {
          override: {
            relativePaths: [
              'agents/beta.md',
              'skills/alpha/SKILL.md',
              'skills/alpha/references/notes.md',
            ],
            contentHash: {
              'agents/beta.md': '---\nname: beta\ndescription: Verify one checkpoint.\ntool: Read\n---\n',
              'skills/alpha/SKILL.md': '---\nname: alpha\n---\n',
              'skills/alpha/references/notes.md': '# Notes\n',
            },
          },
          input: {
            rootPath: '/tmp/acme/kit',
          },
          expected: [
            {
              relativePath: 'agents/beta.md',
              violation: 'unknown key: tool',
            },
            {
              relativePath: 'skills/alpha/SKILL.md',
              violation: 'missing key: description',
            },
          ],
        },
        {
          override: {
            relativePaths: [
              'skills/gamma/SKILL.md',
            ],
            contentHash: {
              'skills/gamma/SKILL.md': '---\nname: gamma\ndescription: Build one feature.\n---\n',
            },
          },
          input: {
            rootPath: '/tmp/sample-app/kit',
          },
          expected: [],
        },
      ]

      test.each(cases)('rootPath: $input.rootPath', ({ override, input, expected }) => {
        const tree = KitMarkdownTree.create(input)
        const inspector = KitFrontmatterInspector.create({
          tree,
        })

        jest.spyOn(tree, 'listRelativePaths')
          .mockReturnValue(override.relativePaths)
        jest.spyOn(tree, 'readContent')
          .mockImplementation(({ relativePath }) => override.contentHash[relativePath])

        const received = inspector.collectViolations()

        expect(received)
          .toEqual(expected)
      })
    })
  })
})

describe('KitFrontmatterInspector', () => {
  describe('#inspectFile()', () => {
    describe('should inspect a skill or an agent', () => {
      const cases = [
        {
          override: {
            content: '# Alpha\n',
          },
          input: {
            relativePath: 'skills/alpha/SKILL.md',
          },
          expected: [
            'no frontmatter between two --- lines',
          ],
        },
        {
          override: {
            content: '---\nname: Beta\ndescription: Verify one checkpoint.\n---\n',
          },
          input: {
            relativePath: 'agents/beta.md',
          },
          expected: [
            'name is not 1 to 64 lowercase letters, digits or hyphens: Beta',
          ],
        },
      ]

      test.each(cases)('relativePath: $input.relativePath', ({ override, input, expected }) => {
        const tree = KitMarkdownTree.create({
          rootPath: '/tmp/acme/kit',
        })
        const inspector = KitFrontmatterInspector.create({
          tree,
        })

        jest.spyOn(tree, 'readContent')
          .mockReturnValue(override.content)

        const received = inspector.inspectFile(input)

        expect(received)
          .toEqual(expected)
      })
    })

    describe('should pass over a file that needs no frontmatter, unread', () => {
      const cases = [
        {
          input: {
            relativePath: 'skills/alpha/references/notes.md',
          },
        },
        {
          input: {
            relativePath: 'README.md',
          },
        },
      ]

      test.each(cases)('relativePath: $input.relativePath', ({ input }) => {
        const tree = KitMarkdownTree.create({
          rootPath: '/tmp/acme/kit',
        })
        const inspector = KitFrontmatterInspector.create({
          tree,
        })

        const readContentSpy = jest.spyOn(tree, 'readContent')
          .mockReturnValue('# Notes\n')

        const received = inspector.inspectFile(input)

        expect(received)
          .toEqual([])
        expect(readContentSpy)
          .not
          .toHaveBeenCalled()
      })
    })
  })
})

describe('KitFrontmatterInspector', () => {
  describe('#detectKind()', () => {
    describe('should detect a skill or an agent by its path', () => {
      const cases = [
        {
          input: {
            relativePath: 'skills/hora-plan/SKILL.md',
          },
          expected: 'skill',
        },
        {
          input: {
            relativePath: 'skills/alpha/SKILL.md',
          },
          expected: 'skill',
        },
        {
          input: {
            relativePath: 'agents/hora-verifier.md',
          },
          expected: 'agent',
        },
        {
          input: {
            relativePath: 'agents/beta.md',
          },
          expected: 'agent',
        },
      ]

      test.each(cases)('relativePath: $input.relativePath', ({ input, expected }) => {
        const inspector = KitFrontmatterInspector.create({
          tree: KitMarkdownTree.create({
            rootPath: '/tmp/acme/kit',
          }),
        })

        const received = inspector.detectKind(input)

        expect(received)
          .toBe(expected)
      })
    })

    describe('should be null for any other file', () => {
      const cases = [
        {
          input: {
            relativePath: 'skills/alpha/references/SKILL.md',
          },
        },
        {
          input: {
            relativePath: 'skills/alpha/notes.md',
          },
        },
        {
          input: {
            relativePath: 'agents/beta/notes.md',
          },
        },
      ]

      test.each(cases)('relativePath: $input.relativePath', ({ input }) => {
        const inspector = KitFrontmatterInspector.create({
          tree: KitMarkdownTree.create({
            rootPath: '/tmp/acme/kit',
          }),
        })

        const received = inspector.detectKind(input)

        expect(received)
          .toBeNull()
      })
    })
  })
})

describe('KitFrontmatterInspector', () => {
  describe('#extractFrontmatterLines()', () => {
    describe('should extract the lines between the two --- lines', () => {
      const cases = [
        {
          input: {
            content: '---\nname: alpha\ndescription: Plan one version.\n---\n# Alpha\n---\n',
          },
          expected: [
            'name: alpha',
            'description: Plan one version.',
          ],
        },
        {
          input: {
            content: '---\n---\n',
          },
          expected: [],
        },
      ]

      test.each(cases)('content: $input.content', ({ input, expected }) => {
        const inspector = KitFrontmatterInspector.create({
          tree: KitMarkdownTree.create({
            rootPath: '/tmp/acme/kit',
          }),
        })

        const received = inspector.extractFrontmatterLines(input)

        expect(received)
          .toEqual(expected)
      })
    })

    describe('should be null without an opening or a closing --- line', () => {
      const cases = [
        {
          input: {
            content: '# Alpha\n---\nname: alpha\n---\n',
          },
        },
        {
          input: {
            content: '---\nname: alpha\n',
          },
        },
      ]

      test.each(cases)('content: $input.content', ({ input }) => {
        const inspector = KitFrontmatterInspector.create({
          tree: KitMarkdownTree.create({
            rootPath: '/tmp/acme/kit',
          }),
        })

        const received = inspector.extractFrontmatterLines(input)

        expect(received)
          .toBeNull()
      })
    })
  })
})

describe('KitFrontmatterInspector', () => {
  describe('#inspectFrontmatter()', () => {
    describe('should report missing frontmatter', () => {
      const cases = [
        {
          input: {
            kind: 'skill',
            lines: null,
          },
        },
        {
          input: {
            kind: 'agent',
            lines: null,
          },
        },
      ]

      test.each(cases)('kind: $input.kind', ({ input }) => {
        const inspector = KitFrontmatterInspector.create({
          tree: KitMarkdownTree.create({
            rootPath: '/tmp/acme/kit',
          }),
        })

        const received = inspector.inspectFrontmatter(input)

        expect(received)
          .toEqual([
            'no frontmatter between two --- lines',
          ])
      })
    })

    describe('should report line violations, then missing keys', () => {
      const cases = [
        {
          input: {
            kind: 'skill',
            lines: [
              'name: alpha',
              'tools: Read',
            ],
          },
          expected: [
            'unknown key: tools',
            'missing key: description',
          ],
        },
        {
          input: {
            kind: 'agent',
            lines: [
              'description: Verify one checkpoint.',
              'tools: Read, Grep',
            ],
          },
          expected: [
            'missing key: name',
          ],
        },
        {
          input: {
            kind: 'agent',
            lines: [],
          },
          expected: [
            'missing key: name',
            'missing key: description',
          ],
        },
      ]

      test.each(cases)('kind: $input.kind, lines: $input.lines', ({ input, expected }) => {
        const inspector = KitFrontmatterInspector.create({
          tree: KitMarkdownTree.create({
            rootPath: '/tmp/acme/kit',
          }),
        })

        const received = inspector.inspectFrontmatter(input)

        expect(received)
          .toEqual(expected)
      })
    })
  })
})

describe('KitFrontmatterInspector', () => {
  describe('#inspectLine()', () => {
    describe('should report a line that is not key: value', () => {
      const cases = [
        {
          input: {
            kind: 'skill',
            line: '  - Read',
          },
          expected: [
            'not a key: value line:   - Read',
          ],
        },
        {
          input: {
            kind: 'agent',
            line: 'name:beta',
          },
          expected: [
            'not a key: value line: name:beta',
          ],
        },
      ]

      test.each(cases)('line: $input.line', ({ input, expected }) => {
        const inspector = KitFrontmatterInspector.create({
          tree: KitMarkdownTree.create({
            rootPath: '/tmp/acme/kit',
          }),
        })

        const received = inspector.inspectLine(input)

        expect(received)
          .toEqual(expected)
      })
    })

    describe('should report a key the file kind does not document', () => {
      const cases = [
        {
          input: {
            kind: 'skill',
            line: 'tools: Read',
          },
          expected: [
            'unknown key: tools',
          ],
        },
        {
          input: {
            kind: 'agent',
            line: 'allowed-tools: Read',
          },
          expected: [
            'unknown key: allowed-tools',
          ],
        },
        {
          input: {
            kind: 'skill',
            line: 'disable-model-invokation: true',
          },
          expected: [
            'unknown key: disable-model-invokation',
          ],
        },
      ]

      test.each(cases)('kind: $input.kind, line: $input.line', ({ input, expected }) => {
        const inspector = KitFrontmatterInspector.create({
          tree: KitMarkdownTree.create({
            rootPath: '/tmp/acme/kit',
          }),
        })

        const received = inspector.inspectLine(input)

        expect(received)
          .toEqual(expected)
      })
    })

    describe('should inspect the value of a documented key', () => {
      const cases = [
        {
          input: {
            kind: 'skill',
            line: 'description: Plan: one version.',
          },
          expected: [
            'description holds ": ", which YAML reads as a nested mapping',
          ],
        },
        {
          input: {
            kind: 'agent',
            line: 'name: Beta',
          },
          expected: [
            'name is not 1 to 64 lowercase letters, digits or hyphens: Beta',
          ],
        },
        {
          input: {
            kind: 'agent',
            line: 'tools: Read, Grep',
          },
          expected: [],
        },
      ]

      test.each(cases)('kind: $input.kind, line: $input.line', ({ input, expected }) => {
        const inspector = KitFrontmatterInspector.create({
          tree: KitMarkdownTree.create({
            rootPath: '/tmp/acme/kit',
          }),
        })

        const received = inspector.inspectLine(input)

        expect(received)
          .toEqual(expected)
      })
    })

    describe('should inspect a quoted value without its quotes', () => {
      const cases = [
        {
          input: {
            kind: 'skill',
            line: 'name: "alpha"',
          },
          expected: [],
        },
        {
          input: {
            kind: 'agent',
            line: 'description: \'\'',
          },
          expected: [
            'description is empty',
          ],
        },
      ]

      test.each(cases)('kind: $input.kind, line: $input.line', ({ input, expected }) => {
        const inspector = KitFrontmatterInspector.create({
          tree: KitMarkdownTree.create({
            rootPath: '/tmp/acme/kit',
          }),
        })

        const received = inspector.inspectLine(input)

        expect(received)
          .toEqual(expected)
      })
    })
  })
})

describe('KitFrontmatterInspector', () => {
  describe('#inspectPlainScalar()', () => {
    describe('should report text YAML reads as syntax', () => {
      const cases = [
        {
          input: {
            key: 'description',
            value: 'Plan one version: the features and their order.',
          },
          expected: [
            'description holds ": ", which YAML reads as a nested mapping',
          ],
        },
        {
          input: {
            key: 'description',
            value: 'Build feature #3 then #4 #later',
          },
          expected: [
            'description holds " #", which YAML reads as a comment',
          ],
        },
        {
          input: {
            key: 'tools',
            value: '*Read',
          },
          expected: [
            'tools starts with a YAML indicator: *',
          ],
        },
        {
          input: {
            key: 'description',
            value: '- Plan: one version #later',
          },
          expected: [
            'description starts with a YAML indicator: -',
            'description holds ": ", which YAML reads as a nested mapping',
            'description holds " #", which YAML reads as a comment',
          ],
        },
      ]

      test.each(cases)('value: $input.value', ({ input, expected }) => {
        const inspector = KitFrontmatterInspector.create({
          tree: KitMarkdownTree.create({
            rootPath: '/tmp/acme/kit',
          }),
        })

        const received = inspector.inspectPlainScalar(input)

        expect(received)
          .toEqual(expected)
      })
    })

    describe('should accept text YAML reads as a plain string', () => {
      const cases = [
        {
          input: {
            key: 'description',
            value: 'Verify one checkpoint \u2014 read-only, never fixes code. Called by /hora-build.',
          },
        },
        {
          input: {
            key: 'name',
            value: '-alpha',
          },
        },
        {
          input: {
            key: 'description',
            value: 'Build feature#3 at 10:30.',
          },
        },
        {
          input: {
            key: 'description',
            value: '"Plan: one version #later"',
          },
        },
      ]

      test.each(cases)('value: $input.value', ({ input }) => {
        const inspector = KitFrontmatterInspector.create({
          tree: KitMarkdownTree.create({
            rootPath: '/tmp/acme/kit',
          }),
        })

        const received = inspector.inspectPlainScalar(input)

        expect(received)
          .toEqual([])
      })
    })
  })
})

describe('KitFrontmatterInspector', () => {
  describe('#inspectValue()', () => {
    describe('should hold name to lowercase letters, digits and hyphens', () => {
      const cases = [
        {
          input: {
            kind: 'skill',
            key: 'name',
            value: 'hora_plan',
          },
          expected: [
            'name is not 1 to 64 lowercase letters, digits or hyphens: hora_plan',
          ],
        },
        {
          input: {
            kind: 'agent',
            key: 'name',
            value: '',
          },
          expected: [
            'name is not 1 to 64 lowercase letters, digits or hyphens: ',
          ],
        },
        {
          input: {
            kind: 'skill',
            key: 'name',
            value: 'a'.repeat(65),
          },
          expected: [
            `name is not 1 to 64 lowercase letters, digits or hyphens: ${'a'.repeat(65)}`,
          ],
        },
        {
          input: {
            kind: 'agent',
            key: 'name',
            value: 'hora-verifier-2',
          },
          expected: [],
        },
      ]

      test.each(cases)('kind: $input.kind, value: $input.value', ({ input, expected }) => {
        const inspector = KitFrontmatterInspector.create({
          tree: KitMarkdownTree.create({
            rootPath: '/tmp/acme/kit',
          }),
        })

        const received = inspector.inspectValue(input)

        expect(received)
          .toEqual(expected)
      })
    })

    describe('should hold a skill description to the Agent Skills limits', () => {
      const cases = [
        {
          input: {
            kind: 'skill',
            key: 'description',
            value: 'x'.repeat(1025),
          },
          expected: [
            'description runs 1025 characters, over 1024',
          ],
        },
        {
          input: {
            kind: 'skill',
            key: 'description',
            value: 'Write .hora/digests/<skill-name>.md.',
          },
          expected: [
            'description holds an angle bracket',
          ],
        },
        {
          input: {
            kind: 'skill',
            key: 'description',
            value: '',
          },
          expected: [
            'description is empty',
          ],
        },
        {
          input: {
            kind: 'skill',
            key: 'description',
            value: 'x'.repeat(1024),
          },
          expected: [],
        },
      ]

      test.each(cases)('value length: $input.value.length', ({ input, expected }) => {
        const inspector = KitFrontmatterInspector.create({
          tree: KitMarkdownTree.create({
            rootPath: '/tmp/acme/kit',
          }),
        })

        const received = inspector.inspectValue(input)

        expect(received)
          .toEqual(expected)
      })
    })

    describe('should hold an agent description only to being present', () => {
      const cases = [
        {
          input: {
            kind: 'agent',
            key: 'description',
            value: 'Write .hora/digests/<skill-name>.md.',
          },
          expected: [],
        },
        {
          input: {
            kind: 'agent',
            key: 'description',
            value: 'x'.repeat(1025),
          },
          expected: [],
        },
        {
          input: {
            kind: 'agent',
            key: 'description',
            value: '',
          },
          expected: [
            'description is empty',
          ],
        },
      ]

      test.each(cases)('value length: $input.value.length', ({ input, expected }) => {
        const inspector = KitFrontmatterInspector.create({
          tree: KitMarkdownTree.create({
            rootPath: '/tmp/acme/kit',
          }),
        })

        const received = inspector.inspectValue(input)

        expect(received)
          .toEqual(expected)
      })
    })

    describe('should hold a model to an alias, a full model ID or inherit', () => {
      const cases = [
        {
          input: {
            kind: 'agent',
            key: 'model',
            value: 'sonnet',
          },
          expected: [],
        },
        {
          input: {
            kind: 'agent',
            key: 'model',
            value: 'inherit',
          },
          expected: [],
        },
        {
          input: {
            kind: 'skill',
            key: 'model',
            value: 'claude-sonnet-5',
          },
          expected: [],
        },
        {
          input: {
            kind: 'agent',
            key: 'model',
            value: 'sonet',
          },
          expected: [
            'model is not an alias, a full model ID or inherit: sonet',
          ],
        },
        {
          input: {
            kind: 'agent',
            key: 'model',
            value: 'Sonnet',
          },
          expected: [
            'model is not an alias, a full model ID or inherit: Sonnet',
          ],
        },
      ]

      test.each(cases)('kind: $input.kind, value: $input.value', ({ input, expected }) => {
        const inspector = KitFrontmatterInspector.create({
          tree: KitMarkdownTree.create({
            rootPath: '/tmp/acme/kit',
          }),
        })

        const received = inspector.inspectValue(input)

        expect(received)
          .toEqual(expected)
      })
    })

    describe('should pass over any other key', () => {
      const cases = [
        {
          input: {
            kind: 'agent',
            key: 'tools',
            value: '<Read>',
          },
        },
        {
          input: {
            kind: 'skill',
            key: 'argument-hint',
            value: '',
          },
        },
      ]

      test.each(cases)('kind: $input.kind, key: $input.key', ({ input }) => {
        const inspector = KitFrontmatterInspector.create({
          tree: KitMarkdownTree.create({
            rootPath: '/tmp/acme/kit',
          }),
        })

        const received = inspector.inspectValue(input)

        expect(received)
          .toEqual([])
      })
    })
  })
})
