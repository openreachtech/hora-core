import fs from 'node:fs'
import path from 'node:path'

import HoraCoreInstaller from '../../../lib/equip/HoraCoreInstaller.js'

import HoraCoreManifestFile from '../../../lib/equip/HoraCoreManifestFile.js'

describe('HoraCoreInstaller', () => {
  describe('constructor', () => {
    describe('should keep property', () => {
      describe('#sourceDirectoryPath', () => {
        const cases = [
          {
            input: {
              sourceDirectoryPath: '/package/dist/skills',
            },
            expected: '/package/dist/skills',
          },
          {
            input: {
              sourceDirectoryPath: 'dist/skills',
            },
            expected: 'dist/skills',
          },
        ]

        test.each(cases)('sourceDirectoryPath: $input.sourceDirectoryPath', ({ input, expected }) => {
          const args = {
            sourceDirectoryPath: input.sourceDirectoryPath,
            targetDirectoryPath: '',
            manifestFile: null,
          }

          const installer = new HoraCoreInstaller(args)

          expect(installer)
            .toHaveProperty('sourceDirectoryPath', expected)
        })
      })

      describe('#targetDirectoryPath', () => {
        const cases = [
          {
            input: {
              workingDirectoryPath: '/consumer',
              targetDirectoryPath: '/consumer/.claude/skills',
            },
            expected: '/consumer/.claude/skills',
          },
          {
            input: {
              workingDirectoryPath: '.',
              targetDirectoryPath: '.claude/skills',
            },
            expected: '.claude/skills',
          },
        ]

        test.each(cases)('targetDirectoryPath: $input.targetDirectoryPath', ({ input, expected }) => {
          const args = {
            sourceDirectoryPath: '',
            targetDirectoryPath: input.targetDirectoryPath,
            manifestFile: null,
          }

          const installer = new HoraCoreInstaller(args)

          expect(installer)
            .toHaveProperty('targetDirectoryPath', expected)
        })
      })

      describe('#manifestFile', () => {
        const cases = [
          {
            input: {
              manifestFile: HoraCoreManifestFile.create({
                filePath: '/consumer/.hora/equip-core.json',
                installationPath: '.claude/skills',
              }),
            },
          },
          {
            input: {
              manifestFile: HoraCoreManifestFile.create({
                filePath: '.hora/equip-core.json',
                installationPath: '.claude/agents',
              }),
            },
          },
        ]

        test.each(cases)('filePath: $input.manifestFile.filePath', ({ input }) => {
          const args = {
            sourceDirectoryPath: '',
            targetDirectoryPath: '',
            manifestFile: input.manifestFile,
          }

          const installer = new HoraCoreInstaller(args)

          expect(installer)
            .toHaveProperty('manifestFile', input.manifestFile)
        })
      })
    })
  })
})

describe('HoraCoreInstaller', () => {
  describe('.create()', () => {
    describe('should be an instance of own class', () => {
      const cases = [
        {
          input: {
            workingDirectoryPath: '/consumer',
            targetDirectoryPath: '/consumer/.claude/skills',
            sourceDirectoryPath: '/package/dist/skills',
          },
        },
        {
          input: {
            workingDirectoryPath: '.',
            targetDirectoryPath: '.claude/skills',
            sourceDirectoryPath: 'dist/skills',
          },
        },
      ]

      test.each(cases)('targetDirectoryPath: $input.targetDirectoryPath', ({ input }) => {
        const received = HoraCoreInstaller.create(input)

        expect(received)
          .toBeInstanceOf(HoraCoreInstaller)
      })
    })

    describe('should call constructor', () => {
      const cases = [
        {
          input: {
            workingDirectoryPath: '/consumer',
            targetDirectoryPath: '/consumer/.claude/skills',
            sourceDirectoryPath: '/package/dist/skills',
          },
          expected: {
            filePath: '/consumer/.hora/equip-core.json',
            installationPath: '.claude/skills',
          },
        },
        {
          input: {
            workingDirectoryPath: '/tmp',
            targetDirectoryPath: '/tmp/skills',
            sourceDirectoryPath: '/package/dist/skills',
          },
          expected: {
            filePath: '/tmp/.hora/equip-core.json',
            installationPath: 'skills',
          },
        },
      ]

      test.each(cases)('targetDirectoryPath: $input.targetDirectoryPath', ({ input, expected }) => {
        const args = {
          workingDirectoryPath: input.workingDirectoryPath,
          targetDirectoryPath: input.targetDirectoryPath,
          sourceDirectoryPath: input.sourceDirectoryPath,
        }

        const installer = HoraCoreInstaller.create(args)
        const received = installer.manifestFile

        expect(received)
          .toHaveProperty('filePath', expected.filePath)
        expect(received)
          .toHaveProperty('installationPath', expected.installationPath)
      })
    })
  })
})

