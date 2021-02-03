// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// @ts-check
const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const imports = new Map();
const getMemoizedImportsForFile = (file, srcRoot) => {
    if (imports.has(file)) {
        return imports.get(file);
    }
    const importList = getImportsForFile(file, srcRoot);
    imports.set(file, importList);
    return importList;
};

function getImportsForFile(parentFilePath, srcRoot) {
    const fileInfo = ts.preProcessFile(fs.readFileSync(parentFilePath).toString());
    return fileInfo.importedFiles
        .map(importedFile => importedFile.fileName)
        .filter(fileName => !/\.scss$/.test(fileName)) // remove css imports
        .filter(fileName => /\//.test(fileName)) // remove node modules (the import must contain '/')
        .filter(fileName => !/^(@uifabric|lodash|react-dom|axe-core)\//.test(fileName)) // remove node module usages with slashes in name
        .map(fileName => {
            if (/(^\.\/)|(^\.\.\/)/.test(fileName)) {
                return path.join(path.dirname(parentFilePath), fileName);
            }
            return path.join(srcRoot, fileName);
        })
        .map(filePathWithoutExtension => {
            for (const ext of ['ts', 'tsx', 'd.ts', 'js', 'jsx']) {
                const candidate = `${filePathWithoutExtension}.${ext}`;
                if (fs.existsSync(candidate)) {
                    return candidate;
                }
            }

            for (const indexFile of ['index.ts', 'index.js']) {
                const candidate = path.join(filePathWithoutExtension, indexFile);
                if (fs.existsSync(candidate)) {
                    return candidate;
                }
            }

            throw new Error(`Unresolved import ${filePathWithoutExtension} in ${parentFilePath}`);
        })
        .map(unnormalizedPath => unnormalizedPath.replace(/\\/g, '/'))
        .map(filePath => {
            if (filePath === parentFilePath) {
                throw new Error(`self-import in ${parentFilePath}`);
            }
            return filePath;
        });
}

module.exports = {
    getImportsForFile,
    getMemoizedImportsForFile,
};
