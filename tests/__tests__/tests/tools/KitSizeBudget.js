import KitMarkdownTree from '../../../tools/KitMarkdownTree.js'
import KitSizeBudget from '../../../tools/KitSizeBudget.js'

describe('KitSizeBudget', () => {
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
              budgetHash: {},
            },
            expected: alphaTree,
          },
          {
            input: {
              tree: betaTree,
              budgetHash: {
                'agents/beta.md': 4096,
              },
            },
            expected: betaTree,
          },
        ]

        test.each(cases)('rootPath: $input.tree.rootPath', ({ input, expected }) => {
          const sizeBudget = new KitSizeBudget(input)

          expect(sizeBudget)
            .toHaveProperty('tree', expected)
        })
      })

      describe('#budgetHash', () => {
        const alphaBudgetHash = {}
        const betaBudgetHash = {
          'agents/beta.md': 4096,
        }

        const cases = [
          {
            input: {
              tree: KitMarkdownTree.create({
                rootPath: '/tmp/acme/kit',
              }),
              budgetHash: alphaBudgetHash,
            },
            expected: alphaBudgetHash,
          },
          {
            input: {
              tree: KitMarkdownTree.create({
                rootPath: '/tmp/sample-app/kit',
              }),
              budgetHash: betaBudgetHash,
            },
            expected: betaBudgetHash,
          },
        ]

        test.each(cases)('budgetHash: $input.budgetHash', ({ input, expected }) => {
          const sizeBudget = new KitSizeBudget(input)

          expect(sizeBudget)
            .toHaveProperty('budgetHash', expected)
        })
      })
    })
  })
})

describe('KitSizeBudget', () => {
  describe('.create()', () => {
    describe('should be an instance of own class', () => {
      const cases = [
        {
          input: {
            tree: KitMarkdownTree.create({
              rootPath: '/tmp/acme/kit',
            }),
            budgetHash: {},
          },
        },
        {
          input: {
            tree: KitMarkdownTree.create({
              rootPath: '/tmp/sample-app/kit',
            }),
            budgetHash: {
              'agents/beta.md': 4096,
            },
          },
        },
      ]

      test.each(cases)('rootPath: $input.tree.rootPath', ({ input }) => {
        const received = KitSizeBudget.create(input)

        expect(received)
          .toBeInstanceOf(KitSizeBudget)
      })
    })

    describe('should call constructor', () => {
      const cases = [
        {
          tally: {
            tree: KitMarkdownTree.create({
              rootPath: '/tmp/acme/kit',
            }),
            budgetHash: {},
          },
        },
        {
          tally: {
            tree: KitMarkdownTree.create({
              rootPath: '/tmp/sample-app/kit',
            }),
            budgetHash: {
              'agents/beta.md': 4096,
            },
          },
        },
      ]

      test.each(cases)('rootPath: $tally.tree.rootPath', ({ tally }) => {
        const SpyClass = constructorSpy.spyOn(KitSizeBudget)

        SpyClass.create(tally)

        expect(SpyClass.__spy__)
          .toHaveBeenCalledWith(tally)
      })
    })
  })
})

describe('KitSizeBudget', () => {
  describe('#collectOverruns()', () => {
    describe('should collect file overruns first and stale budgets last', () => {
      const cases = [
        {
          override: {
            relativePaths: [
              'agents/beta.md',
              'skills/alpha/SKILL.md',
              'skills/alpha/references/notes.md',
            ],
            byteLengthHash: {
              'agents/beta.md': 4097,
              'skills/alpha/SKILL.md': 2048,
              'skills/alpha/references/notes.md': 512,
            },
          },
          input: {
            budgetHash: {
              'skills/zeta/SKILL.md': 100,
              'agents/beta.md': 4096,
              'skills/alpha/SKILL.md': 2048,
              'agents/eta.md': 100,
            },
          },
          expected: [
            'agents/beta.md: 4097 bytes, over its budget of 4096',
            'skills/alpha/references/notes.md: no budget recorded',
            'agents/eta.md: budgeted, but no such file',
            'skills/zeta/SKILL.md: budgeted, but no such file',
          ],
        },
        {
          override: {
            relativePaths: [
              'agents/gamma.md',
            ],
            byteLengthHash: {
              'agents/gamma.md': 1000,
            },
          },
          input: {
            budgetHash: {
              'agents/gamma.md': 1200,
            },
          },
          expected: [],
        },
      ]

      test.each(cases)('budgetHash: $input.budgetHash', ({ override, input, expected }) => {
        const tree = KitMarkdownTree.create({
          rootPath: '/tmp/acme/kit',
        })
        const sizeBudget = KitSizeBudget.create({
          tree,
          budgetHash: input.budgetHash,
        })

        jest.spyOn(tree, 'listRelativePaths')
          .mockReturnValue(override.relativePaths)
        jest.spyOn(tree, 'measureByteLength')
          .mockImplementation(({ relativePath }) => override.byteLengthHash[relativePath])

        const received = sizeBudget.collectOverruns()

        expect(received)
          .toEqual(expected)
      })
    })
  })
})

