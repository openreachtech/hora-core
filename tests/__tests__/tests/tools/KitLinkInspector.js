import KitLinkInspector from '../../../tools/KitLinkInspector.js'
import KitMarkdownTree from '../../../tools/KitMarkdownTree.js'

describe('KitLinkInspector', () => {
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
          const inspector = new KitLinkInspector(input)

          expect(inspector)
            .toHaveProperty('tree', expected)
        })
      })
    })
  })
})

describe('KitLinkInspector', () => {
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
        const received = KitLinkInspector.create(input)

        expect(received)
          .toBeInstanceOf(KitLinkInspector)
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
        const SpyClass = constructorSpy.spyOn(KitLinkInspector)

        SpyClass.create(tally)

        expect(SpyClass.__spy__)
          .toHaveBeenCalledWith(tally)
      })
    })
  })
})

describe('KitLinkInspector', () => {
  describe('#collectUnresolvedLinks()', () => {
    describe('should collect missing targets and targets outside the kit', () => {
      const cases = [
        {
          override: {
            relativePaths: [
              'agents/delta.md',
              'skills/alpha/SKILL.md',
            ],
            contentHash: {
              'agents/delta.md': 'See [the docs](../../docs/README.md).\n',
              'skills/alpha/SKILL.md': '# Alpha\n\nRead [beta](../beta/SKILL.md).\n\nThen `../gamma/SKILL.md`.\n',
            },
            existingPaths: [
              '/tmp/acme/docs/README.md',
              '/tmp/acme/kit/skills/beta/SKILL.md',
            ],
          },
          input: {
            rootPath: '/tmp/acme/kit',
          },
          expected: [
            {
              relativePath: 'agents/delta.md',
              lineNumber: 1,
              target: '../../docs/README.md',
            },
            {
              relativePath: 'skills/alpha/SKILL.md',
              lineNumber: 5,
              target: '../gamma/SKILL.md',
            },
          ],
        },
        {
          override: {
            relativePaths: [
              'skills/eta/SKILL.md',
            ],
            contentHash: {
              'skills/eta/SKILL.md': 'Read `./references/format.md#sources`.\n',
            },
            existingPaths: [
              '/tmp/sample-app/kit/skills/eta/references/format.md',
            ],
          },
          input: {
            rootPath: '/tmp/sample-app/kit',
          },
          expected: [],
        },
      ]

      test.each(cases)('rootPath: $input.rootPath', ({ override, input, expected }) => {
        const tree = KitMarkdownTree.create(input)
        const inspector = KitLinkInspector.create({
          tree,
        })

        jest.spyOn(tree, 'listRelativePaths')
          .mockReturnValue(override.relativePaths)
        jest.spyOn(tree, 'readContent')
          .mockImplementation(({ relativePath }) => override.contentHash[relativePath])
        jest.spyOn(tree, 'exists')
          .mockImplementation(({ absolutePath }) => override.existingPaths.includes(absolutePath))

        const received = inspector.collectUnresolvedLinks()

        expect(received)
          .toEqual(expected)
      })
    })
  })
})

