import fs from 'node:fs'
import path from 'node:path'

import HoraCoreCli from '../../../lib/equip/HoraCoreCli.js'

import CommandLineArguments from '../../../lib/equip/CommandLineArguments.js'
import ConsumerPackageConfig from '../../../lib/equip/ConsumerPackageConfig.js'
import HoraCoreInstaller from '../../../lib/equip/HoraCoreInstaller.js'

describe('HoraCoreCli', () => {
  describe('constructor', () => {
    describe('should keep property', () => {
      describe('#commandLineArguments', () => {
        const cases = [
          {
            input: {
              commandLineArguments: CommandLineArguments.create({
                args: [
                  'install',
                ],
              }),
            },
          },
          {
            input: {
              commandLineArguments: CommandLineArguments.create({
                args: [],
              }),
            },
          },
        ]

        test.each(cases)('args: $input.commandLineArguments.args', ({ input }) => {
          const args = {
            commandLineArguments: input.commandLineArguments,
            packageConfig: null,
            workingDirectoryPath: '',
            logger: null,
          }

          const cli = new HoraCoreCli(args)

          expect(cli)
            .toHaveProperty('commandLineArguments', input.commandLineArguments)
        })
      })

      describe('#packageConfig', () => {
        const cases = [
          {
            input: {
              packageConfig: ConsumerPackageConfig.create({
                directoryPath: '/consumer',
              }),
            },
          },
          {
            input: {
              packageConfig: ConsumerPackageConfig.create({
                directoryPath: '/tmp',
              }),
            },
          },
        ]

        test.each(cases)('filePath: $input.packageConfig.filePath', ({ input }) => {
          const args = {
            commandLineArguments: null,
            packageConfig: input.packageConfig,
            workingDirectoryPath: '',
            logger: null,
          }

          const cli = new HoraCoreCli(args)

          expect(cli)
            .toHaveProperty('packageConfig', input.packageConfig)
        })
      })

      describe('#workingDirectoryPath', () => {
        const cases = [
          {
            input: {
              workingDirectoryPath: '/consumer',
            },
            expected: '/consumer',
          },
          {
            input: {
              workingDirectoryPath: '/tmp/consumer',
            },
            expected: '/tmp/consumer',
          },
        ]

        test.each(cases)('workingDirectoryPath: $input.workingDirectoryPath', ({ input, expected }) => {
          const args = {
            commandLineArguments: null,
            packageConfig: null,
            workingDirectoryPath: input.workingDirectoryPath,
            logger: null,
          }

          const cli = new HoraCoreCli(args)

          expect(cli)
            .toHaveProperty('workingDirectoryPath', expected)
        })
      })

      describe('#logger', () => {
        const cases = [
          {
            input: {
              logger: console,
            },
          },
          {
            input: {
              logger: {
                log: () => {},
                error: () => {},
              },
            },
          },
        ]

        test.each(cases)('logger: $input.logger', ({ input }) => {
          const args = {
            commandLineArguments: null,
            packageConfig: null,
            workingDirectoryPath: '',
            logger: input.logger,
          }

          const cli = new HoraCoreCli(args)

          expect(cli)
            .toHaveProperty('logger', input.logger)
        })
      })
    })
  })
})

describe('HoraCoreCli', () => {
  describe('.create()', () => {
    describe('should be an instance of own class', () => {
      const cases = [
        {
          input: {
            args: [
              'install',
            ],
            workingDirectoryPath: '/consumer',
          },
        },
        {
          input: {
            args: [],
            workingDirectoryPath: '/tmp',
          },
        },
      ]

      test.each(cases)('args: $input.args', ({ input }) => {
        const received = HoraCoreCli.create(input)

        expect(received)
          .toBeInstanceOf(HoraCoreCli)
      })
    })

    describe('should hand the working directory to the package config', () => {
      const cases = [
        {
          input: {
            workingDirectoryPath: '/consumer',
          },
          expected: '/consumer/package.json',
        },
        {
          input: {
            workingDirectoryPath: '/tmp/consumer',
          },
          expected: '/tmp/consumer/package.json',
        },
      ]

      test.each(cases)('workingDirectoryPath: $input.workingDirectoryPath', ({ input, expected }) => {
        const args = {
          args: [],
          workingDirectoryPath: input.workingDirectoryPath,
        }

        const cli = HoraCoreCli.create(args)
        const received = cli.packageConfig.filePath

        expect(received)
          .toBe(expected)
      })
    })

    describe('should fill default workingDirectoryPath', () => {
      test('when omitted', () => {
        const args = {
          args: [],
        }

        const cli = HoraCoreCli.create(args)

        expect(cli)
          .toHaveProperty('workingDirectoryPath', process.cwd())
      })
    })

    describe('should fill default logger', () => {
      test('when omitted', () => {
        const args = {
          args: [],
        }

        const cli = HoraCoreCli.create(args)

        expect(cli)
          .toHaveProperty('logger', console)
      })
    })
  })
})

