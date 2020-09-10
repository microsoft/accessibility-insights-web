// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// @ts-check
const path = require('path');
const { getImportsForFile } = require('./import-finder');
const glob = require('glob');
const config = require('./config');

/**
 * @param {string} srcRoot
 * @param {{ includeTests: boolean }} [options]
 */
const getAllTsFiles = (srcRoot, options) => {
    return new Promise((resolve, reject) => {
        glob(`${srcRoot}/**/*.@(ts|tsx)`, (err, files) => {
            if (err) {
                return reject(err);
            }

            return resolve(
                files.filter(
                    file =>
                        !file.endsWith('.d.ts') &&
                        (options && options.includeTests ? true : !/\.test\.tsx?$/.test(file)),
                ),
            );
        });
    });
};

/**
 * @param {string} repoRoot
 * @param {{ includeTests: boolean }} [options]
 */
async function getUncheckedLeafFiles(repoRoot, options) {
    const imports = new Map();
    const getMemoizedImportsForFile = (file, srcRoot) => {
        if (imports.has(file)) {
            return imports.get(file);
        }
        const importList = getImportsForFile(file, srcRoot);
        imports.set(file, importList);
        return importList;
    };

    const srcRoot = path.join(repoRoot, 'src');

    const checkedFiles = await getCheckedFiles(repoRoot);

    const allFiles = await getAllTsFiles(srcRoot, options);

    const allUncheckedFiles = allFiles
        .filter(file => !checkedFiles.has(file))
        .filter(file => !config.skippedFiles.has(path.relative(srcRoot, file)));

    const uncheckedFileSet = new Set(allUncheckedFiles);

    const areAllImportsChecked = file => {
        const allImports = getMemoizedImportsForFile(file, srcRoot);
        return !allImports.some(imp => uncheckedFileSet.has(imp));
    };

    return allUncheckedFiles.filter(areAllImportsChecked);
}

async function getCheckedFiles(tsconfigDir) {
    const tsconfigContent = require(path.join(tsconfigDir, config.targetTsconfig));

    const set = new Set(
        tsconfigContent.files.map(f => path.join(tsconfigDir, f).replace(/\\/g, '/')),
    );
    const includes = tsconfigContent.include.map(include => {
        return new Promise((resolve, reject) => {
            glob(path.join(tsconfigDir, include), (err, files) => {
                if (err) {
                    return reject(err);
                }

                for (const file of files) {
                    set.add(file);
                }
                resolve();
            });
        });
    });
    await Promise.all(includes);
    return set;
}

module.exports = {
    getAllTsFiles,
    getUncheckedLeafFiles,
    getCheckedFiles,
};
