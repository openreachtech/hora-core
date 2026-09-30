import fs from 'node:fs'
import path from 'node:path'

import KitMarkdownTree from '../../../tools/KitMarkdownTree.js'

describe('KitMarkdownTree', () => {
  describe('constructor', () => {
    describe('should keep property', () => {
      describe('#rootPath', () => {
        const cases = [
          {
            input: {
              rootPath: '/tmp/acme/kit',
            },
            expected: '/tmp/acme/kit',
          },
          {
            input: {
              rootPath: '/tmp/sample-app/kit',
            },
            expected: '/tmp/sample-app/kit',
          },
        ]

        test.each(cases)('rootPath: $input.rootPath', ({ input, expected }) => {
          const tree = new KitMarkdownTree(input)

          expect(tree)
            .toHaveProperty('rootPath', expected)
        })
      })
    })
  })
})

describe('KitMarkdownTree', () => {
  describe('.create()', () => {
    describe('should be an instance of own class', () => {
      const cases = [
        {
          input: {
            rootPath: '/tmp/acme/kit',
          },
        },
        {
          input: {
            rootPath: '/tmp/sample-app/kit',
          },
        },
      ]

      test.each(cases)('rootPath: $input.rootPath', ({ input }) => {
        const received = KitMarkdownTree.create(input)

        expect(received)
          .toBeInstanceOf(KitMarkdownTree)
      })
    })

    describe('should call constructor', () => {
      const cases = [
        {
          tally: {
            rootPath: '/tmp/acme/kit',
          },
        },
        {
          tally: {
            rootPath: '/tmp/sample-app/kit',
          },
        },
      ]

      test.each(cases)('rootPath: $tally.rootPath', ({ tally }) => {
        const SpyClass = constructorSpy.spyOn(KitMarkdownTree)

        SpyClass.create(tally)

        expect(SpyClass.__spy__)
          .toHaveBeenCalledWith(tally)
      })
    })
  })
})

describe('KitMarkdownTree', () => {
  describe('#get:fs', () => {
    describe('when called as is', () => {
      test('should be fixed value', () => {
        const tree = KitMarkdownTree.create({
          rootPath: '/tmp/acme/kit',
        })

        const received = tree.fs

        expect(received)
          .toBe(fs) // same reference
      })
    })
  })
})

describe('KitMarkdownTree', () => {
  describe('#get:path', () => {
    describe('when called as is', () => {
      test('should be fixed value', () => {
        const tree = KitMarkdownTree.create({
          rootPath: '/tmp/acme/kit',
        })

        const received = tree.path

        expect(received)
          .toBe(path) // same reference
      })
    })
  })
})

describe('KitMarkdownTree', () => {
  describe('#listRelativePaths()', () => {
    describe('should list only Markdown files, sorted', () => {
      const cases = [
        {
          override: {
            entries: [
              'skills',
              'skills/beta',
              'skills/beta/SKILL.md',
              'skills/alpha',
              'skills/alpha/SKILL.md',
              'skills/alpha/references',
              'skills/alpha/references/notes.md',
              '.DS_Store',
            ],
          },
          input: {
            rootPath: '/tmp/acme/kit',
          },
          expected: [
            'skills/alpha/SKILL.md',
            'skills/alpha/references/notes.md',
            'skills/beta/SKILL.md',
          ],
        },
        {
          override: {
            entries: [
              'agents',
              'agents/zeta.md',
              'agents/eta.md',
              'agents/eta.json',
            ],
          },
          input: {
            rootPath: '/tmp/sample-app/kit',
          },
          expected: [
            'agents/eta.md',
            'agents/zeta.md',
          ],
        },
      ]

      test.each(cases)('rootPath: $input.rootPath', ({ override, input, expected }) => {
        const tree = KitMarkdownTree.create(input)

        jest.spyOn(fs, 'readdirSync')
          .mockReturnValue(override.entries)

        const received = tree.listRelativePaths()

        expect(received)
          .toEqual(expected)
      })
    })

    describe('should read the root recursively', () => {
      const cases = [
        {
          input: {
            rootPath: '/tmp/acme/kit',
          },
          expected: [
            '/tmp/acme/kit',
            {
              recursive: true,
            },
          ],
        },
        {
          input: {
            rootPath: '/tmp/sample-app/kit',
          },
          expected: [
            '/tmp/sample-app/kit',
            {
              recursive: true,
            },
          ],
        },
      ]

      test.each(cases)('rootPath: $input.rootPath', ({ input, expected }) => {
        const tree = KitMarkdownTree.create(input)

        const readdirSyncSpy = jest.spyOn(fs, 'readdirSync')
          .mockReturnValue([])

        tree.listRelativePaths()

        expect(readdirSyncSpy)
          .toHaveBeenCalledWith(...expected)
      })
    })
  })
})

