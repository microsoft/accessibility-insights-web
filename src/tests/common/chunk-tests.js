// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// Usage:
// > yarn test --listTests | node chunk-tests.js --index 0 --total 2
// ::set-output name=test_match::...

const fs = require('fs');
const process = require('process');
const { chunk } = require('lodash');
const yargs = require('yargs');
const { index, total } = yargs.demandOption(['index', 'total']).argv;

const testFilePaths = fs
    .readFileSync(process.stdin.fd, 'utf-8')
    .toString()
    .split(/\r?\n/)
    .sort()
    .filter(path => /\.test\./.test(path)); // filter extra yarn/jest output

const filesPerChunk = Math.ceil(testFilePaths.length / total);
const selectedFilePaths = chunk(testFilePaths, filesPerChunk)[index];

const pathRegexes = selectedFilePaths.map(path => path.replace(/\\/g, '/'));
const testMatch = pathRegexes.join('|');

console.log(testMatch);
