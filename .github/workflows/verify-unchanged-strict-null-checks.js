// // Copyright (c) Microsoft Corporation. All rights reserved.
// // Licensed under the MIT License.
//
// USAGE:
//
//     node verify-unchanged-strict-null-checks.js
//
// Verifies that "git status" does not report any pending changes to tsconfig.strictNullChecks.json
//
// This serves as a reminder for humans to update strict null checks when they add files.

const path = require('path');
const process = require('process');
const child_process = require('child_process');

const lockfilePath = path.join(__dirname, '..', '..', 'tsconfig.strictNullChecks.json');

const gitStatusResult = child_process.execFileSync('git', ['status', '--porcelain=1', '--', lockfilePath]);
const isLockfileChanged = gitStatusResult.toString() !== '';

if (isLockfileChanged) {
    const gitDiffResult = child_process.execFileSync('git', ['diff', '--', lockfilePath]);
    console.error(`
Error: Running "yarn null:autoadd" identified new files to be included in null checks.

To ensure these files are included:
    1) Pull this branch
    2) Run "yarn null:autoadd"
    3) Commit and push the resulting change to tsconfig.strictNullChecks.json

Diff of the necessary change:

${gitDiffResult.toString()}
    `);
    process.exit(1);
} else {
    console.log('Success! git status reports no outstanding tsconfig.strictNullChecks.json changes.');
    process.exit(0);
}


