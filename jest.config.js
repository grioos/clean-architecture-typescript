module.exports = {
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  transform: {
    "\\.js$": "<rootDir>/node_modules/babel-jest"
  },
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1'
  }
};
