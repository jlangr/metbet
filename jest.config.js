export default {
  transform: { '^.+\\.mjs$': 'babel-jest' },
  testMatch: ["**/test/**/*.test.mjs", "**/src/**/*.test.mjs"],
  moduleFileExtensions: ["js", "mjs"],
  testEnvironment: 'node'
}
