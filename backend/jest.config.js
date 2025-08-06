module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
  globalSetup: './jest.db-setup.js',
  globalTeardown: './jest.db-teardown.js',
  testTimeout: 30000,
};