// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
var common = require('./jest.common.config');

module.exports = {
    ...common,
    preset: 'jest-puppeteer',
    roots: ['<rootDir>/src/tests/end-to-end'],
    reporters: ['default', ['jest-junit', { outputDirectory: '.', outputName: './junit-e2e.xml' }]],
};
