import CLI_COMMAND from '../../../../lib/equip/constants/CLI_COMMAND.js'

describe('CLI_COMMAND', () => {
  describe('when referenced as is', () => {
    test('should be fixed value', () => {
      const expected = {
        INSTALL: 'install',
        LIST: 'list',
        UNINSTALL: 'uninstall',
        HELP: 'help',
      }

      const received = CLI_COMMAND

      expect(received)
        .toEqual(expected)
    })
  })
})

describe('CLI_COMMAND', () => {
  describe('should be the word typed on the command line', () => {
    const cases = [
      {
        input: {
          command: CLI_COMMAND.INSTALL,
        },
        expected: 'install',
      },
      {
        input: {
          command: CLI_COMMAND.LIST,
        },
        expected: 'list',
      },
      {
        input: {
          command: CLI_COMMAND.UNINSTALL,
        },
        expected: 'uninstall',
      },
      {
        input: {
          command: CLI_COMMAND.HELP,
        },
        expected: 'help',
      },
    ]

    test.each(cases)('command: $expected', ({ input, expected }) => {
      const received = input.command

      expect(received)
        .toBe(expected)
    })
  })
})
