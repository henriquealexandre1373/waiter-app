/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve } = require('path');
const root = resolve(__dirname);

require('dotenv').config({
  path: resolve(__dirname, './env/env.test'),
});

module.exports = {
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/'],
  collectCoverageFrom: ['src/**/*.ts', '!**/*.d.ts'],
  clearMocks: true,
  rootDir: root,
  verbose: true,
  displayName: 'root-tests',
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '@src/(.*)$': '<rootDir>/src/$1',
    '@test/(.*)$': '<rootDir>/test/$1',
    '@useCases/(.*)$': '<rootDir>/src/app/useCases/$1',
    '@interfaces/(.*)$': '<rootDir>/src/app/interfaces/$1',
    '@validators/(.*)$': '<rootDir>/src/app/validators/$1',
    '@customTypes/(.*)$': '<rootDir>/src/app/customTypes/$1',
    '@models/(.*)$': '<rootDir>/src/app/models/$1',
    '@services/(.*)$': '<rootDir>/src/app/services/$1',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  roots: [resolve(__dirname, 'src'), resolve(__dirname, 'test')],
  projects: [
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/test/unit/**/*.test.ts'],
      coverageDirectory: 'coverage/unit',
      setupFilesAfterEnv: ['<rootDir>/test/jest.setup.ts'],
    },
    {
      displayName: 'integration',
      testMatch: ['<rootDir>/test/integration/**/*.test.ts'],
      maxWorkers: 1,
      detectOpenHandles: true,
      setupFilesAfterEnv: [
        '<rootDir>/test/jest.setup.ts',
        'tsconfig-paths/register',
      ],
      globalTeardown: '<rootDir>/test/configs/globalTeardown.js',
    },
    {
      displayName: 'e2e',
      testMatch: ['<rootDir>/test/e2e/**/*.test.ts'],
      maxWorkers: 1,
      detectOpenHandles: true,
      // globalSetup: '<rootDir>/test/e2e/global-setup.js',
      // globalTeardown: '<rootDir>/test/e2e/global-teardown.js',
      // setupFilesAfterEnv: ['<rootDir>/test/e2e/jest-setup.ts'],
    },
  ],
};