describe('KitMarkdownTree', () => {
  describe('#readContent()', () => {
    describe('should return the content of the file', () => {
      const cases = [
        {
          override: {
            content: '# Alpha\n',
          },
          input: {
            rootPath: '/tmp/acme/kit',
            relativePath: 'skills/alpha/SKILL.md',
          },
          expected: '# Alpha\n',
        },
        {
          override: {
            content: '---\nname: beta\n---\n',
          },
          input: {
            rootPath: '/tmp/sample-app/kit',
            relativePath: 'agents/beta.md',
          },
          expected: '---\nname: beta\n---\n',
        },
      ]

      test.each(cases)('relativePath: $input.relativePath', ({ override, input, expected }) => {
        const tree = KitMarkdownTree.create({
          rootPath: input.rootPath,
        })

        jest.spyOn(fs, 'readFileSync')
          .mockReturnValue(override.content)

        const received = tree.readContent({
          relativePath: input.relativePath,
        })

        expect(received)
          .toBe(expected)
      })
    })

    describe('should read the file below the root as UTF-8', () => {
      const cases = [
        {
          input: {
            rootPath: '/tmp/acme/kit',
            relativePath: 'skills/alpha/SKILL.md',
          },
          expected: [
            '/tmp/acme/kit/skills/alpha/SKILL.md',
            'utf8',
          ],
        },
        {
          input: {
            rootPath: '/tmp/sample-app/kit',
            relativePath: 'agents/beta.md',
          },
          expected: [
            '/tmp/sample-app/kit/agents/beta.md',
            'utf8',
          ],
        },
      ]

      test.each(cases)('relativePath: $input.relativePath', ({ input, expected }) => {
        const tree = KitMarkdownTree.create({
          rootPath: input.rootPath,
        })

        const readFileSyncSpy = jest.spyOn(fs, 'readFileSync')
          .mockReturnValue('')

        tree.readContent({
          relativePath: input.relativePath,
        })

        expect(readFileSyncSpy)
          .toHaveBeenCalledWith(...expected)
      })
    })
  })
})

describe('KitMarkdownTree', () => {
  describe('#measureByteLength()', () => {
    describe('should return the size the file system reports', () => {
      const cases = [
        {
          override: {
            size: 4775,
          },
          input: {
            rootPath: '/tmp/acme/kit',
            relativePath: 'agents/alpha.md',
          },
          expected: 4775,
        },
        {
          override: {
            size: 58725,
          },
          input: {
            rootPath: '/tmp/sample-app/kit',
            relativePath: 'skills/beta/SKILL.md',
          },
          expected: 58725,
        },
      ]

      test.each(cases)('relativePath: $input.relativePath', ({ override, input, expected }) => {
        const tree = KitMarkdownTree.create({
          rootPath: input.rootPath,
        })

        jest.spyOn(fs, 'statSync')
          .mockReturnValue(override)

        const received = tree.measureByteLength({
          relativePath: input.relativePath,
        })

        expect(received)
          .toBe(expected)
      })
    })

    describe('should stat the file below the root', () => {
      const cases = [
        {
          input: {
            rootPath: '/tmp/acme/kit',
            relativePath: 'agents/alpha.md',
          },
          expected: '/tmp/acme/kit/agents/alpha.md',
        },
        {
          input: {
            rootPath: '/tmp/sample-app/kit',
            relativePath: 'skills/beta/SKILL.md',
          },
          expected: '/tmp/sample-app/kit/skills/beta/SKILL.md',
        },
      ]

      test.each(cases)('relativePath: $input.relativePath', ({ input, expected }) => {
        const tree = KitMarkdownTree.create({
          rootPath: input.rootPath,
        })

        const statSyncSpy = jest.spyOn(fs, 'statSync')
          .mockReturnValue({
            size: 0,
          })

        tree.measureByteLength({
          relativePath: input.relativePath,
        })

        expect(statSyncSpy)
          .toHaveBeenCalledWith(expected)
      })
    })
  })
})

