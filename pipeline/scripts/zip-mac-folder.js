// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const fs = require('fs');
const path = require('path');
const sevenBin = require('7zip-bin');

const parentDir = process.argv[2];
const files = fs.readdirSync(parentDir);
const existingDmg = files.find(f => path.extname(f) === '.dmg');
const appName = path.basename(existingDmg, path.extname(existingDmg));

console.log(`existingDmg: ${existingDmg}`);
console.log(`appName: ${appName}`);
console.log(`path to 7z: ${sevenBin.path7za}`);

let stdout = child_process.execSync(`cd ${parentDir}`);
console.log(stdout);
stdout = child_process.execSync(`${sevenBin.path7za} a ${appName}.zip mac`);
console.log(stdout);
