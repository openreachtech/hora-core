import fs from 'node:fs'

import ConsumerPackageConfig from '../../../lib/equip/ConsumerPackageConfig.js'

describe('ConsumerPackageConfig', () => {
  describe('constructor', () => {
    describe('should keep property', () => {
      describe('#filePath', () => {
        const cases = [
          {
            input: {
              filePath: '/tmp/consumer/package.json',
            },
            expected: '/tmp/consumer/package.json',
          },
          {
            input: {
              filePath: 'package.json',
            },
            expected: 'package.json',
          },
        ]

        test.each(cases)('filePath: $input.filePath', ({ input, expected }) => {
          const config = new ConsumerPackageConfig(input)

          expect(config)
            .toHaveProperty('filePath', expected)
        })
      })
    })
  })
})

describe('ConsumerPackageConfig', () => {
  describe('.create()', () => {
    describe('should be an instance of own class', () => {
      const cases = [
        {
          input: {
            directoryPath: '/tmp/consumer',
          },
        },
        {
          input: {
            directoryPath: '.',
          },
        },
      ]

      test.each(cases)('directoryPath: $input.directoryPath', ({ input }) => {
        const received = ConsumerPackageConfig.create(input)

        expect(received)
          .toBeInstanceOf(ConsumerPackageConfig)
      })
    })

    describe('should call constructor with the package.json of the directory', () => {
      const cases = [
        {
          input: {
            directoryPath: '/tmp/consumer',
          },
          expected: {
            filePath: '/tmp/consumer/package.json',
          },
        },
        {
          input: {
            directoryPath: '/tmp/consumer/',
          },
          expected: {
            filePath: '/tmp/consumer/package.json',
          },
        },
      ]

      test.each(cases)('directoryPath: $input.directoryPath', ({ input, expected }) => {
        const SpyClass = constructorSpy.spyOn(ConsumerPackageConfig)

        SpyClass.create(input)

        expect(SpyClass.__spy__)
          .toHaveBeenCalledWith(expected)
      })
    })
  })
})

describe('ConsumerPackageConfig', () => {
  describe('#get:fs', () => {
    describe('when called as is', () => {
      test('should be fixed value', () => {
        const config = ConsumerPackageConfig.create({
          directoryPath: '/tmp/consumer',
        })

        const received = config.fs

        expect(received)
          .toBe(fs) // same reference
      })
    })
  })
})

describe('ConsumerPackageConfig', () => {
  describe('#extractName()', () => {
    describe('should be the declared package name', () => {
      const cases = [
        {
          override: {
            packageHash: {
              name: 'alpha-app',
            },
          },
          expected: 'alpha-app',
        },
        {
          override: {
            packageHash: {
              name: '@openreachtech/hora',
            },
          },
          expected: '@openreachtech/hora',
        },
      ]

      test.each(cases)('name: $override.packageHash.name', ({ override, expected }) => {
        const config = ConsumerPackageConfig.create({
          directoryPath: '/tmp/consumer',
        })

        jest.spyOn(config, 'load')
          .mockReturnValue(override.packageHash)

        const received = config.extractName()

        expect(received)
          .toBe(expected)
      })
    })

    describe('should be null when nothing is declared', () => {
      const cases = [
        {
          override: {
            packageHash: null,
          },
        },
        {
          override: {
            packageHash: {},
          },
        },
      ]

      test.each(cases)('packageHash: $override.packageHash', ({ override }) => {
        const config = ConsumerPackageConfig.create({
          directoryPath: '/tmp/consumer',
        })

        jest.spyOn(config, 'load')
          .mockReturnValue(override.packageHash)

        const received = config.extractName()

        expect(received)
          .toBeNull()
      })
    })
  })
})

describe('ConsumerPackageConfig', () => {
  describe('#load()', () => {
    describe('should parse the package.json', () => {
      const cases = [
        {
          override: {
            content: '{"name":"consumer","version":"1.0.0"}',
          },
          expected: {
            name: 'consumer',
            version: '1.0.0',
          },
        },
        {
          override: {
            content: '{"name":"consumer"}',
          },
          expected: {
            name: 'consumer',
          },
        },
      ]

      test.each(cases)('content: $override.content', ({ override, expected }) => {
        const config = ConsumerPackageConfig.create({
          directoryPath: '/tmp/consumer',
        })

        jest.spyOn(fs, 'existsSync')
          .mockReturnValue(true)
        jest.spyOn(fs, 'readFileSync')
          .mockReturnValue(override.content)

        const received = config.load()

        expect(received)
          .toEqual(expected)
      })
    })

    describe('should be null when the package.json is absent', () => {
      test('when the file does not exist', () => {
        const config = ConsumerPackageConfig.create({
          directoryPath: '/tmp/consumer',
        })

        jest.spyOn(fs, 'existsSync')
          .mockReturnValue(false)

        const received = config.load()

        expect(received)
          .toBeNull()
      })
    })

    describe('should be null when the package.json is broken', () => {
      const cases = [
        {
          override: {
            content: 'not json',
          },
        },
        {
          override: {
            content: '{"name":',
          },
        },
      ]

      test.each(cases)('content: $override.content', ({ override }) => {
        const config = ConsumerPackageConfig.create({
          directoryPath: '/tmp/consumer',
        })

        jest.spyOn(fs, 'existsSync')
          .mockReturnValue(true)
        jest.spyOn(fs, 'readFileSync')
          .mockReturnValue(override.content)

        const received = config.load()

        expect(received)
          .toBeNull()
      })
    })
  })
})
