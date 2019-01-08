// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
module.exports = {
  clearMocks: true,
  coverageDirectory: "coverage",
  globals: {
    "ts-jest": {
      "tsConfig": "<rootDir>/tsconfig.jest.json"
    }
  },

  setupFiles: [
    '<rootDir>/src/tests/unit/jest-setup.ts'
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
    "<rootDir>/src/tests/unit"
  ],

  collectCoverage: true,

  "collectCoverageFrom": [
    "<rootDir>/src/**/*.{ts,tsx}",
    "!<rootDir>/src/tests/**"
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
    "**/*.test.(ts|tsx|js)"
  ],

  testPathIgnorePatterns: [
  ],

  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },

  verbose: true,
};