describe('HoraCoreInstaller', () => {
  describe('.get:HoraCoreManifestFileCtor', () => {
    describe('when called as is', () => {
      test('should be fixed value', () => {
        const received = HoraCoreInstaller.HoraCoreManifestFileCtor

        expect(received)
          .toBe(HoraCoreManifestFile) // same reference
      })
    })
  })
})

describe('HoraCoreInstaller', () => {
  describe('.get:manifestPathSegments', () => {
    describe('when called as is', () => {
      test('should be fixed value', () => {
        const received = HoraCoreInstaller.manifestPathSegments

        expect(received)
          .toEqual([
            '.hora',
            'equip-core.json',
          ])
      })
    })
  })
})

describe('HoraCoreInstaller', () => {
  describe('.createHoraCoreManifestFile()', () => {
    describe('should place the manifest under the working directory', () => {
      const cases = [
        {
          input: {
            workingDirectoryPath: '/consumer',
            targetDirectoryPath: '/consumer/.claude/skills',
          },
          expected: '/consumer/.hora/equip-core.json',
        },
        {
          input: {
            workingDirectoryPath: '/tmp',
            targetDirectoryPath: '/tmp/skills/',
          },
          expected: '/tmp/.hora/equip-core.json',
        },
      ]

      test.each(cases)('targetDirectoryPath: $input.targetDirectoryPath', ({ input, expected }) => {
        const manifestFile = HoraCoreInstaller.createHoraCoreManifestFile(input)
        const received = manifestFile.filePath

        expect(received)
          .toBe(expected)
      })
    })

    describe('should key the entry by the installation path', () => {
      const cases = [
        {
          input: {
            workingDirectoryPath: '/consumer',
            targetDirectoryPath: '/consumer/.claude/skills',
          },
          expected: '.claude/skills',
        },
        {
          input: {
            workingDirectoryPath: '/consumer',
            targetDirectoryPath: '/consumer/.claude/agents',
          },
          expected: '.claude/agents',
        },
      ]

      test.each(cases)('targetDirectoryPath: $input.targetDirectoryPath', ({ input, expected }) => {
        const manifestFile = HoraCoreInstaller.createHoraCoreManifestFile(input)
        const received = manifestFile.installationPath

        expect(received)
          .toBe(expected)
      })
    })
  })
})

describe('HoraCoreInstaller', () => {
  describe('.buildInstallationPath()', () => {
    describe('should be the target directory relative to the working directory', () => {
      const cases = [
        {
          input: {
            workingDirectoryPath: '/consumer',
            targetDirectoryPath: '/consumer/.claude/skills',
          },
          expected: '.claude/skills',
        },
        {
          input: {
            workingDirectoryPath: '/consumer',
            targetDirectoryPath: '/consumer/.claude/agents',
          },
          expected: '.claude/agents',
        },
        {
          input: {
            workingDirectoryPath: '/consumer',
            targetDirectoryPath: '/consumer',
          },
          expected: '',
        },
        {
          input: {
            workingDirectoryPath: '/consumer/app',
            targetDirectoryPath: '/consumer/.claude/skills',
          },
          expected: '../.claude/skills',
        },
      ]

      test.each(cases)('targetDirectoryPath: $input.targetDirectoryPath', ({ input, expected }) => {
        const received = HoraCoreInstaller.buildInstallationPath(input)

        expect(received)
          .toBe(expected)
      })
    })
  })
})