describe('HoraCoreCli', () => {
  describe('.runPostinstall()', () => {
    describe('should equip a consuming repository', () => {
      test('when the repository is not this package', () => {
        jest.spyOn(HoraCoreCli, 'isOwnRepository')
          .mockReturnValue(false)

        const runSpy = jest.spyOn(HoraCoreCli.prototype, 'run')
          .mockReturnValue(0)

        const received = HoraCoreCli.runPostinstall({
          env: {
            npm_config_local_prefix: '/consumer',
          },
          logger: {
            log: () => {},
            error: () => {},
          },
        })

        expect(runSpy)
          .toHaveBeenCalledWith()
        expect(received)
          .toBe(0)
      })
    })

    describe('should equip nothing in this package itself', () => {
      test('when the repository is this package', () => {
        jest.spyOn(HoraCoreCli, 'isOwnRepository')
          .mockReturnValue(true)

        const runSpy = jest.spyOn(HoraCoreCli.prototype, 'run')
          .mockReturnValue(0)

        const received = HoraCoreCli.runPostinstall({
          env: {
            npm_config_local_prefix: '/consumer',
          },
          logger: {
            log: () => {},
            error: () => {},
          },
        })

        expect(runSpy)
          .not
          .toHaveBeenCalled()
        expect(received)
          .toBe(0)
      })
    })

    describe('should end successfully on a failed install', () => {
      const cases = [
        {
          override: {
            exitCode: 1,
          },
        },
      ]

      test.each(cases)('exitCode: $override.exitCode', ({ override }) => {
        jest.spyOn(HoraCoreCli, 'isOwnRepository')
          .mockReturnValue(false)
        jest.spyOn(HoraCoreCli.prototype, 'run')
          .mockReturnValue(override.exitCode)

        const errorSpy = jest.fn()

        const received = HoraCoreCli.runPostinstall({
          env: {
            npm_config_local_prefix: '/consumer',
          },
          logger: {
            log: () => {},
            error: errorSpy,
          },
        })

        expect(received)
          .toBe(0)
        expect(errorSpy)
          .toHaveBeenCalledWith('The kit was not installed. Run `npx hora-core install` once the above is settled.')
      })
    })

    describe('should end successfully on a raised failure', () => {
      const cases = [
        {
          override: {
            error: new Error('ENOTDIR: not a directory, scandir \'/consumer/.claude/agents\''),
          },
          expected: 'The kit was not installed. Run `npx hora-core install` once the above is settled.',
        },
      ]

      test.each(cases)('error: $override.error.message', ({ override, expected }) => {
        jest.spyOn(HoraCoreCli, 'isOwnRepository')
          .mockReturnValue(false)
        jest.spyOn(HoraCoreCli.prototype, 'run')
          .mockImplementation(() => {
            throw override.error
          })

        const errorSpy = jest.fn()

        const received = HoraCoreCli.runPostinstall({
          env: {
            npm_config_local_prefix: '/consumer',
          },
          logger: {
            log: () => {},
            error: errorSpy,
          },
        })

        expect(received)
          .toBe(0)
        expect(errorSpy)
          .toHaveBeenCalledWith(expected)
      })
    })
  })
})

describe('HoraCoreCli', () => {
  describe('.createForPostinstall()', () => {
    describe('should install into the repository npm exports', () => {
      const cases = [
        {
          input: {
            env: {
              npm_config_local_prefix: '/consumer',
            },
          },
          expected: '/consumer',
        },
        {
          input: {
            env: {
              INIT_CWD: '/elsewhere',
            },
          },
          expected: '/elsewhere',
        },
      ]

      test.each(cases)('env: $input.env', ({ input, expected }) => {
        const cli = HoraCoreCli.createForPostinstall({
          env: input.env,
          logger: {
            log: () => {},
            error: () => {},
          },
        })

        expect(cli)
          .toHaveProperty('workingDirectoryPath', expected)
      })
    })

    describe('should run the install command', () => {
      test('when created as is', () => {
        const cli = HoraCoreCli.createForPostinstall({
          env: {
            npm_config_local_prefix: '/consumer',
          },
          logger: {
            log: () => {},
            error: () => {},
          },
        })

        const received = cli.commandLineArguments.extractCommand()

        expect(received)
          .toBe('install')
      })
    })
  })
})

describe('HoraCoreCli', () => {
  describe('.extractConsumerDirectoryPath()', () => {
    describe('should prefer the local prefix over the initial directory', () => {
      const cases = [
        {
          input: {
            env: {
              npm_config_local_prefix: '/consumer',
              INIT_CWD: '/elsewhere',
            },
          },
          expected: '/consumer',
        },
        {
          input: {
            env: {
              INIT_CWD: '/elsewhere',
            },
          },
          expected: '/elsewhere',
        },
        {
          input: {
            env: {
              npm_config_local_prefix: '',
              INIT_CWD: '/elsewhere',
            },
          },
          expected: '/elsewhere',
        },
      ]

      test.each(cases)('env: $input.env', ({ input, expected }) => {
        const received = HoraCoreCli.extractConsumerDirectoryPath(input)

        expect(received)
          .toBe(expected)
      })
    })

    describe('should fall back to the working directory', () => {
      test('when npm exported neither', () => {
        const received = HoraCoreCli.extractConsumerDirectoryPath({
          env: {},
        })

        expect(received)
          .toBe(process.cwd())
      })
    })
  })
})

describe('HoraCoreCli', () => {
  describe('.get:ownPackageName', () => {
    describe('when called as is', () => {
      test('should be fixed value', () => {
        const received = HoraCoreCli.ownPackageName

        expect(received)
          .toBe('@openreachtech/hora')
      })
    })
  })
})

describe('HoraCoreCli', () => {
  describe('.isOwnRepository()', () => {
    describe('should tell this package apart from a consuming repository', () => {
      const cases = [
        {
          override: {
            name: '@openreachtech/hora',
          },
          expected: true,
        },
        {
          override: {
            name: 'alpha-app',
          },
          expected: false,
        },
        {
          override: {
            name: null,
          },
          expected: false,
        },
      ]

      test.each(cases)('name: $override.name', ({ override, expected }) => {
        jest.spyOn(ConsumerPackageConfig.prototype, 'extractName')
          .mockReturnValue(override.name)

        const received = HoraCoreCli.isOwnRepository({
          env: {
            npm_config_local_prefix: '/consumer',
          },
        })

        expect(received)
          .toBe(expected)
      })
    })
  })
})

describe('HoraCoreCli', () => {
  describe('.get:CommandLineArgumentsCtor', () => {
    describe('when called as is', () => {
      test('should be fixed value', () => {
        const received = HoraCoreCli.CommandLineArgumentsCtor

        expect(received)
          .toBe(CommandLineArguments) // same reference
      })
    })
  })
})

