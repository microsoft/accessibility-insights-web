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

  // See https://github.com/OfficeDev/office-ui-fabric-react/wiki/Fabric-6-Release-Notes#webpack-tree-shaking
  moduleNameMapper: {
    "office-ui-fabric-react/lib/(.*)$": "office-ui-fabric-react/lib-commonjs/$1",
    "@uifabric/utilities": "@uifabric/utilities/lib-commonjs",
    "@uifabric/styling": "@uifabric/styling/lib-commonjs",
  },

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
