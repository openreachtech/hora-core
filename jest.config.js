export default {
  setupFilesAfterEnv: [
    '@openreachtech/jest-deep-containing/lib/setup-expect-deepContaining.js',
    '<rootDir>/tests/setup-after-env.js',
  ],
  moduleNameMapper: {
    '^(@.*)$': '<rootDir>/node_modules/$1',
    '^~/(.*)$': '<rootDir>/$1',
  },
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/',
  ],
}
