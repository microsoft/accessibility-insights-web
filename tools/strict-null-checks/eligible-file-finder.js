// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// @ts-check
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const config = require('./config');
const { getMemoizedImportsForFile } = require('./import-finder');

// "Eligible" means "a file that we might want to list in tsconfig.strictNullChecks.json"
// "Checked" means "a file that is currently listed in tsconfig.strictNullChecks.json"
// It is possible for an ineligible file to be checked (eg, a png under /src/icons/**)

const isTestFile = file => /\.test\.tsx?$/.test(file);

const isEligibleFile = file =>
    (file.endsWith('.ts') || file.endsWith('.tsx')) &&
    !file.endsWith('.d.ts') &&
    (config.includeTests || !isTestFile(file)) &&
    !config.skippedFiles.has(path.relative(config.srcRoot, file));

function globAsync(pattern) {
    return new Promise((resolve, reject) => {
        glob(pattern, (err, files) => {
            if (err) {
                reject(err);
            } else {
                resolve(files);
            }
        });
    });
}

// Includes both checked and unchecked files (ie, doesn't care about inclusion in tsconfig.strictNullChecks.json)
async function getAllEligibleFiles() {
    const tsFiles = await globAsync(`${config.srcRoot}/**/*.@(ts|tsx)`);
    const eligibleFiles = tsFiles.filter(isEligibleFile);
    return eligibleFiles;
}

// Includes ineligible files that are listed under glob patterns in tsconfig.strictNullChecks
async function getAllCheckedFiles() {
    const tsconfigPath = path.join(config.repoRoot, config.targetTsconfig);
    const tsconfigContent = JSON.parse(fs.readFileSync(tsconfigPath).toString());

    const set = new Set(
        tsconfigContent.files.map(f => path.join(config.repoRoot, f).replace(/\\/g, '/')),
    );
    await Promise.all(
        tsconfigContent.include.map(async include => {
            const includePath = path.join(config.repoRoot, include);
            const files = await globAsync(includePath);
            for (const file of files) {
                set.add(file);
            }
        }),
    );
    return set;
}

async function getUncheckedLeafFiles() {
    const checkedFiles = await getAllCheckedFiles();
    const eligibleFiles = await getAllEligibleFiles();
    const eligibleFileSet = new Set(eligibleFiles);

    const allUncheckedFiles = eligibleFiles.filter(file => !checkedFiles.has(file));

    const areAllImportsChecked = file => {
        const allImports = getMemoizedImportsForFile(file, config.srcRoot);
        const uncheckedImports = allImports.filter(imp => !checkedFiles.has(imp));
        const ineligibleUncheckedImports = uncheckedImports.filter(
            imp => !eligibleFileSet.has(imp),
        );
        if (ineligibleUncheckedImports.length > 0) {
            console.warn(
                `Eligible file ${file} with unchecked ineligible imports [${ineligibleUncheckedImports.join(
                    ', ',
                )}]`,
            );
        }
        return uncheckedImports.length === 0;
    };

    return allUncheckedFiles.filter(areAllImportsChecked);
}

module.exports = {
    getAllEligibleFiles,
    getUncheckedLeafFiles,
    getAllCheckedFiles,
};