describe('HoraCoreCli', () => {
  describe('.get:ConsumerPackageConfigCtor', () => {
    describe('when called as is', () => {
      test('should be fixed value', () => {
        const received = HoraCoreCli.ConsumerPackageConfigCtor

        expect(received)
          .toBe(ConsumerPackageConfig) // same reference
      })
    })
  })
})

describe('HoraCoreCli', () => {
  describe('.get:HoraCoreInstallerCtor', () => {
    describe('when called as is', () => {
      test('should be fixed value', () => {
        const received = HoraCoreCli.HoraCoreInstallerCtor

        expect(received)
          .toBe(HoraCoreInstaller) // same reference
      })
    })
  })
})

describe('HoraCoreCli', () => {
  describe('.get:defaultTargetDirectorySegments', () => {
    describe('when called as is', () => {
      test('should be fixed value', () => {
        const expected = [
          '.claude',
        ]

        const received = HoraCoreCli.defaultTargetDirectorySegments

        expect(received)
          .toEqual(expected)
      })
    })
  })
})

describe('HoraCoreCli', () => {
  describe('.buildDistributionDirectoryPath()', () => {
    describe('when called as is', () => {
      test('should be the dist/ of this package', () => {
        const expected = path.resolve(
          import.meta.dirname,
          '../../../dist'
        )

        const received = HoraCoreCli.buildDistributionDirectoryPath()

        expect(received)
          .toBe(`${expected}${path.sep}`)
      })
    })
  })
})

describe('HoraCoreCli', () => {
  describe('.buildPathSteps()', () => {
    describe('should be every step from the base path down to the target path', () => {
      const cases = [
        {
          input: {
            basePath: '/consumer',
            targetPath: '/consumer/.claude/skills',
          },
          expected: [
            '/consumer/.claude',
            '/consumer/.claude/skills',
          ],
        },
        {
          input: {
            basePath: '/consumer/.claude',
            targetPath: '/consumer/.claude/agents',
          },
          expected: [
            '/consumer/.claude/agents',
          ],
        },
        {
          input: {
            basePath: '/consumer',
            targetPath: '/consumer',
          },
          expected: [],
        },
      ]

      test.each(cases)('targetPath: $input.targetPath', ({ input, expected }) => {
        const received = HoraCoreCli.buildPathSteps(input)

        expect(received)
          .toEqual(expected)
      })
    })
  })
})

describe('HoraCoreCli', () => {
  describe('#dispatch()', () => {
    describe('should dispatch to the command', () => {
      const cases = [
        {
          input: {
            args: [
              'install',
            ],
          },
          expected: 'runInstall',
        },
        {
          input: {
            args: [
              'list',
            ],
          },
          expected: 'runSelection',
        },
        {
          input: {
            args: [
              'uninstall',
            ],
          },
          expected: 'runUninstall',
        },
        {
          input: {
            args: [
              'help',
            ],
          },
          expected: 'runHelp',
        },
        {
          input: {
            args: [],
          },
          expected: 'runHelp',
        },
      ]

      test.each(cases)('args: $input.args', ({ input, expected }) => {
        const cli = HoraCoreCli.create({
          args: input.args,
          workingDirectoryPath: '/consumer',
          logger: {
            log: () => {},
            error: () => {},
          },
        })

        const commandSpy = jest.spyOn(cli, expected)
          .mockReturnValue(0)

        cli.dispatch()

        expect(commandSpy)
          .toHaveBeenCalledWith()
      })
    })

    describe('should report a command it does not have', () => {
      const cases = [
        {
          input: {
            args: [
              'bogus',
            ],
          },
          expected: 'Unknown command: bogus',
        },
        {
          input: {
            args: [
              'installl',
            ],
          },
          expected: 'Unknown command: installl',
        },
      ]

      test.each(cases)('args: $input.args', ({ input, expected }) => {
        const logger = {
          log: jest.fn(),
          error: jest.fn(),
        }
        const cli = HoraCoreCli.create({
          args: input.args,
          workingDirectoryPath: '/consumer',
          logger,
        })

        const received = cli.run()

        expect(logger.error)
          .toHaveBeenCalledWith(expected)
        expect(received)
          .toBe(1)
      })
    })
  })
})

