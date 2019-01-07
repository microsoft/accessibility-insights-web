// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
module.exports = {
  clearMocks: true,
  coverageDirectory: "coverage",
  globals: {
    "ts-jest": {
      "tsConfigFile": "tsconfig.jest.json"
    }
  },

  setupFiles: [
    '<rootDir>/src/TestScripts/jest-setup.ts'
  ],

  moduleDirectories: [
    "node_modules",
  ],

  moduleFileExtensions: [
    "ts",
    "tsx",
    "js"
  ],

  roots: [
    "<rootDir>/src/TestScripts"
  ],

  collectCoverage: true,

  "collectCoverageFrom": [
    "**/src/**/*.{ts,tsx}",
    "!**/TestScripts/**"
  ],

  "coverageReporters": [
    "json",
    "lcov",
    "text",
    "cobertura"
  ],

  "reporters": [
    "default",
    "jest-junit"
  ],

  testEnvironment: "jsdom",

  testMatch: [
    "<rootDir>/src/TestScripts/Tests/**/*.test.(ts|tsx|js)"
  ],

  testPathIgnorePatterns: [
  ],

  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },

  verbose: true,
};
