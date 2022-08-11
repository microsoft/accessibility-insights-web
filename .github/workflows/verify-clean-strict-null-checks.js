// // Copyright (c) Microsoft Corporation. All rights reserved.
// // Licensed under the MIT License.

// // USAGE:
// //
// //     node verify-clean-lockfile.js
// //
// // Verifies that "yarn null:autoadd" does not report any pending changes to tsconfig.strictNullChecks.json
// // 
// // This serves as a reminder for humans looking at PRs to run `yarn null:autoadd`

// const path = require('path');
// const process = require('process');
// const child_process = require('child_process');
// const util = require('util');
// const exec = util.promisify(require('child_process').exec);
// // const nullChecksFilePath = path.join(__dirname, '..', '..', 'tsconfig.strictNullChecks.json');
// const successIndicated = (outputText) => outputText.includes(`\nSuccess\n`);

// // const tscWatchProcess = child_process.spawn('node', [tscPath, '-p', tsconfigPath, '--watch']);
// let failureState;
// // const processCompletePattern = /Done in [0-9]+.[0-9]+s/gi;
// // async function waitForComplete(autoAddProcess) {
// //     const match = await waitForStdoutMatching(autoAddProcess, processCompletePattern);
// //     const errorCount = +match[1];
// //     return errorCount;
// // }

// // async function waitForStdoutMatching(child, pattern) {
// //     return new Promise(resolve => {
// //         const listener = data => {
// //             const textOut = data.toString();
// //             const match = pattern.exec(textOut);
// //             if (match) {
// //                 child.stdout.removeListener('data', listener);
// //                 resolve(match);
// //             }
// //         };
// //         child.stdout.on('data', listener);
// //     });
// // }

// async function main() {

//     const { stdout, stderr } = await exec('node', [path.join(__dirname, '..', '..', 'tools', 'strict-null-checks', 'auto-add.js')]);
//     if(stderr){
//         failureState = {
//             type: 'ERROR',
//             details: stderr
//         }
//         console.log(failureState.type, failureState.details);
//         process.exit(1);
//     }
//     if(successIndicated(stdout)){
//         failureState = {
//             type: 'ERROR',
//             details: `
//             Error: Running "yarn null:autoadd" identified new files to be included in null checks.

//             To ensure these files are included:
//                 1) Pull this branch
//                 2) Run "yarn null:autoadd"
//                 3) Commit and push the resulting change to tsconfig.strictNullChecks.json

//         `
//         }
//         console.log(failureState.type, failureState.details);
//         process.exit(1);
//     }

//     if(failureState?.type === 'ERROR'){
//         console.log(failureState.type, failureState.details);
//         process.exit(1);
//     }
//     console.log('Success! All eligible files are present in tsconfig.strictNullChecks.json!');
//     process.exit(0);
// }

// main().catch(error => {
//     console.error(error.stack);
//     process.exit(1);
// });

// USAGE:
//
//     node verify-clean-lockfile.js
//
// Verifies that "git status" does not report any pending changed to gradle.lockfile
//
// This is a workaround for Dependabot not understanding natively how to update Gradle
// lockfiles; it serves as a reminder for humans looking at Dependabot PRs to update
// it manually.

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
    
Diff of the unexpected change:

${gitDiffResult.toString()}
    `);
    process.exit(1);
} else {
    console.log('Success! git status reports no outstanding tsconfig.strictNullChecks.json change.');
    process.exit(0);
}