describe('KitSizeBudget', () => {
  describe('#inspectFile()', () => {
    describe('should report a file over its budget', () => {
      const cases = [
        {
          override: {
            byteLength: 4097,
          },
          input: {
            budgetHash: {
              'agents/beta.md': 4096,
            },
            relativePath: 'agents/beta.md',
          },
          expected: [
            'agents/beta.md: 4097 bytes, over its budget of 4096',
          ],
        },
        {
          override: {
            byteLength: 70000,
          },
          input: {
            budgetHash: {
              'skills/alpha/SKILL.md': 58725,
            },
            relativePath: 'skills/alpha/SKILL.md',
          },
          expected: [
            'skills/alpha/SKILL.md: 70000 bytes, over its budget of 58725',
          ],
        },
      ]

      test.each(cases)('relativePath: $input.relativePath', ({ override, input, expected }) => {
        const tree = KitMarkdownTree.create({
          rootPath: '/tmp/acme/kit',
        })
        const sizeBudget = KitSizeBudget.create({
          tree,
          budgetHash: input.budgetHash,
        })

        jest.spyOn(tree, 'measureByteLength')
          .mockReturnValue(override.byteLength)

        const received = sizeBudget.inspectFile({
          relativePath: input.relativePath,
        })

        expect(received)
          .toEqual(expected)
      })
    })

    describe('should accept a file at or under its budget', () => {
      const cases = [
        {
          override: {
            byteLength: 4096,
          },
          input: {
            budgetHash: {
              'agents/beta.md': 4096,
            },
            relativePath: 'agents/beta.md',
          },
        },
        {
          override: {
            byteLength: 0,
          },
          input: {
            budgetHash: {
              'skills/alpha/SKILL.md': 0,
            },
            relativePath: 'skills/alpha/SKILL.md',
          },
        },
      ]

      test.each(cases)('relativePath: $input.relativePath', ({ override, input }) => {
        const tree = KitMarkdownTree.create({
          rootPath: '/tmp/acme/kit',
        })
        const sizeBudget = KitSizeBudget.create({
          tree,
          budgetHash: input.budgetHash,
        })

        jest.spyOn(tree, 'measureByteLength')
          .mockReturnValue(override.byteLength)

        const received = sizeBudget.inspectFile({
          relativePath: input.relativePath,
        })

        expect(received)
          .toEqual([])
      })
    })

    describe('should report a file with no budget, unmeasured', () => {
      const cases = [
        {
          input: {
            budgetHash: {},
            relativePath: 'agents/beta.md',
          },
          expected: [
            'agents/beta.md: no budget recorded',
          ],
        },
        {
          input: {
            budgetHash: {
              'agents/beta.md': 4096,
            },
            relativePath: 'skills/alpha/SKILL.md',
          },
          expected: [
            'skills/alpha/SKILL.md: no budget recorded',
          ],
        },
      ]

      test.each(cases)('relativePath: $input.relativePath', ({ input, expected }) => {
        const tree = KitMarkdownTree.create({
          rootPath: '/tmp/acme/kit',
        })
        const sizeBudget = KitSizeBudget.create({
          tree,
          budgetHash: input.budgetHash,
        })

        const measureByteLengthSpy = jest.spyOn(tree, 'measureByteLength')
          .mockReturnValue(0)

        const received = sizeBudget.inspectFile({
          relativePath: input.relativePath,
        })

        expect(received)
          .toEqual(expected)
        expect(measureByteLengthSpy)
          .not
          .toHaveBeenCalled()
      })
    })
  })
})
