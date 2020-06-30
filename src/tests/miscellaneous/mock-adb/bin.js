// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const fs = require('fs');
const path = require('path');
const process = require('process');

const defaultConfigPath = path.join(path.dirname(process.execPath), 'mock_adb_config.json');
const configPath = process.env['MOCK_ADB_CONFIG'] || defaultConfigPath;

const configContent = fs.readFileSync(configPath);
const config = JSON.parse(configContent);

let ignoredPrefixArgs = 2; // node.exe bin.js
if (process.argv[2] === '-P') {
    ignoredPrefixArgs += 2; // -P 5037
}

const inputCommand = process.argv.slice(ignoredPrefixArgs).join(' ');
if (config[inputCommand] === undefined) {
    console.error(`unrecognized command: ${inputCommand}`);
    process.exit(1);
}

const result = config[inputCommand];

if (result.stderr != undefined) {
    console.error(result.stderr);
}
if (result.stdout != undefined) {
    console.log(result.stdout);
}
if (result.exitCode != undefined) {
    process.exit(result.exitCode);
}
