/**
 * Advisories `npm run audit:npm` lets through until a release fixes them.
 *
 * @type {Array<NpmAuditType.IgnoredAdvisory>}
 */
const IGNORED_ADVISORIES = [
  {
    id: 'GHSA-gcqx-w48m-w2h4',
    package: 'deepmerge',
    path: 'jest > @jest/core > jest-config > deepmerge',
    reason: 'No patched release: the advisory covers deepmerge >=4.2.0 <=4.3.1, and 4.3.1 is the latest. deepmerge is reached through jest alone, a devDependency that is not shipped, and neither jest-config call site runs here: mergeConfig() is exported for a config file to call and nothing in this repository calls it, and the preset globals merge needs a preset, which jest.config.js does not set.',
    removeWhen: 'deepmerge publishes a release outside <=4.3.1, or the advisory is withdrawn so that npm audit stops reporting it, or jest-config stops depending on deepmerge',
  },
]

export default IGNORED_ADVISORIES
