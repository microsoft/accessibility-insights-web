// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// @ts-check
const process = require('process');
const { srcRoot } = require('./config');
const { getAllEligibleFiles } = require('./eligible-file-finder');
const { getMemoizedImportsForFile } = require('./import-finder');

if (process.argv.includes('--help')) {
    console.log('yarn null:find-cycles');
    process.exit(0);
}

async function main() {
    const eligibleFiles = await getAllEligibleFiles();
    const fileState = {};
    for (const rootFile of eligibleFiles) {
        const transitiveImportsWithImportPath = {};
        const directImports = await getMemoizedImportsForFile(rootFile, srcRoot);
        const untraversedImportChains = directImports.map(directImport => ({
            file: directImport,
            path: [rootFile],
        }));
        while (untraversedImportChains.length > 0) {
            const currentImportChain = untraversedImportChains.pop();
            const currentImport = currentImportChain.file;
            if (transitiveImportsWithImportPath[currentImport] !== undefined) {
                continue;
            }
            transitiveImportsWithImportPath[currentImport] = currentImportChain;
            const nextImports = await getMemoizedImportsForFile(currentImport, srcRoot);
            const nextImportChains = nextImports.map(file => ({
                file,
                path: [...currentImportChain.path, currentImport],
            }));
            untraversedImportChains.push(...nextImportChains);
        }
        fileState[rootFile] = {
            transitiveImportsWithImportPath,
            selfImportPath:
                transitiveImportsWithImportPath[rootFile] &&
                transitiveImportsWithImportPath[rootFile].path,
        };
    }

    const selfImportsByLength = Object.values(fileState)
        .map(s => s.selfImportPath)
        .filter(path => path != null)
        .sort((a, b) => b.length - a.length);

    console.log(JSON.stringify(selfImportsByLength, null, 2));
}

main().catch(error => {
    console.error(error.stack);
    process.exit(1);
});