describe('HoraCoreInstaller', () => {
  describe('.isPlainEntryName()', () => {
    describe('should be true for an entry of the installation directory', () => {
      const cases = [
        {
          input: {
            entryName: 'hora-plan',
          },
        },
        {
          input: {
            entryName: 'hora-verifier.md',
          },
        },
        {
          input: {
            entryName: '.hidden-skill',
          },
        },
        {
          input: {
            entryName: 'skill with space',
          },
        },
      ]

      test.each(cases)('entryName: $input.entryName', ({ input }) => {
        const received = HoraCoreInstaller.isPlainEntryName(input)

        expect(received)
          .toBe(true)
      })
    })

    describe('should be false for an entry name reaching outside the installation directory', () => {
      const cases = [
        {
          input: {
            entryName: '..',
          },
        },
        {
          input: {
            entryName: '.',
          },
        },
        {
          input: {
            entryName: '',
          },
        },
        {
          input: {
            entryName: '../../../canary',
          },
        },
        {
          input: {
            entryName: 'hora-plan/SKILL.md',
          },
        },
        {
          input: {
            entryName: '/etc/hosts',
          },
        },
        {
          input: {
            entryName: '..\\..\\canary',
          },
        },
      ]

      test.each(cases)('entryName: $input.entryName', ({ input }) => {
        const received = HoraCoreInstaller.isPlainEntryName(input)

        expect(received)
          .toBe(false)
      })
    })
  })
})

describe('HoraCoreInstaller', () => {
  describe('#get:fs', () => {
    describe('when called as is', () => {
      test('should be fixed value', () => {
        const installer = HoraCoreInstaller.create({
          workingDirectoryPath: '/consumer',
          targetDirectoryPath: '/consumer/.claude/skills',
          sourceDirectoryPath: '/package/dist/skills',
        })

        const received = installer.fs

        expect(received)
          .toBe(fs) // same reference
      })
    })
  })
})

describe('HoraCoreInstaller', () => {
  describe('#get:path', () => {
    describe('when called as is', () => {
      test('should be fixed value', () => {
        const installer = HoraCoreInstaller.create({
          workingDirectoryPath: '/consumer',
          targetDirectoryPath: '/consumer/.claude/skills',
          sourceDirectoryPath: '/package/dist/skills',
        })

        const received = installer.path

        expect(received)
          .toBe(path) // same reference
      })
    })
  })
})

describe('HoraCoreInstaller', () => {
  describe('#install()', () => {
    describe('should record what it installed', () => {
      const cases = [
        {
          override: {
            removedEntryNames: [
              'bank-id',
            ],
            installedEntryNames: [
              'hora-plan',
            ],
          },
          expected: {
            entryNames: [
              'hora-plan',
            ],
          },
        },
        {
          override: {
            removedEntryNames: [],
            installedEntryNames: [],
          },
          expected: {
            entryNames: [],
          },
        },
      ]

      test.each(cases)('installedEntryNames: $override.installedEntryNames', ({ override, expected }) => {
        const installer = HoraCoreInstaller.create({
          workingDirectoryPath: '/consumer',
          targetDirectoryPath: '/consumer/.claude/skills',
          sourceDirectoryPath: '/package/dist/skills',
        })

        jest.spyOn(installer, 'removeInstalledEntries')
          .mockReturnValue(override.removedEntryNames)
        jest.spyOn(installer, 'copyDistributedEntries')
          .mockReturnValue(override.installedEntryNames)

        const saveManifestSpy = jest.spyOn(installer, 'saveManifest')
          .mockReturnValue()

        installer.install()

        expect(saveManifestSpy)
          .toHaveBeenCalledWith(expected)
      })
    })

    describe('should report the removed and the installed entries', () => {
      const cases = [
        {
          override: {
            removedEntryNames: [
              'bank-id',
            ],
            installedEntryNames: [
              'hora-plan',
            ],
          },
          expected: {
            removedEntryNames: [
              'bank-id',
            ],
            installedEntryNames: [
              'hora-plan',
            ],
          },
        },
        {
          override: {
            removedEntryNames: [],
            installedEntryNames: [
              'hora-spec',
              'hora-build',
            ],
          },
          expected: {
            removedEntryNames: [],
            installedEntryNames: [
              'hora-spec',
              'hora-build',
            ],
          },
        },
      ]

      test.each(cases)('installedEntryNames: $override.installedEntryNames', ({ override, expected }) => {
        const installer = HoraCoreInstaller.create({
          workingDirectoryPath: '/consumer',
          targetDirectoryPath: '/consumer/.claude/skills',
          sourceDirectoryPath: '/package/dist/skills',
        })

        jest.spyOn(installer, 'removeInstalledEntries')
          .mockReturnValue(override.removedEntryNames)
        jest.spyOn(installer, 'copyDistributedEntries')
          .mockReturnValue(override.installedEntryNames)
        jest.spyOn(installer, 'saveManifest')
          .mockReturnValue()

        const received = installer.install()

        expect(received)
          .toEqual(expected)
      })
    })
  })
})