describe('HoraCoreCli', () => {
  describe('#runInstall()', () => {
    describe('should report what each payload installed', () => {
      const cases = [
        {
          override: {
            payloadNames: [
              'skills',
            ],
            installResult: {
              installedEntryNames: [
                'hora-plan',
              ],
              removedEntryNames: [],
            },
          },
          expected: [
            'Removed 0 entries from /consumer/.claude/skills',
            'Installed 1 entries into /consumer/.claude/skills',
          ],
        },
        {
          override: {
            payloadNames: [
              'agents',
            ],
            installResult: {
              installedEntryNames: [
                'hora-verifier.md',
                'hora-digester.md',
              ],
              removedEntryNames: [
                'hora-retired.md',
              ],
            },
          },
          expected: [
            'Removed 1 entries from /consumer/.claude/agents',
            'Installed 2 entries into /consumer/.claude/agents',
          ],
        },
      ]

      test.each(cases)('payloadNames: $override.payloadNames', ({ override, expected }) => {
        const logger = {
          log: jest.fn(),
          error: jest.fn(),
        }
        const cli = HoraCoreCli.create({
          args: [
            'install',
          ],
          workingDirectoryPath: '/consumer',
          logger,
        })

        jest.spyOn(cli, 'collectPayloadNames')
          .mockReturnValue(override.payloadNames)
        jest.spyOn(HoraCoreInstaller.prototype, 'install')
          .mockReturnValue(override.installResult)

        const received = cli.runInstall()

        expect(logger.log)
          .toHaveBeenNthCalledWith(1, expected[0])
        expect(logger.log)
          .toHaveBeenNthCalledWith(2, expected[1])
        expect(received)
          .toBe(0)
      })
    })

    describe('should install every payload', () => {
      const cases = [
        {
          override: {
            payloadNames: [
              'agents',
              'skills',
            ],
          },
          expected: 2,
        },
        {
          override: {
            payloadNames: [],
          },
          expected: 0,
        },
      ]

      test.each(cases)('payloadNames: $override.payloadNames', ({ override, expected }) => {
        const cli = HoraCoreCli.create({
          args: [
            'install',
          ],
          workingDirectoryPath: '/consumer',
          logger: {
            log: () => {},
            error: () => {},
          },
        })

        jest.spyOn(cli, 'collectPayloadNames')
          .mockReturnValue(override.payloadNames)

        const installSpy = jest.spyOn(HoraCoreInstaller.prototype, 'install')
          .mockReturnValue({
            installedEntryNames: [],
            removedEntryNames: [],
          })

        cli.runInstall()

        expect(installSpy)
          .toHaveBeenCalledTimes(expected)
      })
    })

    describe('should install nothing when a directory is reached through a symbolic link', () => {
      test('args: install', () => {
        const cli = HoraCoreCli.create({
          args: [
            'install',
          ],
          workingDirectoryPath: '/consumer',
        })

        jest.spyOn(cli, 'verifyPaths')
          .mockReturnValue(1)

        const installSpy = jest.spyOn(HoraCoreInstaller.prototype, 'install')
          .mockReturnValue({
            installedEntryNames: [],
            removedEntryNames: [],
          })

        const received = cli.runInstall()

        expect(received)
          .toBe(1)
        expect(installSpy)
          .not
          .toHaveBeenCalled()
      })
    })
  })
})

describe('HoraCoreCli', () => {
  describe('#run()', () => {
    describe('should report what a command raises, instead of letting it escape', () => {
      const cases = [
        {
          override: {
            error: new Error('ENOTDIR: not a directory, scandir \'/consumer/.claude/agents\''),
          },
          expected: 'ENOTDIR: not a directory, scandir \'/consumer/.claude/agents\'',
        },
        {
          override: {
            error: new Error('EACCES: permission denied, mkdir \'/consumer/.claude/skills\''),
          },
          expected: 'EACCES: permission denied, mkdir \'/consumer/.claude/skills\'',
        },
      ]

      test.each(cases)('error: $override.error.message', ({ override, expected }) => {
        const logger = {
          log: jest.fn(),
          error: jest.fn(),
        }
        const cli = HoraCoreCli.create({
          args: [
            'install',
          ],
          workingDirectoryPath: '/consumer',
          logger,
        })

        jest.spyOn(cli, 'dispatch')
          .mockImplementation(() => {
            throw override.error
          })

        const received = cli.run()

        expect(received)
          .toBe(1)
        expect(logger.error)
          .toHaveBeenCalledWith(expected)
      })
    })

    describe('should be the exit code of the command it dispatched', () => {
      const cases = [
        {
          override: {
            exitCode: 0,
          },
        },
        {
          override: {
            exitCode: 1,
          },
        },
      ]

      test.each(cases)('exitCode: $override.exitCode', ({ override }) => {
        const cli = HoraCoreCli.create({
          args: [
            'install',
          ],
          workingDirectoryPath: '/consumer',
        })

        jest.spyOn(cli, 'dispatch')
          .mockReturnValue(override.exitCode)

        const received = cli.run()

        expect(received)
          .toBe(override.exitCode)
      })
    })
  })
})

describe('HoraCoreCli', () => {
  describe('#reportFailure()', () => {
    describe('should report the failure and fail', () => {
      const cases = [
        {
          input: {
            error: new Error('EROFS: read-only file system'),
          },
          expected: 'EROFS: read-only file system',
        },
      ]

      test.each(cases)('error: $input.error.message', ({ input, expected }) => {
        const logger = {
          log: jest.fn(),
          error: jest.fn(),
        }
        const cli = HoraCoreCli.create({
          args: [
            'install',
          ],
          workingDirectoryPath: '/consumer',
          logger,
        })

        const received = cli.reportFailure(input)

        expect(received)
          .toBe(1)
        expect(logger.error)
          .toHaveBeenCalledWith(expected)
      })
    })
  })
})

describe('HoraCoreCli', () => {
  describe('.buildFailureMessage()', () => {
    describe('should be the message of the error', () => {
      const cases = [
        {
          input: {
            error: new Error('EACCES: permission denied'),
          },
          expected: 'EACCES: permission denied',
        },
        {
          input: {
            error: new Error('ENOENT: no such file, open \'/consumer/.claude/スキル\''),
          },
          expected: 'ENOENT: no such file, open \'/consumer/.claude/スキル\'',
        },
      ]

      test.each(cases)('error: $input.error.message', ({ input, expected }) => {
        const received = HoraCoreCli.buildFailureMessage(input)

        expect(received)
          .toBe(expected)
      })
    })

    describe('should drop the characters a terminal acts on', () => {
      const cases = [
        {
          input: {
            error: new Error('EACCES: denied, rm \'/consumer/.claude/skills/\u001b[2Jhora\''),
          },
          expected: 'EACCES: denied, rm \'/consumer/.claude/skills/?[2Jhora\'',
        },
        {
          input: {
            error: new Error('ENOENT: no such file\u0000\u007f'),
          },
          expected: 'ENOENT: no such file??',
        },
      ]

      test.each(cases)('error: $input.error.message', ({ input, expected }) => {
        const received = HoraCoreCli.buildFailureMessage(input)

        expect(received)
          .toBe(expected)
      })
    })

    describe('should be the value itself when it is not an error', () => {
      const cases = [
        {
          input: {
            error: 'raised a string',
          },
          expected: 'raised a string',
        },
        {
          input: {
            error: null,
          },
          expected: 'null',
        },
      ]

      test.each(cases)('error: $input.error', ({ input, expected }) => {
        const received = HoraCoreCli.buildFailureMessage(input)

        expect(received)
          .toBe(expected)
      })
    })
  })
})

