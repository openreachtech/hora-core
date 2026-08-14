import {
  jest as jestCore,
} from '@jest/globals'

import {
  ConstructorSpy,
} from '@openreachtech/jest-constructor-spy'

import {
  setupExpectEach,
} from '@openreachtech/jest-expect-each'

setupExpectEach()

/*
 * Set global variables.
 */
globalThis.jest = jestCore
globalThis.constructorSpy = ConstructorSpy.create({
  jest: jestCore,
})

/*
 * Set global hooks.
 */
afterEach(() => {
  jest.restoreAllMocks()
})