describe('HoraCoreInstaller', () => {
  describe('#removeInstalledEntries()', () => {
    describe('should remove every owned entry', () => {
      const cases = [
        {
          override: {
            recordedEntryNames: [
              'hora-plan',
              'hora-accept',
            ],
          },
          expected: [
            [
              '/consumer/.claude/skills/hora-accept',
              {
                recursive: true,
                force: true,
              },
            ],
            [
              '/consumer/.claude/skills/hora-plan',
              {
                recursive: true,
                force: true,
              },
            ],
          ],
        },
      ]

      test.each(cases)('recordedEntryNames: $override.recordedEntryNames', ({ override, expected }) => {
        const installer = HoraCoreInstaller.create({
          workingDirectoryPath: '/consumer',
          targetDirectoryPath: '/consumer/.claude/skills',
          sourceDirectoryPath: '/package/dist/skills',
        })

        jest.spyOn(installer.manifestFile, 'loadEntryNames')
          .mockReturnValue(override.recordedEntryNames)

        const rmSyncSpy = jest.spyOn(fs, 'rmSync')
          .mockReturnValue()

        installer.removeInstalledEntries()

        expect(rmSyncSpy)
          .toHaveBeenNthCalledWith(1, ...expected[0])
        expect(rmSyncSpy)
          .toHaveBeenNthCalledWith(2, ...expected[1])
      })
    })

    describe('should report the removed entries', () => {
      const cases = [
        {
          override: {
            recordedEntryNames: [
              'hora-plan',
            ],
          },
          expected: [
            'hora-plan',
          ],
        },
        {
          override: {
            recordedEntryNames: [],
          },
          expected: [],
        },
      ]

      test.each(cases)('recordedEntryNames: $override.recordedEntryNames', ({ override, expected }) => {
        const installer = HoraCoreInstaller.create({
          workingDirectoryPath: '/consumer',
          targetDirectoryPath: '/consumer/.claude/skills',
          sourceDirectoryPath: '/package/dist/skills',
        })

        jest.spyOn(installer.manifestFile, 'loadEntryNames')
          .mockReturnValue(override.recordedEntryNames)
        jest.spyOn(fs, 'rmSync')
          .mockReturnValue()

        const received = installer.removeInstalledEntries()

        expect(received)
          .toEqual(expected)
      })
    })

    describe('should keep an entry named after nothing this package distributes', () => {
      const cases = [
        {
          override: {
            recordedEntryNames: [],
            distributedEntryNames: [
              'hora-plan',
              'hora-spec',
            ],
            targetEntryNames: [
              'hora-spec',
              'hora-own-skill',
              'my-own-skill',
            ],
          },
          expected: [
            'hora-spec',
          ],
        },
        {
          override: {
            recordedEntryNames: [],
            distributedEntryNames: [
              'hora-plan',
              'hora-spec',
            ],
            targetEntryNames: [
              'hora-own-skill',
              'my-own-skill',
            ],
          },
          expected: [],
        },
      ]

      test.each(cases)('targetEntryNames: $override.targetEntryNames', ({ override, expected }) => {
        const installer = HoraCoreInstaller.create({
          workingDirectoryPath: '/consumer',
          targetDirectoryPath: '/consumer/.claude/skills',
          sourceDirectoryPath: '/package/dist/skills',
        })

        jest.spyOn(installer.manifestFile, 'loadEntryNames')
          .mockReturnValue(override.recordedEntryNames)
        jest.spyOn(installer, 'collectDistributedEntryNames')
          .mockReturnValue(override.distributedEntryNames)
        jest.spyOn(installer, 'collectEntryNames')
          .mockReturnValue(override.targetEntryNames)

        jest.spyOn(fs, 'rmSync')
          .mockReturnValue()

        const received = installer.removeInstalledEntries()

        expect(received)
          .toEqual(expected)
      })
    })

    describe('should never remove outside the installation directory', () => {
      const cases = [
        {
          override: {
            recordedEntryNames: [
              '../../../canary',
              'hora-plan',
            ],
          },
          expected: [
            [
              '/consumer/.claude/skills/hora-plan',
              {
                recursive: true,
                force: true,
              },
            ],
          ],
        },
      ]

      test.each(cases)('recordedEntryNames: $override.recordedEntryNames', ({ override, expected }) => {
        const installer = HoraCoreInstaller.create({
          workingDirectoryPath: '/consumer',
          targetDirectoryPath: '/consumer/.claude/skills',
          sourceDirectoryPath: '/package/dist/skills',
        })

        jest.spyOn(installer.manifestFile, 'loadEntryNames')
          .mockReturnValue(override.recordedEntryNames)

        const rmSyncSpy = jest.spyOn(fs, 'rmSync')
          .mockReturnValue()

        installer.removeInstalledEntries()

        expect(rmSyncSpy)
          .toHaveBeenCalledTimes(1)
        expect(rmSyncSpy)
          .toHaveBeenNthCalledWith(1, ...expected[0])
      })
    })
  })
})