describe('HoraCoreCli', () => {
  describe('.buildPrintableCharacter()', () => {
    describe('should be the character itself when a terminal prints it', () => {
      const cases = [
        {
          input: {
            character: 'a',
          },
        },
        {
          input: {
            character: ' ',
          },
        },
        {
          input: {
            character: 'ス',
          },
        },
      ]

      test.each(cases)('character: $input.character', ({ input }) => {
        const received = HoraCoreCli.buildPrintableCharacter(input)

        expect(received)
          .toBe(input.character)
      })
    })

    describe('should stand in for the character when a terminal acts on it', () => {
      const cases = [
        {
          input: {
            character: '\u001b',
          },
        },
        {
          input: {
            character: '\u0000',
          },
        },
        {
          input: {
            character: '\u007f',
          },
        },
        {
          input: {
            character: '\n',
          },
        },
      ]

      test.each(cases)('codePoint: $input.character.codePointAt', ({ input }) => {
        const received = HoraCoreCli.buildPrintableCharacter(input)

        expect(received)
          .toBe('?')
      })
    })
  })
})

describe('HoraCoreCli', () => {
  describe('.runPostinstallCommand()', () => {
    describe('should report what building or running the command raises', () => {
      const cases = [
        {
          override: {
            error: new Error('EACCES: permission denied, open \'/consumer/package.json\''),
          },
          expected: 'EACCES: permission denied, open \'/consumer/package.json\'',
        },
      ]

      test.each(cases)('error: $override.error.message', ({ override, expected }) => {
        jest.spyOn(HoraCoreCli, 'isOwnRepository')
          .mockImplementation(() => {
            throw override.error
          })

        const errorSpy = jest.fn()

        const received = HoraCoreCli.runPostinstallCommand({
          env: {
            npm_config_local_prefix: '/consumer',
          },
          logger: {
            log: () => {},
            error: errorSpy,
          },
        })

        expect(received)
          .toBe(1)
        expect(errorSpy)
          .toHaveBeenCalledWith(expected)
      })
    })

    describe('should be the exit code of the command', () => {
      const cases = [
        {
          override: {
            exitCode: 0,
          },
        },
        {
          override: {
            exitCode: 1,
          },
        },
      ]

      test.each(cases)('exitCode: $override.exitCode', ({ override }) => {
        jest.spyOn(HoraCoreCli, 'isOwnRepository')
          .mockReturnValue(false)
        jest.spyOn(HoraCoreCli.prototype, 'run')
          .mockReturnValue(override.exitCode)

        const received = HoraCoreCli.runPostinstallCommand({
          env: {
            npm_config_local_prefix: '/consumer',
          },
          logger: {
            log: () => {},
            error: () => {},
          },
        })

        expect(received)
          .toBe(override.exitCode)
      })
    })
  })
})

describe('HoraCoreCli', () => {
  describe('#collectPayloadNames()', () => {
    describe('should be the sorted entries of dist/', () => {
      const cases = [
        {
          override: {
            payloadNames: [
              'skills',
              'agents',
            ],
          },
          expected: [
            'agents',
            'skills',
          ],
        },
        {
          override: {
            payloadNames: [],
          },
          expected: [],
        },
      ]

      test.each(cases)('payloadNames: $override.payloadNames', ({ override, expected }) => {
        const cli = HoraCoreCli.create({
          args: [
            'install',
          ],
          workingDirectoryPath: '/consumer',
          logger: {
            log: () => {},
            error: () => {},
          },
        })

        jest.spyOn(fs, 'existsSync')
          .mockReturnValue(true)
        jest.spyOn(fs, 'readdirSync')
          .mockReturnValue(override.payloadNames)

        const received = cli.collectPayloadNames()

        expect(received)
          .toEqual(expected)
      })
    })

    describe('should be empty when dist/ is absent', () => {
      test('when the directory does not exist', () => {
        const cli = HoraCoreCli.create({
          args: [
            'install',
          ],
          workingDirectoryPath: '/consumer',
          logger: {
            log: () => {},
            error: () => {},
          },
        })

        jest.spyOn(fs, 'existsSync')
          .mockReturnValue(false)

        const received = cli.collectPayloadNames()

        expect(received)
          .toEqual([])
      })
    })
  })
})

