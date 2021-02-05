// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// @ts-check
const child_process = require('child_process');
const fs = require('fs');
const path = require('path');
const { collapseCompletedDirectories } = require('./collapse-completed-directories');
const config = require('./config');
const { getUncheckedLeafFiles } = require('./eligible-file-finder');
const { writeTsconfigSync } = require('./write-tsconfig');

const repoRoot = config.repoRoot;
const tscPath = path.join(repoRoot, 'node_modules', 'typescript', 'bin', 'tsc');
const tsconfigPath = path.join(repoRoot, config.targetTsconfig);

async function main() {
    console.log('## Initializing tsc --watch process...');
    const tscWatchProcess = child_process.spawn('node', [tscPath, '-p', tsconfigPath, '--watch']);
    await waitForBuildComplete(tscWatchProcess);

    const alreadyAttempted = new Set();

    for (let pass = 1; ; pass += 1) {
        let successesThisPass = 0;
        const uncheckedLeafFiles = await getUncheckedLeafFiles();
        const candidateFiles = uncheckedLeafFiles.filter(f => !alreadyAttempted.has(f));
        const candidateCount = candidateFiles.length;
        console.log(`## Starting pass ${pass} with ${candidateCount} candidate files`);

        for (const file of candidateFiles) {
            const succeeded = await tryAutoAddStrictNulls(tscWatchProcess, tsconfigPath, file);
            alreadyAttempted.add(file);
            if (succeeded) {
                successesThisPass += 1;
            }
        }

        console.log(`### Finished pass ${pass} (added ${successesThisPass}/${candidateCount})`);
        if (successesThisPass === 0) {
            break;
        }
    }

    console.log('## Stopping tsc --watch process...');
    tscWatchProcess.kill();

    console.log('## Collapsing fully null-checked directories into "include" patterns...');
    collapseCompletedDirectories(tsconfigPath);
}

async function tryAutoAddStrictNulls(child, tsconfigPath, file) {
    const relativeFilePath = path.relative(repoRoot, file).replace(/\\/g, '/');
    console.log(`Trying to auto add '${relativeFilePath}'`);

    const originalConfig = JSON.parse(fs.readFileSync(tsconfigPath).toString());
    originalConfig.files = Array.from(new Set(originalConfig.files.sort()));

    // Config on accept
    const newConfig = Object.assign({}, originalConfig);
    newConfig.files = Array.from(
        new Set(originalConfig.files.concat('./' + relativeFilePath).sort()),
    );

    const buildCompetePromise = waitForBuildComplete(child);

    writeTsconfigSync(tsconfigPath, newConfig);

    const errorCount = await buildCompetePromise;
    const success = errorCount === 0;
    if (success) {
        console.log(`Success`);
    } else {
        console.log(`Errors (x${errorCount}), skipped`);
        writeTsconfigSync(tsconfigPath, originalConfig);
    }

    return success;
}

const buildCompletePattern = /Found (\d+) errors?\. Watching for file changes\./gi;
async function waitForBuildComplete(tscWatchProcess) {
    const match = await waitForStdoutMatching(tscWatchProcess, buildCompletePattern);
    const errorCount = +match[1];
    return errorCount;
}

async function waitForStdoutMatching(child, pattern) {
    return new Promise(resolve => {
        const listener = data => {
            const textOut = data.toString();
            const match = pattern.exec(textOut);
            if (match) {
                child.stdout.removeListener('data', listener);
                resolve(match);
            }
        };
        child.stdout.on('data', listener);
    });
}

main().catch(error => {
    console.error(error.stack);
    process.exit(1);
});
