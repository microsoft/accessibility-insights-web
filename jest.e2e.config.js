// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
module.exports = {
  clearMocks: true,

  globals: {
    "ts-jest": {
      "tsConfigFile": "tsconfig.jest.json"
    }
  },

  preset: "jest-puppeteer",

  moduleDirectories: [
    "node_modules"
  ],

  moduleFileExtensions: [
    "ts",
    "js"
  ],

  roots: [
    "<rootDir>/src/TestScripts"
  ],

  testMatch: [
    "<rootDir>/src/TestScripts/e2e-tests/**/*.test.(ts|tsx|js)"
  ],

  testPathIgnorePatterns: [
  ],

  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },

  verbose: true,
};
