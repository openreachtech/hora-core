export default {
  setupFilesAfterEnv: [
    '@openreachtech/jest-deep-containing/lib/setup-expect-deepContaining.js',
    '<rootDir>/tests/setup-after-env.js',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
}
