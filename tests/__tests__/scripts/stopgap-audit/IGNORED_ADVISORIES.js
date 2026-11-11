import {
  readFileSync,
} from 'node:fs'

import IGNORED_ADVISORIES from '../../../../scripts/stopgap-audit/IGNORED_ADVISORIES.js'

const lockfileUrl = new URL('../../../../package-lock.json', import.meta.url)
const lockfile = JSON.parse(readFileSync(lockfileUrl, 'utf8'))
const lockedEntries = Object.entries(lockfile.packages)

/**
 * Tell whether the lockfile reaches the package, and only through development dependencies.
 *
 * @param {string} packageName - Name of the package.
 * @returns {boolean} `true` when every locked copy carries `dev: true`.
 */
function isReachedThroughDevelopmentOnly (packageName) {
  const lockedCopies = lockedEntries
    .filter(([lockPath]) => lockPath.endsWith(`node_modules/${packageName}`))

  return lockedCopies.length > 0
    && lockedCopies.every(([, entry]) => entry.dev === true)
}

/**
 * Read the last package name of a dependency path.
 *
 * @param {string} dependencyPath - Path such as `alpha > beta`.
 * @returns {string | undefined} Last package name.
 */
function lastPackageName (dependencyPath) {
  const packageNames = dependencyPath.split(' > ')

  return packageNames.at(-1)
}

describe('IGNORED_ADVISORIES', () => {
  test('should name each advisory once', () => {
    const advisoryIds = IGNORED_ADVISORIES.map(it => it.id)

    expect(new Set(advisoryIds).size)
      .toBe(advisoryIds.length)
  })

  test('should name GitHub advisory ids only', () => {
    const malformedIds = IGNORED_ADVISORIES
      .map(it => it.id)
      .filter(it => !/^GHSA(?:-[23456789cfghjmpqrvwx]{4}){3}$/u.test(it))

    expect(malformedIds)
      .toEqual([])
  })

  test('should end every path with its package', () => {
    const mismatchedIds = IGNORED_ADVISORIES
      .filter(it => lastPackageName(it.path) !== it.package)
      .map(it => it.id)

    expect(mismatchedIds)
      .toEqual([])
  })

  test('should reach every package through development dependencies only', () => {
    const shippedIds = IGNORED_ADVISORIES
      .filter(it => !isReachedThroughDevelopmentOnly(it.package))
      .map(it => it.id)

    expect(shippedIds)
      .toEqual([])
  })

  test.each([
    'reason',
    'removeWhen',
  ])('should state %s for every advisory', key => {
    const silentIds = IGNORED_ADVISORIES
      .filter(it => it[key].trim() === '')
      .map(it => it.id)

    expect(silentIds)
      .toEqual([])
  })
})
