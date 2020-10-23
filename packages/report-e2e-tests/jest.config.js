// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const baseConfig = require('../../jest.config.base');
const package = require('./package');

module.exports = {
    ...baseConfig,
    collectCoverage: false,
    displayName: package.name,
    setupFilesAfterEnv: [`<rootDir>/src/jest-setup.ts`],
    watchPathIgnorePatterns: ['src/examples/*.output.html'],
};
