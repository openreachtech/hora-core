import fs from 'node:fs'
import path from 'node:path'

import HoraCoreManifestFile from '../../../lib/equip/HoraCoreManifestFile.js'

describe('HoraCoreManifestFile', () => {
  describe('constructor', () => {
    describe('should keep property', () => {
      describe('#filePath', () => {
        const cases = [
          {
            input: {
              filePath: '/tmp/app/.hora/equip-core.json',
              installationPath: '.claude/skills',
            },
            expected: '/tmp/app/.hora/equip-core.json',
          },
          {
            input: {
              filePath: '.hora/equip-core.json',
              installationPath: '.claude/agents',
            },
            expected: '.hora/equip-core.json',
          },
        ]

        test.each(cases)('filePath: $input.filePath', ({ input, expected }) => {
          const manifestFile = new HoraCoreManifestFile(input)

          expect(manifestFile)
            .toHaveProperty('filePath', expected)
        })
      })

      describe('#installationPath', () => {
        const cases = [
          {
            input: {
              filePath: '/tmp/app/.hora/equip-core.json',
              installationPath: '.claude/skills',
            },
            expected: '.claude/skills',
          },
          {
            input: {
              filePath: '.hora/equip-core.json',
              installationPath: '.claude/agents',
            },
            expected: '.claude/agents',
          },
        ]

        test.each(cases)('installationPath: $input.installationPath', ({ input, expected }) => {
          const manifestFile = new HoraCoreManifestFile(input)

          expect(manifestFile)
            .toHaveProperty('installationPath', expected)
        })
      })
    })
  })
})

describe('HoraCoreManifestFile', () => {
  describe('.create()', () => {
    describe('should be an instance of own class', () => {
      const cases = [
        {
          input: {
            filePath: '/tmp/app/.hora/equip-core.json',
            installationPath: '.claude/skills',
          },
        },
        {
          input: {
            filePath: '.hora/equip-core.json',
            installationPath: '.claude/agents',
          },
        },
      ]

      test.each(cases)('filePath: $input.filePath', ({ input }) => {
        const received = HoraCoreManifestFile.create(input)

        expect(received)
          .toBeInstanceOf(HoraCoreManifestFile)
      })
    })

    describe('should call constructor', () => {
      const cases = [
        {
          tally: {
            filePath: '/tmp/app/.hora/equip-core.json',
            installationPath: '.claude/skills',
          },
        },
        {
          tally: {
            filePath: '.hora/equip-core.json',
            installationPath: '.claude/agents',
          },
        },
      ]

      test.each(cases)('filePath: $tally.filePath', ({ tally }) => {
        const SpyClass = constructorSpy.spyOn(HoraCoreManifestFile)

        SpyClass.create(tally)

        expect(SpyClass.__spy__)
          .toHaveBeenCalledWith(tally)
      })
    })
  })
})

describe('HoraCoreManifestFile', () => {
  describe('#get:fs', () => {
    describe('when called as is', () => {
      test('should be fixed value', () => {
        const manifestFile = HoraCoreManifestFile.create({
          filePath: '/tmp/app/.hora/equip-core.json',
          installationPath: '.claude/skills',
        })

        const received = manifestFile.fs

        expect(received)
          .toBe(fs) // same reference
      })
    })
  })
})

describe('HoraCoreManifestFile', () => {
  describe('#get:path', () => {
    describe('when called as is', () => {
      test('should be fixed value', () => {
        const manifestFile = HoraCoreManifestFile.create({
          filePath: '/tmp/app/.hora/equip-core.json',
          installationPath: '.claude/skills',
        })

        const received = manifestFile.path

        expect(received)
          .toBe(path) // same reference
      })
    })
  })
})

