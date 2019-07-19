// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const path = require('path');
var common = require('../jest.common.config');
const rootDir = '../../../';
const currentDir = '<rootDir>/src/tests/electron';

module.exports = {
    ...common,
    displayName: 'electron tests',
    moduleFileExtensions: [
        'ts',
        'tsx',
        'json', // adding json, since puppeteer.launch throws error - refer https://github.com/GoogleChrome/puppeteer/issues/2754
        'js',
    ],
    rootDir: rootDir,
    roots: [currentDir],
    reporters: ['default', ['jest-junit', {
        outputDirectory: '.',
        outputName: '<rootDir>/test-results/electron/junit-e2e.xml'
    }]],
    globals: {
        rootDir: path.resolve(__dirname, rootDir),
    },
};