describe('HoraCoreInstaller', () => {
  describe('#collectRemovableEntryNames()', () => {
    describe('should join what the manifest recorded and what is named after a distributed entry', () => {
      const cases = [
        {
          override: {
            recordedEntryNames: [
              'bank-id',
            ],
            distributedEntryNames: [
              'hora-plan',
              'hora-spec',
            ],
            targetEntryNames: [
              'hora-spec',
              'hora-own-skill',
            ],
          },
          expected: [
            'bank-id',
            'hora-spec',
          ],
        },
        {
          override: {
            recordedEntryNames: [
              'hora-spec',
            ],
            distributedEntryNames: [
              'hora-spec',
            ],
            targetEntryNames: [
              'hora-spec',
            ],
          },
          expected: [
            'hora-spec',
          ],
        },
        {
          override: {
            recordedEntryNames: [],
            distributedEntryNames: [],
            targetEntryNames: [
              'hora-own-skill',
            ],
          },
          expected: [],
        },
      ]

      test.each(cases)('recordedEntryNames: $override.recordedEntryNames', ({ override, expected }) => {
        const installer = HoraCoreInstaller.create({
          workingDirectoryPath: '/consumer',
          targetDirectoryPath: '/consumer/.claude/skills',
          sourceDirectoryPath: '/package/dist/skills',
        })

        jest.spyOn(installer.manifestFile, 'loadEntryNames')
          .mockReturnValue(override.recordedEntryNames)
        jest.spyOn(installer, 'collectDistributedEntryNames')
          .mockReturnValue(override.distributedEntryNames)
        jest.spyOn(installer, 'collectEntryNames')
          .mockReturnValue(override.targetEntryNames)

        const received = installer.collectRemovableEntryNames()

        expect(received)
          .toEqual(expected)
      })
    })

    describe('should drop a recorded entry name that is not a plain entry name', () => {
      const cases = [
        {
          override: {
            recordedEntryNames: [
              'hora-plan',
              '../../../canary',
            ],
            distributedEntryNames: [],
            targetEntryNames: [],
          },
          expected: [
            'hora-plan',
          ],
        },
        {
          override: {
            recordedEntryNames: [
              '..',
              '.',
              '',
              'hora-plan/SKILL.md',
            ],
            distributedEntryNames: [],
            targetEntryNames: [],
          },
          expected: [],
        },
      ]

      test.each(cases)('recordedEntryNames: $override.recordedEntryNames', ({ override, expected }) => {
        const installer = HoraCoreInstaller.create({
          workingDirectoryPath: '/consumer',
          targetDirectoryPath: '/consumer/.claude/skills',
          sourceDirectoryPath: '/package/dist/skills',
        })

        jest.spyOn(installer.manifestFile, 'loadEntryNames')
          .mockReturnValue(override.recordedEntryNames)
        jest.spyOn(installer, 'collectDistributedEntryNames')
          .mockReturnValue(override.distributedEntryNames)
        jest.spyOn(installer, 'collectEntryNames')
          .mockReturnValue(override.targetEntryNames)

        const received = installer.collectRemovableEntryNames()

        expect(received)
          .toEqual(expected)
      })
    })
  })
})

