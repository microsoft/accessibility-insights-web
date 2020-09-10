// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// @ts-check
const path = require('path');
const process = require('process');
const { repoRoot } = require('./config');
const { getUncheckedLeafFiles, getAllTsFiles } = require('./eligible-file-finder');
const { getImportsForFile } = require('./import-finder');

const srcRoot = path.join(repoRoot, 'src');

let sort = true;
let filter;
let printDependedOnCount = true;
let includeTests = false;

// For test files only:
//   includeTests = true;
//   filter = x => x.endsWith('.test.ts');
async function main() {
    const eligibleFiles = await getUncheckedLeafFiles(repoRoot, { includeTests });

    const eligibleSet = new Set(eligibleFiles);

    const dependedOnCount = new Map(eligibleFiles.map(file => [file, 0]));

    for (const file of await getAllTsFiles(srcRoot)) {
        if (eligibleSet.has(file)) {
            // Already added
            continue;
        }

        for (const imp of getImportsForFile(file, srcRoot)) {
            if (dependedOnCount.has(imp)) {
                dependedOnCount.set(imp, dependedOnCount.get(imp) + 1);
            }
        }
    }

    let out = Array.from(dependedOnCount.entries());
    if (filter) {
        out = out.filter(x => filter(x[0]));
    }
    if (sort) {
        out = out.sort((a, b) => b[1] - a[1]);
    }
    for (const pair of out) {
        console.log(
            toFormattedFilePath(pair[0]) +
                (printDependedOnCount ? ` — Depended on by **${pair[1]}** files` : ''),
        );
    }
}

function toFormattedFilePath(file) {
    const relativePath = path.relative(srcRoot, file).replace(/\\/g, '/');
    return `"./src/${relativePath}",`;
}

main().catch(error => {
    console.error(error.stack);
    process.exit(1);
});
