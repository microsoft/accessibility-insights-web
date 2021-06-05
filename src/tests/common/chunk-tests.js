// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// Usage:
// > yarn test --listTests | node chunk-tests.js --index 2 --total 2
// path/to/test1.ts|path/to/test2.ts

const { execSync } = require('child_process');
const { chunk } = require('lodash');
const yargs = require('yargs');

const { index, total, scenario } = yargs.demandOption(['scenario', 'index', 'total']).argv;

const listTestsOutput = execSync(`yarn test:${scenario} --listTests`);

const testFilePaths = listTestsOutput
    .toString()
    .split(/\r?\n/)
    .sort()
    .filter(path => /\.test\./.test(path)); // filter extra yarn/jest output

const filesPerChunk = Math.ceil(testFilePaths.length / total);
const selectedFilePaths = chunk(testFilePaths, filesPerChunk)[index - 1];

const pathRegexes = selectedFilePaths.map(path => path.replace(/\\/g, '/'));
const testMatch = pathRegexes.join('|');

console.log(testMatch);