describe('HoraCoreCli', () => {
  describe('#buildHoraCoreInstallers()', () => {
    describe('should build one installer per payload', () => {
      const cases = [
        {
          override: {
            payloadNames: [
              'agents',
              'skills',
            ],
          },
          expected: [
            {
              workingDirectoryPath: '/consumer',
              sourceDirectoryPath: '/package/dist/agents',
              targetDirectoryPath: '/consumer/.claude/agents',
            },
            {
              workingDirectoryPath: '/consumer',
              sourceDirectoryPath: '/package/dist/skills',
              targetDirectoryPath: '/consumer/.claude/skills',
            },
          ],
        },
      ]

      test.each(cases)('payloadNames: $override.payloadNames', ({ override, expected }) => {
        const cli = HoraCoreCli.create({
          args: [
            'install',
          ],
          workingDirectoryPath: '/consumer',
          logger: {
            log: () => {},
            error: () => {},
          },
        })

        jest.spyOn(cli, 'collectPayloadNames')
          .mockReturnValue(override.payloadNames)
        jest.spyOn(HoraCoreCli, 'buildDistributionDirectoryPath')
          .mockReturnValue('/package/dist')

        const createHoraCoreInstallerSpy = jest.spyOn(HoraCoreCli, 'createHoraCoreInstaller')
          .mockReturnValue(null)

        cli.buildHoraCoreInstallers()

        expect(createHoraCoreInstallerSpy)
          .toHaveBeenNthCalledWith(1, expected[0])
        expect(createHoraCoreInstallerSpy)
          .toHaveBeenNthCalledWith(2, expected[1])
      })
    })

    describe('should resolve the given directory against the working directory', () => {
      const cases = [
        {
          input: {
            args: [
              'install',
              '--dir',
              'tools/claude',
            ],
          },
          expected: {
            workingDirectoryPath: '/consumer',
            sourceDirectoryPath: '/package/dist/skills',
            targetDirectoryPath: '/consumer/tools/claude/skills',
          },
        },
      ]

      test.each(cases)('args: $input.args', ({ input, expected }) => {
        const cli = HoraCoreCli.create({
          args: input.args,
          workingDirectoryPath: '/consumer',
          logger: {
            log: () => {},
            error: () => {},
          },
        })

        jest.spyOn(cli, 'collectPayloadNames')
          .mockReturnValue([
            'skills',
          ])
        jest.spyOn(HoraCoreCli, 'buildDistributionDirectoryPath')
          .mockReturnValue('/package/dist')

        const createHoraCoreInstallerSpy = jest.spyOn(HoraCoreCli, 'createHoraCoreInstaller')
          .mockReturnValue(null)

        cli.buildHoraCoreInstallers()

        expect(createHoraCoreInstallerSpy)
          .toHaveBeenCalledWith(expected)
      })
    })
  })
})

describe('HoraCoreCli', () => {
  describe('#buildTargetDirectoryPath()', () => {
    describe('should be the .claude of the working directory', () => {
      const cases = [
        {
          input: {
            workingDirectoryPath: '/consumer',
          },
          expected: '/consumer/.claude',
        },
        {
          input: {
            workingDirectoryPath: '/tmp/consumer',
          },
          expected: '/tmp/consumer/.claude',
        },
      ]

      test.each(cases)('workingDirectoryPath: $input.workingDirectoryPath', ({ input, expected }) => {
        const cli = HoraCoreCli.create({
          args: [
            'install',
          ],
          workingDirectoryPath: input.workingDirectoryPath,
          logger: {
            log: () => {},
            error: () => {},
          },
        })

        const received = cli.buildTargetDirectoryPath()

        expect(received)
          .toBe(expected)
      })
    })

    describe('should resolve the given directory against the working directory', () => {
      const cases = [
        {
          input: {
            args: [
              'install',
              '--dir',
              'tools/claude',
            ],
          },
          expected: '/consumer/tools/claude',
        },
        {
          input: {
            args: [
              'install',
              '--dir',
              '/tmp/claude',
            ],
          },
          expected: '/tmp/claude',
        },
      ]

      test.each(cases)('args: $input.args', ({ input, expected }) => {
        const cli = HoraCoreCli.create({
          args: input.args,
          workingDirectoryPath: '/consumer',
          logger: {
            log: () => {},
            error: () => {},
          },
        })

        const received = cli.buildTargetDirectoryPath()

        expect(received)
          .toBe(path.normalize(expected))
      })
    })
  })
})

describe('HoraCoreCli', () => {
  describe('#buildVerifiedBaseDirectoryPath()', () => {
    describe('should be the working directory when no directory is given', () => {
      const cases = [
        {
          input: {
            args: [
              'install',
            ],
          },
          expected: '/consumer',
        },
        {
          input: {
            args: [
              'uninstall',
            ],
          },
          expected: '/consumer',
        },
      ]

      test.each(cases)('args: $input.args', ({ input, expected }) => {
        const cli = HoraCoreCli.create({
          args: input.args,
          workingDirectoryPath: '/consumer',
        })

        const received = cli.buildVerifiedBaseDirectoryPath()

        expect(received)
          .toBe(expected)
      })
    })

    describe('should be the given directory when one is given', () => {
      const cases = [
        {
          input: {
            args: [
              'install',
              '--dir',
              '.agent',
            ],
          },
          expected: '/consumer/.agent',
        },
        {
          input: {
            args: [
              'install',
              '--dir=/opt/agent',
            ],
          },
          expected: '/opt/agent',
        },
      ]

      test.each(cases)('args: $input.args', ({ input, expected }) => {
        const cli = HoraCoreCli.create({
          args: input.args,
          workingDirectoryPath: '/consumer',
        })

        const received = cli.buildVerifiedBaseDirectoryPath()

        expect(received)
          .toBe(path.normalize(expected))
      })
    })
  })
})

describe('HoraCoreCli', () => {
  describe('#isSymbolicLink()', () => {
    describe('should be what lstat tells of the path', () => {
      const cases = [
        {
          override: {
            isSymbolicLink: true,
          },
          expected: true,
        },
        {
          override: {
            isSymbolicLink: false,
          },
          expected: false,
        },
      ]

      test.each(cases)('isSymbolicLink: $override.isSymbolicLink', ({ override, expected }) => {
        const cli = HoraCoreCli.create({
          args: [
            'install',
          ],
          workingDirectoryPath: '/consumer',
        })

        jest.spyOn(fs, 'lstatSync')
          .mockReturnValue(
            /** @type {*} */ ({
              isSymbolicLink: () => override.isSymbolicLink,
            })
          )

        const received = cli.isSymbolicLink({
          filePath: '/consumer/.claude',
        })

        expect(received)
          .toBe(expected)
      })
    })

    describe('should be false when the path does not exist', () => {
      test('filePath: /consumer/.claude', () => {
        const cli = HoraCoreCli.create({
          args: [
            'install',
          ],
          workingDirectoryPath: '/consumer',
        })

        jest.spyOn(fs, 'lstatSync')
          .mockImplementation(() => {
            throw new Error('ENOENT')
          })

        const received = cli.isSymbolicLink({
          filePath: '/consumer/.claude',
        })

        expect(received)
          .toBe(false)
      })
    })
  })
})