describe('KitMarkdownTree', () => {
  describe('#resolveTarget()', () => {
    describe('should resolve against the directory of the file', () => {
      const cases = [
        {
          input: {
            rootPath: '/tmp/acme/kit',
            relativePath: 'skills/alpha/SKILL.md',
            target: '../beta/SKILL.md',
          },
          expected: '/tmp/acme/kit/skills/beta/SKILL.md',
        },
        {
          input: {
            rootPath: '/tmp/sample-app/kit',
            relativePath: 'skills/alpha/references/notes.md',
            target: './format.md',
          },
          expected: '/tmp/sample-app/kit/skills/alpha/references/format.md',
        },
        {
          input: {
            rootPath: '/tmp/acme/kit',
            relativePath: 'skills/alpha/SKILL.md',
            target: '../../agents/gamma.md',
          },
          expected: '/tmp/acme/kit/agents/gamma.md',
        },
      ]

      test.each(cases)('target: $input.target', ({ input, expected }) => {
        const tree = KitMarkdownTree.create({
          rootPath: input.rootPath,
        })

        const received = tree.resolveTarget({
          relativePath: input.relativePath,
          target: input.target,
        })

        expect(received)
          .toBe(expected)
      })
    })

    describe('should drop the anchor', () => {
      const cases = [
        {
          input: {
            rootPath: '/tmp/acme/kit',
            relativePath: 'skills/alpha/SKILL.md',
            target: './references/format.md#the-division-of-labor',
          },
          expected: '/tmp/acme/kit/skills/alpha/references/format.md',
        },
        {
          input: {
            rootPath: '/tmp/sample-app/kit',
            relativePath: 'agents/beta.md',
            target: '../skills/gamma/SKILL.md#step-5',
          },
          expected: '/tmp/sample-app/kit/skills/gamma/SKILL.md',
        },
      ]

      test.each(cases)('target: $input.target', ({ input, expected }) => {
        const tree = KitMarkdownTree.create({
          rootPath: input.rootPath,
        })

        const received = tree.resolveTarget({
          relativePath: input.relativePath,
          target: input.target,
        })

        expect(received)
          .toBe(expected)
      })
    })
  })
})

describe('KitMarkdownTree', () => {
  describe('#contains()', () => {
    describe('should be true below the root', () => {
      const cases = [
        {
          input: {
            rootPath: '/tmp/acme/kit',
            absolutePath: '/tmp/acme/kit/skills/alpha/SKILL.md',
          },
        },
        {
          input: {
            rootPath: '/tmp/sample-app/kit',
            absolutePath: '/tmp/sample-app/kit/agents/beta.md',
          },
        },
        {
          input: {
            rootPath: '/tmp/acme/kit',
            absolutePath: '/tmp/acme/kit/..notes.md',
          },
        },
      ]

      test.each(cases)('absolutePath: $input.absolutePath', ({ input }) => {
        const tree = KitMarkdownTree.create({
          rootPath: input.rootPath,
        })

        const received = tree.contains({
          absolutePath: input.absolutePath,
        })

        expect(received)
          .toBe(true)
      })
    })

    describe('should be false outside the root', () => {
      const cases = [
        {
          input: {
            rootPath: '/tmp/acme/kit',
            absolutePath: '/tmp/acme/docs/README.md',
          },
        },
        {
          input: {
            rootPath: '/tmp/sample-app/kit',
            absolutePath: '/tmp/sample-app/kit-other/agents/beta.md',
          },
        },
        {
          input: {
            rootPath: '/tmp/acme/kit',
            absolutePath: '/tmp/acme',
          },
        },
      ]

      test.each(cases)('absolutePath: $input.absolutePath', ({ input }) => {
        const tree = KitMarkdownTree.create({
          rootPath: input.rootPath,
        })

        const received = tree.contains({
          absolutePath: input.absolutePath,
        })

        expect(received)
          .toBe(false)
      })
    })
  })
})

describe('KitMarkdownTree', () => {
  describe('#exists()', () => {
    describe('should return what the file system reports', () => {
      const cases = [
        {
          override: {
            exists: true,
          },
          input: {
            rootPath: '/tmp/acme/kit',
            absolutePath: '/tmp/acme/kit/skills/alpha/SKILL.md',
          },
          expected: true,
        },
        {
          override: {
            exists: false,
          },
          input: {
            rootPath: '/tmp/sample-app/kit',
            absolutePath: '/tmp/sample-app/kit/agents/missing.md',
          },
          expected: false,
        },
      ]

      test.each(cases)('absolutePath: $input.absolutePath', ({ override, input, expected }) => {
        const tree = KitMarkdownTree.create({
          rootPath: input.rootPath,
        })

        jest.spyOn(fs, 'existsSync')
          .mockReturnValue(override.exists)

        const received = tree.exists({
          absolutePath: input.absolutePath,
        })

        expect(received)
          .toBe(expected)
      })
    })

    describe('should ask about the absolute path', () => {
      const cases = [
        {
          input: {
            rootPath: '/tmp/acme/kit',
            absolutePath: '/tmp/acme/kit/skills/alpha/SKILL.md',
          },
          expected: '/tmp/acme/kit/skills/alpha/SKILL.md',
        },
        {
          input: {
            rootPath: '/tmp/sample-app/kit',
            absolutePath: '/tmp/sample-app/kit/agents/missing.md',
          },
          expected: '/tmp/sample-app/kit/agents/missing.md',
        },
      ]

      test.each(cases)('absolutePath: $input.absolutePath', ({ input, expected }) => {
        const tree = KitMarkdownTree.create({
          rootPath: input.rootPath,
        })

        const existsSyncSpy = jest.spyOn(fs, 'existsSync')
          .mockReturnValue(true)

        tree.exists({
          absolutePath: input.absolutePath,
        })

        expect(existsSyncSpy)
          .toHaveBeenCalledWith(expected)
      })
    })
  })
})