describe('HoraCoreInstaller', () => {
  describe('#collectDistributedEntryNamesInTarget()', () => {
    describe('should keep only the distributed names sitting in the target directory', () => {
      const cases = [
        {
          override: {
            distributedEntryNames: [
              'hora-plan',
              'hora-build',
              'hora-spec',
            ],
            targetEntryNames: [
              'hora-spec',
              'hora-own-skill',
              'my-own-skill',
            ],
          },
          expected: [
            'hora-spec',
          ],
        },
        {
          override: {
            distributedEntryNames: [
              'hora-plan',
              'hora-spec',
            ],
            targetEntryNames: [
              'hora-plan',
              'hora-spec',
            ],
          },
          expected: [
            'hora-plan',
            'hora-spec',
          ],
        },
        {
          override: {
            distributedEntryNames: [
              'hora-spec',
            ],
            targetEntryNames: [],
          },
          expected: [],
        },
      ]

      test.each(cases)('targetEntryNames: $override.targetEntryNames', ({ override, expected }) => {
        const installer = HoraCoreInstaller.create({
          workingDirectoryPath: '/consumer',
          targetDirectoryPath: '/consumer/.claude/skills',
          sourceDirectoryPath: '/package/dist/skills',
        })

        jest.spyOn(installer, 'collectDistributedEntryNames')
          .mockReturnValue(override.distributedEntryNames)
        jest.spyOn(installer, 'collectEntryNames')
          .mockReturnValue(override.targetEntryNames)

        const received = installer.collectDistributedEntryNamesInTarget()

        expect(received)
          .toEqual(expected)
      })
    })
  })
})

describe('HoraCoreInstaller', () => {
  describe('#collectEntryNames()', () => {
    describe('should be the sorted names of every entry', () => {
      const cases = [
        {
          override: {
            entryNames: [
              'hora-plan',
              'bank-id',
            ],
          },
          expected: [
            'bank-id',
            'hora-plan',
          ],
        },
        {
          override: {
            entryNames: [
              'hora-verifier.md',
              'hora-digester.md',
            ],
          },
          expected: [
            'hora-digester.md',
            'hora-verifier.md',
          ],
        },
        {
          override: {
            entryNames: [],
          },
          expected: [],
        },
      ]

      test.each(cases)('entryNames: $override.entryNames', ({ override, expected }) => {
        const installer = HoraCoreInstaller.create({
          workingDirectoryPath: '/consumer',
          targetDirectoryPath: '/consumer/.claude/skills',
          sourceDirectoryPath: '/package/dist/skills',
        })
        const args = {
          directoryPath: '/consumer/.claude/skills',
        }

        jest.spyOn(fs, 'existsSync')
          .mockReturnValue(true)
        jest.spyOn(fs, 'readdirSync')
          .mockReturnValue(override.entryNames)

        const received = installer.collectEntryNames(args)

        expect(received)
          .toEqual(expected)
      })
    })

    describe('should be empty when the directory is absent', () => {
      test('when the directory does not exist', () => {
        const installer = HoraCoreInstaller.create({
          workingDirectoryPath: '/consumer',
          targetDirectoryPath: '/consumer/.claude/skills',
          sourceDirectoryPath: '/package/dist/skills',
        })
        const args = {
          directoryPath: '/consumer/.claude/skills',
        }

        jest.spyOn(fs, 'existsSync')
          .mockReturnValue(false)

        const received = installer.collectEntryNames(args)

        expect(received)
          .toEqual([])
      })
    })
  })
})

describe('HoraCoreInstaller', () => {
  describe('#buildTargetEntryPath()', () => {
    describe('should be the entry under the target directory', () => {
      const cases = [
        {
          input: {
            targetDirectoryPath: '/consumer/.claude/skills',
            entryName: 'hora-plan',
          },
          expected: '/consumer/.claude/skills/hora-plan',
        },
        {
          input: {
            targetDirectoryPath: '/consumer/.claude/agents',
            entryName: 'hora-verifier.md',
          },
          expected: '/consumer/.claude/agents/hora-verifier.md',
        },
      ]

      test.each(cases)('entryName: $input.entryName', ({ input, expected }) => {
        const installer = HoraCoreInstaller.create({
          workingDirectoryPath: '/consumer',
          targetDirectoryPath: input.targetDirectoryPath,
          sourceDirectoryPath: '/package/dist/skills',
        })
        const args = {
          entryName: input.entryName,
        }

        const received = installer.buildTargetEntryPath(args)

        expect(received)
          .toBe(expected)
      })
    })
  })
})