describe('HoraCoreCli', () => {
  describe('#isReachedThroughSymbolicLink()', () => {
    describe('should be true when any step of the path is a symbolic link', () => {
      const cases = [
        {
          override: {
            linkedPaths: [
              '/consumer/.claude',
            ],
          },
          expected: true,
        },
        {
          override: {
            linkedPaths: [
              '/consumer/.claude/skills',
            ],
          },
          expected: true,
        },
        {
          override: {
            linkedPaths: [],
          },
          expected: false,
        },
        {
          override: {
            linkedPaths: [
              '/consumer/.claude/agents',
            ],
          },
          expected: false,
        },
      ]

      test.each(cases)('linkedPaths: $override.linkedPaths', ({ override, expected }) => {
        const cli = HoraCoreCli.create({
          args: [
            'install',
          ],
          workingDirectoryPath: '/consumer',
        })

        jest.spyOn(cli, 'isSymbolicLink')
          .mockImplementation(({ filePath }) => override.linkedPaths.includes(filePath))

        const received = cli.isReachedThroughSymbolicLink({
          basePath: '/consumer',
          targetPath: '/consumer/.claude/skills',
        })

        expect(received)
          .toBe(expected)
      })
    })
  })
})

describe('HoraCoreCli', () => {
  describe('#verifyPaths()', () => {
    describe('should refuse an installation directory reached through a symbolic link', () => {
      const cases = [
        {
          override: {
            linkedTargetDirectoryPaths: [
              '/consumer/.claude/skills',
            ],
          },
          expected: [
            '/consumer/.claude/skills is reached through a symbolic link.',
            'Nothing was changed. An installation carries nothing through a link — replace it, or give --dir the directory it resolves to.',
          ],
        },
      ]

      test.each(cases)('linkedTargetDirectoryPaths: $override.linkedTargetDirectoryPaths', ({ override, expected }) => {
        const logger = {
          log: jest.fn(),
          error: jest.fn(),
        }
        const cli = HoraCoreCli.create({
          args: [
            'install',
          ],
          workingDirectoryPath: '/consumer',
          logger,
        })

        jest.spyOn(cli, 'collectLinkedTargetDirectoryPaths')
          .mockReturnValue(override.linkedTargetDirectoryPaths)
        jest.spyOn(cli, 'collectLinkedManifestFilePaths')
          .mockReturnValue([])

        const received = cli.verifyPaths()

        expect(received)
          .toBe(1)
        expect(logger.error)
          .toHaveBeenNthCalledWith(1, expected[0])
        expect(logger.error)
          .toHaveBeenNthCalledWith(2, expected[1])
      })
    })

    describe('should pass when no installation directory is reached through one', () => {
      test('linkedTargetDirectoryPaths: []', () => {
        const logger = {
          log: jest.fn(),
          error: jest.fn(),
        }
        const cli = HoraCoreCli.create({
          args: [
            'install',
          ],
          workingDirectoryPath: '/consumer',
          logger,
        })

        jest.spyOn(cli, 'collectLinkedTargetDirectoryPaths')
          .mockReturnValue([])
        jest.spyOn(cli, 'collectLinkedManifestFilePaths')
          .mockReturnValue([])

        const received = cli.verifyPaths()

        expect(received)
          .toBe(0)
        expect(logger.error)
          .not
          .toHaveBeenCalled()
      })
    })
  })
})

describe('HoraCoreCli', () => {
  describe('#collectLinkedTargetDirectoryPaths()', () => {
    describe('should be the installation directories reached through a symbolic link', () => {
      const cases = [
        {
          override: {
            payloadNames: [
              'agents',
              'skills',
            ],
            linkedTargetDirectoryPaths: [
              '/consumer/.claude/skills',
            ],
          },
          expected: [
            '/consumer/.claude/skills',
          ],
        },
        {
          override: {
            payloadNames: [
              'agents',
              'skills',
            ],
            linkedTargetDirectoryPaths: [],
          },
          expected: [],
        },
      ]

      test.each(cases)('linkedTargetDirectoryPaths: $override.linkedTargetDirectoryPaths', ({ override, expected }) => {
        const cli = HoraCoreCli.create({
          args: [
            'install',
          ],
          workingDirectoryPath: '/consumer',
        })

        jest.spyOn(cli, 'collectPayloadNames')
          .mockReturnValue(override.payloadNames)
        jest.spyOn(cli, 'isReachedThroughSymbolicLink')
          .mockImplementation(({ targetPath }) =>
            override.linkedTargetDirectoryPaths.includes(targetPath)
          )

        const received = cli.collectLinkedTargetDirectoryPaths()

        expect(received)
          .toEqual(expected)
      })
    })
  })
})

describe('HoraCoreCli', () => {
  describe('#buildManifestFilePath()', () => {
    describe('should be the record below the working directory', () => {
      const cases = [
        {
          input: {
            args: [
              'install',
            ],
          },
          expected: '/consumer/.hora/equip-core.json',
        },
        {
          input: {
            args: [
              'install',
              '--dir',
              '.agent',
            ],
          },
          expected: '/consumer/.hora/equip-core.json',
        },
      ]

      test.each(cases)('args: $input.args', ({ input, expected }) => {
        const cli = HoraCoreCli.create({
          args: input.args,
          workingDirectoryPath: '/consumer',
        })

        const received = cli.buildManifestFilePath()

        expect(received)
          .toBe(path.normalize(expected))
      })
    })
  })
})

