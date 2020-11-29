module.exports = {
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  transformIgnorePatterns: [`/node_modules/(?!(@opt-ui|@equinor))`],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1'
  }
};
