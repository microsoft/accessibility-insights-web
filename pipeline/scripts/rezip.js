// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const Seven = require('node-7z');
const path = require('path');
const sevenBin = require('7zip-bin');
const fs = require('fs');

const parentDir = process.argv[2];
const files = fs.readdirSync(parentDir);
const existingDmg = files.find(f => path.extname(f) === '.dmg' && f.startsWith('Accessibility'));

const appName = path.basename(existingDmg, path.extname(existingDmg));

console.log(appName);
console.log(existingDmg);
console.log(sevenBin.path7za);

process.chdir(parentDir);

Seven.add(`${appName}.zip`, 'mac', {
    $bin: sevenBin.path7za,
    recursive: true,
});