describe('HoraCoreCli', () => {
  describe('#collectLinkedManifestFilePaths()', () => {
    describe('should be the record when it is reached through a symbolic link', () => {
      const cases = [
        {
          override: {
            linkedPaths: [
              '/consumer/.hora',
            ],
          },
          expected: [
            '/consumer/.hora/equip-core.json',
          ],
        },
        {
          override: {
            linkedPaths: [
              '/consumer/.hora/equip-core.json',
            ],
          },
          expected: [
            '/consumer/.hora/equip-core.json',
          ],
        },
        {
          override: {
            linkedPaths: [],
          },
          expected: [],
        },
      ]

      test.each(cases)('linkedPaths: $override.linkedPaths', ({ override, expected }) => {
        const cli = HoraCoreCli.create({
          args: [
            'install',
          ],
          workingDirectoryPath: '/consumer',
        })

        jest.spyOn(cli, 'isSymbolicLink')
          .mockImplementation(({ filePath }) => override.linkedPaths.includes(filePath))

        const received = cli.collectLinkedManifestFilePaths()

        expect(received)
          .toEqual(expected)
      })
    })
  })
})

describe('HoraCoreCli', () => {
  describe('#verifyPaths()', () => {
    describe('should refuse a record reached through a symbolic link', () => {
      const cases = [
        {
          override: {
            linkedManifestFilePaths: [
              '/consumer/.hora/equip-core.json',
            ],
          },
          expected: '/consumer/.hora/equip-core.json is reached through a symbolic link.',
        },
      ]

      test.each(cases)('linkedManifestFilePaths: $override.linkedManifestFilePaths', ({ override, expected }) => {
        const logger = {
          log: jest.fn(),
          error: jest.fn(),
        }
        const cli = HoraCoreCli.create({
          args: [
            'install',
          ],
          workingDirectoryPath: '/consumer',
          logger,
        })

        jest.spyOn(cli, 'collectLinkedTargetDirectoryPaths')
          .mockReturnValue([])
        jest.spyOn(cli, 'collectLinkedManifestFilePaths')
          .mockReturnValue(override.linkedManifestFilePaths)

        const received = cli.verifyPaths()

        expect(received)
          .toBe(1)
        expect(logger.error)
          .toHaveBeenNthCalledWith(1, expected)
      })
    })
  })
})

describe('HoraCoreCli', () => {
  describe('#runSelection()', () => {
    describe('should print every entry it would install', () => {
      const cases = [
        {
          override: {
            payloadNames: [
              'skills',
            ],
            distributedEntryNames: [
              'hora-plan',
            ],
          },
          expected: '1 entries selected',
        },
        {
          override: {
            payloadNames: [
              'agents',
              'skills',
            ],
            distributedEntryNames: [
              'hora-plan',
              'hora-spec',
            ],
          },
          expected: '4 entries selected',
        },
      ]

      test.each(cases)('payloadNames: $override.payloadNames', ({ override, expected }) => {
        const logger = {
          log: jest.fn(),
          error: jest.fn(),
        }
        const cli = HoraCoreCli.create({
          args: [
            'list',
          ],
          workingDirectoryPath: '/consumer',
          logger,
        })

        jest.spyOn(cli, 'collectPayloadNames')
          .mockReturnValue(override.payloadNames)
        jest.spyOn(HoraCoreInstaller.prototype, 'collectDistributedEntryNames')
          .mockReturnValue(override.distributedEntryNames)

        const received = cli.runSelection()

        expect(logger.log)
          .toHaveBeenCalledWith(expected)
        expect(received)
          .toBe(0)
      })
    })
  })
})

describe('HoraCoreCli', () => {
  describe('#runUninstall()', () => {
    describe('should report what each payload removed', () => {
      const cases = [
        {
          override: {
            payloadNames: [
              'skills',
            ],
            uninstallResult: {
              removedEntryNames: [
                'hora-plan',
              ],
            },
          },
          expected: 'Removed 1 entries from /consumer/.claude/skills',
        },
        {
          override: {
            payloadNames: [
              'agents',
            ],
            uninstallResult: {
              removedEntryNames: [],
            },
          },
          expected: 'Removed 0 entries from /consumer/.claude/agents',
        },
      ]

      test.each(cases)('payloadNames: $override.payloadNames', ({ override, expected }) => {
        const logger = {
          log: jest.fn(),
          error: jest.fn(),
        }
        const cli = HoraCoreCli.create({
          args: [
            'uninstall',
          ],
          workingDirectoryPath: '/consumer',
          logger,
        })

        jest.spyOn(cli, 'collectPayloadNames')
          .mockReturnValue(override.payloadNames)
        jest.spyOn(HoraCoreInstaller.prototype, 'uninstall')
          .mockReturnValue(override.uninstallResult)

        const received = cli.runUninstall()

        expect(logger.log)
          .toHaveBeenCalledWith(expected)
        expect(received)
          .toBe(0)
      })
    })

    describe('should remove nothing when a directory is reached through a symbolic link', () => {
      test('args: uninstall', () => {
        const cli = HoraCoreCli.create({
          args: [
            'uninstall',
          ],
          workingDirectoryPath: '/consumer',
        })

        jest.spyOn(cli, 'verifyPaths')
          .mockReturnValue(1)

        const uninstallSpy = jest.spyOn(HoraCoreInstaller.prototype, 'uninstall')
          .mockReturnValue({
            removedEntryNames: [],
          })

        const received = cli.runUninstall()

        expect(received)
          .toBe(1)
        expect(uninstallSpy)
          .not
          .toHaveBeenCalled()
      })
    })
  })
})

describe('HoraCoreCli', () => {
  describe('#runHelp()', () => {
    describe('when called as is', () => {
      test('should print the usage text', () => {
        const logger = {
          log: jest.fn(),
          error: jest.fn(),
        }
        const cli = HoraCoreCli.create({
          args: [
            'help',
          ],
          workingDirectoryPath: '/consumer',
          logger,
        })

        const received = cli.runHelp()

        expect(logger.log)
          .toHaveBeenCalledWith(HoraCoreCli.usageText)
        expect(received)
          .toBe(0)
      })
    })
  })
})