describe('HoraCoreInstaller', () => {
  describe('#buildSourceEntryPath()', () => {
    describe('should be the entry under the source directory', () => {
      const cases = [
        {
          input: {
            sourceDirectoryPath: '/package/dist/skills',
            entryName: 'hora-plan',
          },
          expected: '/package/dist/skills/hora-plan',
        },
        {
          input: {
            sourceDirectoryPath: '/package/dist/agents',
            entryName: 'hora-verifier.md',
          },
          expected: '/package/dist/agents/hora-verifier.md',
        },
      ]

      test.each(cases)('entryName: $input.entryName', ({ input, expected }) => {
        const installer = HoraCoreInstaller.create({
          workingDirectoryPath: '/consumer',
          targetDirectoryPath: '/consumer/.claude/skills',
          sourceDirectoryPath: input.sourceDirectoryPath,
        })
        const args = {
          entryName: input.entryName,
        }

        const received = installer.buildSourceEntryPath(args)

        expect(received)
          .toBe(expected)
      })
    })
  })
})

describe('HoraCoreInstaller', () => {
  describe('#copyDistributedEntries()', () => {
    describe('should copy each distributed entry into the target directory', () => {
      const cases = [
        {
          input: {
            sourceDirectoryPath: '/package/dist/skills',
            targetDirectoryPath: '/consumer/.claude/skills',
          },
          override: {
            distributedEntryNames: [
              'hora-plan',
            ],
          },
          expected: [
            '/package/dist/skills/hora-plan',
            '/consumer/.claude/skills/hora-plan',
            {
              recursive: true,
            },
          ],
        },
        {
          input: {
            sourceDirectoryPath: '/package/dist/agents',
            targetDirectoryPath: '/consumer/.claude/agents',
          },
          override: {
            distributedEntryNames: [
              'hora-verifier.md',
            ],
          },
          expected: [
            '/package/dist/agents/hora-verifier.md',
            '/consumer/.claude/agents/hora-verifier.md',
            {
              recursive: true,
            },
          ],
        },
      ]

      test.each(cases)('distributedEntryNames: $override.distributedEntryNames', ({ input, override, expected }) => {
        const installer = HoraCoreInstaller.create({
          workingDirectoryPath: '/consumer',
          targetDirectoryPath: input.targetDirectoryPath,
          sourceDirectoryPath: input.sourceDirectoryPath,
        })

        jest.spyOn(installer, 'collectDistributedEntryNames')
          .mockReturnValue(override.distributedEntryNames)
        jest.spyOn(fs, 'mkdirSync')
          .mockReturnValue('')

        const cpSyncSpy = jest.spyOn(fs, 'cpSync')
          .mockReturnValue()

        installer.copyDistributedEntries()

        expect(cpSyncSpy)
          .toHaveBeenCalledWith(...expected)
      })
    })

    describe('should create the target directory', () => {
      const cases = [
        {
          input: {
            workingDirectoryPath: '/consumer',
            targetDirectoryPath: '/consumer/.claude/skills',
          },
          expected: [
            '/consumer/.claude/skills',
            {
              recursive: true,
            },
          ],
        },
        {
          input: {
            workingDirectoryPath: '/tmp',
            targetDirectoryPath: '/tmp/skills',
          },
          expected: [
            '/tmp/skills',
            {
              recursive: true,
            },
          ],
        },
      ]

      test.each(cases)('targetDirectoryPath: $input.targetDirectoryPath', ({ input, expected }) => {
        const installer = HoraCoreInstaller.create({
          workingDirectoryPath: input.workingDirectoryPath,
          targetDirectoryPath: input.targetDirectoryPath,
          sourceDirectoryPath: '/package/dist/skills',
        })

        jest.spyOn(installer, 'collectDistributedEntryNames')
          .mockReturnValue([])

        const mkdirSyncSpy = jest.spyOn(fs, 'mkdirSync')
          .mockReturnValue('')

        installer.copyDistributedEntries()

        expect(mkdirSyncSpy)
          .toHaveBeenCalledWith(...expected)
      })
    })
  })
})

describe('HoraCoreInstaller', () => {
  describe('#collectDistributedEntryNames()', () => {
    describe('should read the source directory', () => {
      const cases = [
        {
          input: {
            sourceDirectoryPath: '/package/dist/skills',
          },
          expected: {
            directoryPath: '/package/dist/skills',
          },
        },
        {
          input: {
            sourceDirectoryPath: '/elsewhere/dist/skills',
          },
          expected: {
            directoryPath: '/elsewhere/dist/skills',
          },
        },
      ]

      test.each(cases)('sourceDirectoryPath: $input.sourceDirectoryPath', ({ input, expected }) => {
        const installer = HoraCoreInstaller.create({
          workingDirectoryPath: '/consumer',
          targetDirectoryPath: '/consumer/.claude/skills',
          sourceDirectoryPath: input.sourceDirectoryPath,
        })

        const collectEntryNamesSpy = jest.spyOn(installer, 'collectEntryNames')
          .mockReturnValue([])

        installer.collectDistributedEntryNames()

        expect(collectEntryNamesSpy)
          .toHaveBeenCalledWith(expected)
      })
    })
  })
})