describe('KitLinkInspector', () => {
  describe('#extractLinks()', () => {
    describe('should extract relative Markdown links and backticked Markdown paths', () => {
      const cases = [
        {
          input: {
            content: 'Read `../hora/references/asking.md` first, then [the verifier](../../agents/hora-verifier.md).\n',
          },
          expected: [
            {
              lineNumber: 1,
              target: '../hora/references/asking.md',
            },
            {
              lineNumber: 1,
              target: '../../agents/hora-verifier.md',
            },
          ],
        },
        {
          input: {
            content: '# Title\n\n[format](./references/format.md#sources)\n`./notes.md#step-5`\n',
          },
          expected: [
            {
              lineNumber: 3,
              target: './references/format.md#sources',
            },
            {
              lineNumber: 4,
              target: './notes.md#step-5',
            },
          ],
        },
      ]

      test.each(cases)('content: $input.content', ({ input, expected }) => {
        const inspector = KitLinkInspector.create({
          tree: KitMarkdownTree.create({
            rootPath: '/tmp/acme/kit',
          }),
        })

        const received = inspector.extractLinks(input)

        expect(received)
          .toEqual(expected)
      })
    })

    describe('should pass over links inside fenced code blocks', () => {
      const cases = [
        {
          input: {
            content: '```markdown\n[overview](./spec/00-overview.md)\n```\n[real](./real.md)\n',
          },
          expected: [
            {
              lineNumber: 4,
              target: './real.md',
            },
          ],
        },
        {
          input: {
            content: '~~~\n`../example.md`\n~~~\n',
          },
          expected: [],
        },
      ]

      test.each(cases)('content: $input.content', ({ input, expected }) => {
        const inspector = KitLinkInspector.create({
          tree: KitMarkdownTree.create({
            rootPath: '/tmp/acme/kit',
          }),
        })

        const received = inspector.extractLinks(input)

        expect(received)
          .toEqual(expected)
      })
    })

    describe('should pass over absolute URLs, project paths and backticked non-Markdown paths', () => {
      const cases = [
        {
          input: {
            content: 'See [the site](https://example.com/docs) and `specs/skeleton/spec.md`.\n',
          },
        },
        {
          input: {
            content: 'Run `./scripts/build.sh`, then open [a heading](#where-it-runs).\n',
          },
        },
      ]

      test.each(cases)('content: $input.content', ({ input }) => {
        const inspector = KitLinkInspector.create({
          tree: KitMarkdownTree.create({
            rootPath: '/tmp/acme/kit',
          }),
        })

        const received = inspector.extractLinks(input)

        expect(received)
          .toEqual([])
      })
    })
  })
})

describe('KitLinkInspector', () => {
  describe('#extractProseLines()', () => {
    describe('should keep the lines outside fences, numbered from 1', () => {
      const cases = [
        {
          input: {
            content: 'alpha\n```\ncode\n```\nbeta',
          },
          expected: [
            {
              line: 'alpha',
              lineNumber: 1,
            },
            {
              line: 'beta',
              lineNumber: 5,
            },
          ],
        },
        {
          input: {
            content: '````markdown\n```\nnested\n```\n````\ngamma\n  ~~~\ntilde\n  ~~~',
          },
          expected: [
            {
              line: 'gamma',
              lineNumber: 6,
            },
          ],
        },
      ]

      test.each(cases)('content: $input.content', ({ input, expected }) => {
        const inspector = KitLinkInspector.create({
          tree: KitMarkdownTree.create({
            rootPath: '/tmp/acme/kit',
          }),
        })

        const received = inspector.extractProseLines(input)

        expect(received)
          .toEqual(expected)
      })
    })
  })
})

describe('KitLinkInspector', () => {
  describe('#advanceFenceState()', () => {
    describe('should keep a prose line outside a fence', () => {
      const cases = [
        {
          input: {
            state: {
              openFence: null,
              proseLines: [],
            },
            line: 'alpha',
            lineNumber: 1,
          },
          expected: {
            openFence: null,
            proseLines: [
              {
                line: 'alpha',
                lineNumber: 1,
              },
            ],
          },
        },
        {
          input: {
            state: {
              openFence: null,
              proseLines: [
                {
                  line: 'alpha',
                  lineNumber: 1,
                },
              ],
            },
            line: 'beta ``inline`` code',
            lineNumber: 4,
          },
          expected: {
            openFence: null,
            proseLines: [
              {
                line: 'alpha',
                lineNumber: 1,
              },
              {
                line: 'beta ``inline`` code',
                lineNumber: 4,
              },
            ],
          },
        },
      ]

      test.each(cases)('line: $input.line', ({ input, expected }) => {
        const inspector = KitLinkInspector.create({
          tree: KitMarkdownTree.create({
            rootPath: '/tmp/acme/kit',
          }),
        })

        const received = inspector.advanceFenceState(input)

        expect(received)
          .toEqual(expected)
      })
    })

    describe('should open a fence on its opening line', () => {
      const cases = [
        {
          input: {
            state: {
              openFence: null,
              proseLines: [],
            },
            line: '```markdown',
            lineNumber: 2,
          },
          expected: {
            openFence: '```',
            proseLines: [],
          },
        },
        {
          input: {
            state: {
              openFence: null,
              proseLines: [],
            },
            line: '  ~~~~',
            lineNumber: 7,
          },
          expected: {
            openFence: '~~~~',
            proseLines: [],
          },
        },
      ]

      test.each(cases)('line: $input.line', ({ input, expected }) => {
        const inspector = KitLinkInspector.create({
          tree: KitMarkdownTree.create({
            rootPath: '/tmp/acme/kit',
          }),
        })

        const received = inspector.advanceFenceState(input)

        expect(received)
          .toEqual(expected)
      })
    })

    describe('should close a fence only on a matching line at least as long', () => {
      const cases = [
        {
          input: {
            state: {
              openFence: '```',
              proseLines: [],
            },
            line: '````',
            lineNumber: 3,
          },
          expected: {
            openFence: null,
            proseLines: [],
          },
        },
        {
          input: {
            state: {
              openFence: '````',
              proseLines: [],
            },
            line: '```',
            lineNumber: 3,
          },
          expected: {
            openFence: '````',
            proseLines: [],
          },
        },
        {
          input: {
            state: {
              openFence: '~~~',
              proseLines: [],
            },
            line: '```',
            lineNumber: 3,
          },
          expected: {
            openFence: '~~~',
            proseLines: [],
          },
        },
        {
          input: {
            state: {
              openFence: '```',
              proseLines: [],
            },
            line: '[example](./example.md)',
            lineNumber: 3,
          },
          expected: {
            openFence: '```',
            proseLines: [],
          },
        },
      ]

      test.each(cases)('openFence: $input.state.openFence, line: $input.line', ({ input, expected }) => {
        const inspector = KitLinkInspector.create({
          tree: KitMarkdownTree.create({
            rootPath: '/tmp/acme/kit',
          }),
        })

        const received = inspector.advanceFenceState(input)

        expect(received)
          .toEqual(expected)
      })
    })
  })
})