describe('HoraCoreManifestFile', () => {
  describe('#loadEntryNames()', () => {
    describe('should be the skill names recorded for own installation path', () => {
      const cases = [
        {
          override: {
            manifestHash: {
              version: '0.0.1',
              installations: {
                '.claude/skills': {
                  entryNames: [
                    'hora-plan',
                  ],
                },
              },
            },
          },
          expected: [
            'hora-plan',
          ],
        },
        {
          override: {
            manifestHash: {
              version: '0.0.1',
              installations: {
                '.claude/skills': {
                  entryNames: [],
                },
              },
            },
          },
          expected: [],
        },
        {
          override: {
            manifestHash: {
              version: '0.0.1',
              installations: {
                '.claude/skills': {
                  entryNames: [
                    'hora-plan',
                  ],
                },
                '.claude/agents': {
                  entryNames: [
                    'hora-verifier.md',
                  ],
                },
              },
            },
          },
          expected: [
            'hora-plan',
          ],
        },
      ]

      test.each(cases)('installations: $override.manifestHash.installations', ({ override, expected }) => {
        const manifestFile = HoraCoreManifestFile.create({
          filePath: '/tmp/app/.hora/equip-core.json',
          installationPath: '.claude/skills',
        })

        jest.spyOn(manifestFile, 'load')
          .mockReturnValue(override.manifestHash)

        const received = manifestFile.loadEntryNames()

        expect(received)
          .toEqual(expected)
      })
    })

    describe('should be empty when own installation path is not recorded', () => {
      const cases = [
        {
          override: {
            manifestHash: null,
          },
        },
        {
          override: {
            manifestHash: {
              version: '0.0.1',
            },
          },
        },
        {
          override: {
            manifestHash: {
              version: '0.0.1',
              installations: {},
            },
          },
        },
        {
          override: {
            manifestHash: {
              version: '0.0.1',
              installations: {
                '.claude/agents': {
                  entryNames: [
                    'hora-verifier.md',
                  ],
                },
              },
            },
          },
        },
        {
          override: {
            manifestHash: {
              version: '0.0.1',
              installations: {
                '.claude/skills': {
                },
              },
            },
          },
        },
      ]

      test.each(cases)('manifestHash: $override.manifestHash', ({ override }) => {
        const manifestFile = HoraCoreManifestFile.create({
          filePath: '/tmp/app/.hora/equip-core.json',
          installationPath: '.claude/skills',
        })

        jest.spyOn(manifestFile, 'load')
          .mockReturnValue(override.manifestHash)

        const received = manifestFile.loadEntryNames()

        expect(received)
          .toEqual([])
      })
    })

    describe('should be empty when the recorded entryNames is not an array', () => {
      const cases = [
        {
          override: {
            entryNames: 'hora-plan',
          },
        },
        {
          override: {
            entryNames: 1,
          },
        },
        {
          override: {
            entryNames: null,
          },
        },
        {
          override: {
            entryNames: {
              0: 'hora-plan',
            },
          },
        },
      ]

      test.each(cases)('entryNames: $override.entryNames', ({ override }) => {
        const manifestFile = HoraCoreManifestFile.create({
          filePath: '/tmp/app/.hora/equip-core.json',
          installationPath: '.claude/skills',
        })

        jest.spyOn(manifestFile, 'load')
          .mockReturnValue({
            version: '0.0.1',
            installations: {
              '.claude/skills': {
                entryNames: override.entryNames,
              },
            },
          })

        const received = manifestFile.loadEntryNames()

        expect(received)
          .toEqual([])
      })
    })

    describe('should keep only the recorded entry names that are strings', () => {
      const cases = [
        {
          override: {
            entryNames: [
              'hora-plan',
              1,
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
            entryNames: [
              null,
              {
                entryName: 'hora-plan',
              },
              [
                'hora-plan',
              ],
            ],
          },
          expected: [],
        },
      ]

      test.each(cases)('entryNames: $override.entryNames', ({ override, expected }) => {
        const manifestFile = HoraCoreManifestFile.create({
          filePath: '/tmp/app/.hora/equip-core.json',
          installationPath: '.claude/skills',
        })

        jest.spyOn(manifestFile, 'load')
          .mockReturnValue({
            version: '0.0.1',
            installations: {
              '.claude/skills': {
                entryNames: override.entryNames,
              },
            },
          })

        const received = manifestFile.loadEntryNames()

        expect(received)
          .toEqual(expected)
      })
    })
  })
})

describe('HoraCoreManifestFile', () => {
  describe('#loadInstallation()', () => {
    describe('should be the entry of own installation path', () => {
      const cases = [
        {
          override: {
            manifestHash: {
              version: '0.0.1',
              installations: {
                '.claude/skills': {
                  entryNames: [
                    'hora-plan',
                  ],
                },
              },
            },
          },
          expected: {
            entryNames: [
              'hora-plan',
            ],
          },
        },
      ]

      test.each(cases)('installations: $override.manifestHash.installations', ({ override, expected }) => {
        const manifestFile = HoraCoreManifestFile.create({
          filePath: '/tmp/app/.hora/equip-core.json',
          installationPath: '.claude/skills',
        })

        jest.spyOn(manifestFile, 'load')
          .mockReturnValue(override.manifestHash)

        const received = manifestFile.loadInstallation()

        expect(received)
          .toEqual(expected)
      })
    })

    describe('should be null when own installation path is absent', () => {
      const cases = [
        {
          override: {
            manifestHash: null,
          },
        },
        {
          override: {
            manifestHash: {
              version: '0.0.1',
              installations: {
                '.claude/agents': {
                  entryNames: [],
                },
              },
            },
          },
        },
      ]

      test.each(cases)('manifestHash: $override.manifestHash', ({ override }) => {
        const manifestFile = HoraCoreManifestFile.create({
          filePath: '/tmp/app/.hora/equip-core.json',
          installationPath: '.claude/skills',
        })

        jest.spyOn(manifestFile, 'load')
          .mockReturnValue(override.manifestHash)

        const received = manifestFile.loadInstallation()

        expect(received)
          .toBeNull()
      })
    })
  })
})

describe('HoraCoreManifestFile', () => {
  describe('#loadInstallationHash()', () => {
    describe('should be the entries of every installation path', () => {
      const cases = [
        {
          override: {
            manifestHash: {
              version: '0.0.1',
              installations: {
                '.claude/skills': {
                  entryNames: [
                    'hora-plan',
                  ],
                },
                '.claude/agents': {
                  entryNames: [
                    'hora-verifier.md',
                  ],
                },
              },
            },
          },
          expected: {
            '.claude/skills': {
              entryNames: [
                'hora-plan',
              ],
            },
            '.claude/agents': {
              entryNames: [
                'hora-verifier.md',
              ],
            },
          },
        },
      ]

      test.each(cases)('installations: $override.manifestHash.installations', ({ override, expected }) => {
        const manifestFile = HoraCoreManifestFile.create({
          filePath: '/tmp/app/.hora/equip-core.json',
          installationPath: '.claude/skills',
        })

        jest.spyOn(manifestFile, 'load')
          .mockReturnValue(override.manifestHash)

        const received = manifestFile.loadInstallationHash()

        expect(received)
          .toEqual(expected)
      })
    })

    describe('should be empty when no manifest is readable', () => {
      const cases = [
        {
          override: {
            manifestHash: null,
          },
        },
        {
          override: {
            manifestHash: {
              version: '0.0.1',
            },
          },
        },
      ]

      test.each(cases)('manifestHash: $override.manifestHash', ({ override }) => {
        const manifestFile = HoraCoreManifestFile.create({
          filePath: '/tmp/app/.hora/equip-core.json',
          installationPath: '.claude/skills',
        })

        jest.spyOn(manifestFile, 'load')
          .mockReturnValue(override.manifestHash)

        const received = manifestFile.loadInstallationHash()

        expect(received)
          .toEqual({})
      })
    })
  })
})

describe('HoraCoreManifestFile', () => {
  describe('#load()', () => {
    describe('should parse the manifest', () => {
      const cases = [
        {
          override: {
            content: '{"version":"0.0.1","installations":{".claude/skills":{"entryNames":["hora-plan"]}}}',
          },
          expected: {
            version: '0.0.1',
            installations: {
              '.claude/skills': {
                entryNames: [
                  'hora-plan',
                ],
              },
            },
          },
        },
        {
          override: {
            content: '{"version":null,"installations":{}}',
          },
          expected: {
            version: null,
            installations: {},
          },
        },
      ]

      test.each(cases)('content: $override.content', ({ override, expected }) => {
        const manifestFile = HoraCoreManifestFile.create({
          filePath: '/tmp/app/.hora/equip-core.json',
          installationPath: '.claude/skills',
        })

        jest.spyOn(fs, 'existsSync')
          .mockReturnValue(true)
        jest.spyOn(fs, 'readFileSync')
          .mockReturnValue(override.content)

        const received = manifestFile.load()

        expect(received)
          .toEqual(expected)
      })
    })

    describe('should be null when the manifest is absent', () => {
      test('when the file does not exist', () => {
        const manifestFile = HoraCoreManifestFile.create({
          filePath: '/tmp/app/.hora/equip-core.json',
          installationPath: '.claude/skills',
        })

        jest.spyOn(fs, 'existsSync')
          .mockReturnValue(false)

        const received = manifestFile.load()

        expect(received)
          .toBeNull()
      })
    })

    describe('should be null when the manifest is broken', () => {
      const cases = [
        {
          override: {
            content: 'not json',
          },
        },
        {
          override: {
            content: '{"installations": {',
          },
        },
      ]

      test.each(cases)('content: $override.content', ({ override }) => {
        const manifestFile = HoraCoreManifestFile.create({
          filePath: '/tmp/app/.hora/equip-core.json',
          installationPath: '.claude/skills',
        })

        jest.spyOn(fs, 'existsSync')
          .mockReturnValue(true)
        jest.spyOn(fs, 'readFileSync')
          .mockReturnValue(override.content)

        const received = manifestFile.load()

        expect(received)
          .toBeNull()
      })
    })
  })
})

describe('HoraCoreManifestFile', () => {
  describe('#save()', () => {
    describe('should record own installation path', () => {
      const cases = [
        {
          input: {
            version: '0.0.1',
            entryNames: [
              'hora-plan',
            ],
          },
          override: {
            installationHash: {},
          },
          expected: {
            version: '0.0.1',
            installations: {
              '.claude/skills': {
                entryNames: [
                  'hora-plan',
                ],
              },
            },
          },
        },
        {
          input: {
            version: null,
            entryNames: [],
          },
          override: {
            installationHash: {},
          },
          expected: {
            version: null,
            installations: {
              '.claude/skills': {
                entryNames: [],
              },
            },
          },
        },
      ]

      test.each(cases)('version: $input.version', ({ input, override, expected }) => {
        const manifestFile = HoraCoreManifestFile.create({
          filePath: '/tmp/app/.hora/equip-core.json',
          installationPath: '.claude/skills',
        })

        jest.spyOn(manifestFile, 'loadInstallationHash')
          .mockReturnValue(override.installationHash)

        const writeSpy = jest.spyOn(manifestFile, 'write')
          .mockReturnValue()

        manifestFile.save(input)

        expect(writeSpy)
          .toHaveBeenCalledWith({
            manifestHash: expected,
          })
      })
    })

    describe('should keep the entries of the other installation paths', () => {
      const cases = [
        {
          input: {
            version: '0.0.1',
            entryNames: [
              'hora-plan',
            ],
          },
          override: {
            installationHash: {
              '.claude/agents': {
                entryNames: [
                  'hora-verifier.md',
                ],
              },
            },
          },
          expected: {
            version: '0.0.1',
            installations: {
              '.claude/agents': {
                entryNames: [
                  'hora-verifier.md',
                ],
              },
              '.claude/skills': {
                entryNames: [
                  'hora-plan',
                ],
              },
            },
          },
        },
      ]

      test.each(cases)('version: $input.version', ({ input, override, expected }) => {
        const manifestFile = HoraCoreManifestFile.create({
          filePath: '/tmp/app/.hora/equip-core.json',
          installationPath: '.claude/skills',
        })

        jest.spyOn(manifestFile, 'loadInstallationHash')
          .mockReturnValue(override.installationHash)

        const writeSpy = jest.spyOn(manifestFile, 'write')
          .mockReturnValue()

        manifestFile.save(input)

        expect(writeSpy)
          .toHaveBeenCalledWith({
            manifestHash: expected,
          })
      })
    })

    describe('should replace the entry of own installation path', () => {
      const cases = [
        {
          input: {
            version: '0.0.2',
            entryNames: [
              'hora-plan',
            ],
          },
          override: {
            installationHash: {
              '.claude/skills': {
                entryNames: [
                  'bank-id',
                ],
              },
            },
          },
          expected: {
            version: '0.0.2',
            installations: {
              '.claude/skills': {
                entryNames: [
                  'hora-plan',
                ],
              },
            },
          },
        },
      ]

      test.each(cases)('version: $input.version', ({ input, override, expected }) => {
        const manifestFile = HoraCoreManifestFile.create({
          filePath: '/tmp/app/.hora/equip-core.json',
          installationPath: '.claude/skills',
        })

        jest.spyOn(manifestFile, 'loadInstallationHash')
          .mockReturnValue(override.installationHash)

        const writeSpy = jest.spyOn(manifestFile, 'write')
          .mockReturnValue()

        manifestFile.save(input)

        expect(writeSpy)
          .toHaveBeenCalledWith({
            manifestHash: expected,
          })
      })
    })
  })
})

describe('HoraCoreManifestFile', () => {
  describe('#write()', () => {
    describe('should write the manifest as indented JSON', () => {
      const cases = [
        {
          input: {
            manifestHash: {
              version: '0.0.1',
              installations: {
                '.claude/skills': {
                  entryNames: [
                    'hora-plan',
                  ],
                },
              },
            },
          },
          expected: [
            '/tmp/app/.hora/equip-core.json',
            '{\n  "version": "0.0.1",\n  "installations": {\n    ".claude/skills": {\n      "entryNames": [\n        "hora-plan"\n      ]\n    }\n  }\n}\n',
          ],
        },
        {
          input: {
            manifestHash: {
              version: null,
              installations: {},
            },
          },
          expected: [
            '/tmp/app/.hora/equip-core.json',
            '{\n  "version": null,\n  "installations": {}\n}\n',
          ],
        },
      ]

      test.each(cases)('version: $input.manifestHash.version', ({ input, expected }) => {
        const manifestFile = HoraCoreManifestFile.create({
          filePath: '/tmp/app/.hora/equip-core.json',
          installationPath: '.claude/skills',
        })

        jest.spyOn(fs, 'mkdirSync')
          .mockReturnValue()

        const writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync')
          .mockReturnValue()

        manifestFile.write(input)

        expect(writeFileSyncSpy)
          .toHaveBeenCalledWith(...expected)
      })
    })

    describe('should create the directory holding the manifest', () => {
      const cases = [
        {
          input: {
            manifestHash: {
              version: null,
              installations: {},
            },
          },
          expected: [
            '/tmp/app/.hora',
            {
              recursive: true,
            },
          ],
        },
      ]

      test.each(cases)('version: $input.manifestHash.version', ({ input, expected }) => {
        const manifestFile = HoraCoreManifestFile.create({
          filePath: '/tmp/app/.hora/equip-core.json',
          installationPath: '.claude/skills',
        })

        const mkdirSyncSpy = jest.spyOn(fs, 'mkdirSync')
          .mockReturnValue()

        jest.spyOn(fs, 'writeFileSync')
          .mockReturnValue()

        manifestFile.write(input)

        expect(mkdirSyncSpy)
          .toHaveBeenCalledWith(...expected)
      })
    })
  })
})

describe('HoraCoreManifestFile', () => {
  describe('#remove()', () => {
    describe('should remove the file when no entry is left', () => {
      const cases = [
        {
          override: {
            manifestHash: {
              version: '0.0.1',
              installations: {
                '.claude/skills': {
                  entryNames: [],
                },
              },
            },
          },
          expected: [
            '/tmp/app/.hora/equip-core.json',
            {
              force: true,
            },
          ],
        },
      ]

      test.each(cases)('installations: $override.manifestHash.installations', ({ override, expected }) => {
        const manifestFile = HoraCoreManifestFile.create({
          filePath: '/tmp/app/.hora/equip-core.json',
          installationPath: '.claude/skills',
        })

        jest.spyOn(manifestFile, 'load')
          .mockReturnValue(override.manifestHash)

        const rmSyncSpy = jest.spyOn(fs, 'rmSync')
          .mockReturnValue()

        manifestFile.remove()

        expect(rmSyncSpy)
          .toHaveBeenCalledWith(...expected)
      })
    })

    describe('should keep the file when another entry is left', () => {
      const cases = [
        {
          override: {
            manifestHash: {
              version: '0.0.1',
              installations: {
                '.claude/skills': {
                  entryNames: [],
                },
                '.claude/agents': {
                  entryNames: [
                    'hora-verifier.md',
                  ],
                },
              },
            },
          },
          expected: {
            manifestHash: {
              version: '0.0.1',
              installations: {
                '.claude/agents': {
                  entryNames: [
                    'hora-verifier.md',
                  ],
                },
              },
            },
          },
        },
      ]

      test.each(cases)('installations: $override.manifestHash.installations', ({ override, expected }) => {
        const manifestFile = HoraCoreManifestFile.create({
          filePath: '/tmp/app/.hora/equip-core.json',
          installationPath: '.claude/skills',
        })

        jest.spyOn(manifestFile, 'load')
          .mockReturnValue(override.manifestHash)

        const rmSyncSpy = jest.spyOn(fs, 'rmSync')
          .mockReturnValue()
        const writeSpy = jest.spyOn(manifestFile, 'write')
          .mockReturnValue()

        manifestFile.remove()

        expect(writeSpy)
          .toHaveBeenCalledWith(expected)
        expect(rmSyncSpy)
          .not
          .toHaveBeenCalled()
      })
    })

    describe('should do nothing when no manifest is readable', () => {
      test('when the manifest is absent', () => {
        const manifestFile = HoraCoreManifestFile.create({
          filePath: '/tmp/app/.hora/equip-core.json',
          installationPath: '.claude/skills',
        })

        jest.spyOn(manifestFile, 'load')
          .mockReturnValue(null)

        const rmSyncSpy = jest.spyOn(fs, 'rmSync')
          .mockReturnValue()
        const writeSpy = jest.spyOn(manifestFile, 'write')
          .mockReturnValue()

        manifestFile.remove()

        expect(rmSyncSpy)
          .not
          .toHaveBeenCalled()
        expect(writeSpy)
          .not
          .toHaveBeenCalled()
      })
    })
  })
})

describe('HoraCoreManifestFile', () => {
  describe('#buildRemainingInstallationHash()', () => {
    describe('should drop the entry of own installation path', () => {
      const cases = [
        {
          override: {
            installationHash: {
              '.claude/skills': {
                entryNames: [],
              },
              '.claude/agents': {
                entryNames: [
                  'hora-verifier.md',
                ],
              },
            },
          },
          expected: {
            '.claude/agents': {
              entryNames: [
                'hora-verifier.md',
              ],
            },
          },
        },
        {
          override: {
            installationHash: {
              '.claude/skills': {
                entryNames: [],
              },
            },
          },
          expected: {},
        },
        {
          override: {
            installationHash: {},
          },
          expected: {},
        },
      ]

      test.each(cases)('installationHash: $override.installationHash', ({ override, expected }) => {
        const manifestFile = HoraCoreManifestFile.create({
          filePath: '/tmp/app/.hora/equip-core.json',
          installationPath: '.claude/skills',
        })

        jest.spyOn(manifestFile, 'loadInstallationHash')
          .mockReturnValue(override.installationHash)

        const received = manifestFile.buildRemainingInstallationHash()

        expect(received)
          .toEqual(expected)
      })
    })
  })
})
