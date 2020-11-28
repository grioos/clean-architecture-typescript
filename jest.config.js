module.exports = {
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest"
  },
  transformIgnorePatterns: [`/node_modules/(?!(@opt-ui|@equinor))`],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1'
  }
};
