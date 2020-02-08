// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const Seven = require('node-7z');
const path = require('path');
const sevenBin = require('7zip-bin');
const fs = require('fs');

const parentDir = process.argv[2];
const signedFiles = fs.readdirSync(parentDir);
const zipTarget = signedFiles.find(f => path.extname(f) === '.zip' && f.startsWith('Accessibility'));
console.log(zipTarget);
console.log(sevenBin.path7za);
Seven.delete(zipTarget, '*.pkg', {
    $bin: sevenBin.path7za,
});
