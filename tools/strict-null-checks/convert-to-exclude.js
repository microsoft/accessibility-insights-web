// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// @ts-check
const fs = require('fs');
const path = require('path');
const config = require('./config');
const { getAllCheckedFiles, getAllEligibleFiles } = require('./eligible-file-finder');
const { writeTsConfig } = require('./write-tsconfig');

const repoRoot = config.repoRoot;
const tsconfigPath = path.join(repoRoot, config.targetTsconfig);

async function main() {
    const excludeList = await buildExcludeList();
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath).toString());

    delete tsconfig.files;
    tsconfig.include = ['src/**/*.ts', 'src/**/*.tsx'];
    tsconfig.exclude = ['**/*.test.ts', '**/*.test.tsx', ...excludeList];

    await writeTsConfig(tsconfigPath, tsconfig);
}

async function buildExcludeList() {
    const checkedFiles = await getAllCheckedFiles();
    const eligibleFiles = await getAllEligibleFiles();

    const allUncheckedFiles = eligibleFiles.filter(file => !checkedFiles.has(file));

    allUncheckedFiles.sort();

    return allUncheckedFiles.map(file => path.relative(repoRoot, file).replace(/\\/g, '/'));
}

main().catch(error => {
    console.error(error.stack);
    process.exit(1);
});
