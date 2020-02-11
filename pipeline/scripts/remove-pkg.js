// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const child_process = require('child_process');
const fs = require('fs');
const path = require('path');
const sevenBin = require('7zip-bin');

const parentDir = process.argv[2];
const signedFiles = fs.readdirSync(parentDir);
const zipTarget = signedFiles.find(f => path.extname(f) === '.zip');

console.log(`parentDir: ${parentDir}`);
console.log(`zipTarget to remove pkg from: ${zipTarget}`);
console.log(`path to 7z: ${sevenBin.path7za}`);

child_process.execSync(`${sevenBin.path7za} d "${zipTarget}" *.pkg`, {
    cwd: parentDir,
    stdio: 'inherit',
});
