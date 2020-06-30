// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// @ts-check
const path = require('path');
const ts = require('typescript');
const fs = require('fs');

module.exports.getImportsForFile = function getImportsForFile(file, srcRoot) {
    const fileInfo = ts.preProcessFile(fs.readFileSync(file).toString());
    return fileInfo.importedFiles
        .map(importedFile => importedFile.fileName)
        .filter(fileName => !/\.scss$/.test(fileName)) // remove css imports
        .filter(x => /\//.test(x)) // remove node modules (the import must contain '/')
        .filter(x => !/^(@uifabric|lodash|react-dom)\//.test(x)) // remove node module usages with slashes in name
        .map(fileName => {
            if (/(^\.\/)|(^\.\.\/)/.test(fileName)) {
                return path.join(path.dirname(file), fileName);
            }
            return path.join(srcRoot, fileName);
        })
        .map(fileName => {
            for (const ext of ['ts', 'tsx', 'js', 'jsx', 'd.ts']) {
                const candidate = `${fileName}.${ext}`;
                if (fs.existsSync(candidate)) {
                    return candidate;
                }
            }

            for (const indexFile of ['index.ts', 'index.js']) {
                const candidate = path.join(fileName, indexFile);
                if (fs.existsSync(candidate)) {
                    return candidate;
                }
            }

            throw new Error(`Unresolved import ${fileName} in ${file}`);
        });
};