describe('KitLinkInspector', () => {
  describe('#isResolved()', () => {
    describe('should be true for an existing path inside the kit', () => {
      const cases = [
        {
          input: {
            rootPath: '/tmp/acme/kit',
            relativePath: 'skills/alpha/SKILL.md',
            target: '../beta/SKILL.md',
          },
        },
        {
          input: {
            rootPath: '/tmp/sample-app/kit',
            relativePath: 'agents/gamma.md',
            target: '../skills/delta/SKILL.md#step-5',
          },
        },
      ]

      test.each(cases)('target: $input.target', ({ input }) => {
        const tree = KitMarkdownTree.create({
          rootPath: input.rootPath,
        })
        const inspector = KitLinkInspector.create({
          tree,
        })

        jest.spyOn(tree, 'exists')
          .mockReturnValue(true)

        const received = inspector.isResolved({
          relativePath: input.relativePath,
          target: input.target,
        })

        expect(received)
          .toBe(true)
      })
    })

    describe('should be false for a missing path', () => {
      const cases = [
        {
          input: {
            rootPath: '/tmp/acme/kit',
            relativePath: 'skills/alpha/SKILL.md',
            target: '../missing/SKILL.md',
          },
        },
        {
          input: {
            rootPath: '/tmp/sample-app/kit',
            relativePath: 'agents/gamma.md',
            target: './missing.md',
          },
        },
      ]

      test.each(cases)('target: $input.target', ({ input }) => {
        const tree = KitMarkdownTree.create({
          rootPath: input.rootPath,
        })
        const inspector = KitLinkInspector.create({
          tree,
        })

        jest.spyOn(tree, 'exists')
          .mockReturnValue(false)

        const received = inspector.isResolved({
          relativePath: input.relativePath,
          target: input.target,
        })

        expect(received)
          .toBe(false)
      })
    })

    describe('should be false for an existing path outside the kit', () => {
      const cases = [
        {
          input: {
            rootPath: '/tmp/acme/kit',
            relativePath: 'skills/alpha/SKILL.md',
            target: '../../../docs/README.md',
          },
        },
        {
          input: {
            rootPath: '/tmp/sample-app/kit',
            relativePath: 'agents/gamma.md',
            target: '../../package.json',
          },
        },
      ]

      test.each(cases)('target: $input.target', ({ input }) => {
        const tree = KitMarkdownTree.create({
          rootPath: input.rootPath,
        })
        const inspector = KitLinkInspector.create({
          tree,
        })

        jest.spyOn(tree, 'exists')
          .mockReturnValue(true)

        const received = inspector.isResolved({
          relativePath: input.relativePath,
          target: input.target,
        })

        expect(received)
          .toBe(false)
      })
    })
  })
})