describe('HoraCoreInstaller', () => {
  describe('#saveManifest()', () => {
    describe('should record the version and the entries', () => {
      const cases = [
        {
          override: {
            version: '0.0.1',
          },
          input: {
            entryNames: [
              'hora-plan',
            ],
          },
          expected: {
            version: '0.0.1',
            entryNames: [
              'hora-plan',
            ],
          },
        },
        {
          override: {
            version: null,
          },
          input: {
            entryNames: [],
          },
          expected: {
            version: null,
            entryNames: [],
          },
        },
      ]

      test.each(cases)('version: $override.version', ({ override, input, expected }) => {
        const installer = HoraCoreInstaller.create({
          workingDirectoryPath: '/consumer',
          targetDirectoryPath: '/consumer/.claude/skills',
          sourceDirectoryPath: '/package/dist/skills',
        })

        jest.spyOn(installer, 'loadPackageVersion')
          .mockReturnValue(override.version)

        const saveSpy = jest.spyOn(installer.manifestFile, 'save')
          .mockReturnValue()

        installer.saveManifest(input)

        expect(saveSpy)
          .toHaveBeenCalledWith(expected)
      })
    })
  })
})

describe('HoraCoreInstaller', () => {
  describe('#loadPackageVersion()', () => {
    describe('should be the version of this package', () => {
      const cases = [
        {
          override: {
            content: '{"version":"1.2.3"}',
          },
          expected: '1.2.3',
        },
        {
          override: {
            content: '{"version":"0.0.1"}',
          },
          expected: '0.0.1',
        },
      ]

      test.each(cases)('content: $override.content', ({ override, expected }) => {
        const installer = HoraCoreInstaller.create({
          workingDirectoryPath: '/consumer',
          targetDirectoryPath: '/consumer/.claude/skills',
          sourceDirectoryPath: '/package/dist/skills',
        })

        jest.spyOn(fs, 'readFileSync')
          .mockReturnValue(override.content)

        const received = installer.loadPackageVersion()

        expect(received)
          .toBe(expected)
      })
    })

    describe('should be null when the version is unreadable', () => {
      const cases = [
        {
          override: {
            content: 'not json',
          },
        },
        {
          override: {
            content: '{"name":"@openreachtech/hora"}',
          },
        },
      ]

      test.each(cases)('content: $override.content', ({ override }) => {
        const installer = HoraCoreInstaller.create({
          workingDirectoryPath: '/consumer',
          targetDirectoryPath: '/consumer/.claude/skills',
          sourceDirectoryPath: '/package/dist/skills',
        })

        jest.spyOn(fs, 'readFileSync')
          .mockReturnValue(override.content)

        const received = installer.loadPackageVersion()

        expect(received)
          .toBeNull()
      })
    })
  })
})

describe('HoraCoreInstaller', () => {
  describe('#uninstall()', () => {
    describe('should remove the installed entries and the manifest', () => {
      const cases = [
        {
          override: {
            removedEntryNames: [
              'hora-plan',
            ],
          },
          expected: {
            removedEntryNames: [
              'hora-plan',
            ],
          },
        },
        {
          override: {
            removedEntryNames: [],
          },
          expected: {
            removedEntryNames: [],
          },
        },
      ]

      test.each(cases)('removedEntryNames: $override.removedEntryNames', ({ override, expected }) => {
        const installer = HoraCoreInstaller.create({
          workingDirectoryPath: '/consumer',
          targetDirectoryPath: '/consumer/.claude/skills',
          sourceDirectoryPath: '/package/dist/skills',
        })

        jest.spyOn(installer, 'removeInstalledEntries')
          .mockReturnValue(override.removedEntryNames)

        const removeSpy = jest.spyOn(installer.manifestFile, 'remove')
          .mockReturnValue()

        const received = installer.uninstall()

        expect(removeSpy)
          .toHaveBeenCalledWith()
        expect(received)
          .toEqual(expected)
      })
    })
  })
})
