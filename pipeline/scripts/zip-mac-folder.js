// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

/* 
    The macOS electron-builder update process requires a zip file
    (electron-builder #4230), but the zip file produced by 
    electron-builder is corrupted (electron-builder #3534).
    We use ditto to create the zip file ourselves.
*/

const child_process = require('child_process');
const fs = require('fs');
const path = require('path');

const parentDir = process.argv[2];
const files = fs.readdirSync(parentDir);
const existingDmg = files.find(f => path.extname(f) === '.dmg');
const appName = path.basename(existingDmg, path.extname(existingDmg));
const cmd = `/usr/bin/ditto`;
const args = ['-c', '-k', '--keepParent', 'mac', `${appName}.zip`];

console.log(`existingDmg: ${existingDmg}`);
console.log(`appName: ${appName}`);

child_process.execFileSync(cmd, args, {
    cwd: parentDir,
    stdio: 'inherit',
});
