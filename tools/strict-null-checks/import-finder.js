// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// @ts-check
const path = require('path');
const ts = require('typescript');
const fs = require('fs');

module.exports.getImportsForFile = function getImportsForFile(parentFilePath, srcRoot) {
    const fileInfo = ts.preProcessFile(fs.readFileSync(parentFilePath).toString());
    return fileInfo.importedFiles
        .map(importedFile => importedFile.fileName)
        .filter(fileName => !/\.scss$/.test(fileName)) // remove css imports
        .filter(fileName => /\//.test(fileName)) // remove node modules (the import must contain '/')
        .filter(fileName => !/^(@uifabric|lodash|react-dom)\//.test(fileName)) // remove node module usages with slashes in name
        .map(fileName => {
            if (/(^\.\/)|(^\.\.\/)/.test(fileName)) {
                return path.join(path.dirname(parentFilePath), fileName);
            }
            return path.join(srcRoot, fileName);
        })
        .map(filePathWithoutExtension => {
            for (const ext of ['ts', 'tsx', 'js', 'jsx', 'd.ts']) {
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
};
