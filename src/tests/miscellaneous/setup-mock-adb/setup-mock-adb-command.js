// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const { argv } = require('process');
const { commonAdbConfigs } = require('./common-adb-configs');
const { mockAdbFolder, setupMockAdb } = require('./setup-mock-adb');

const availableConfigNameList = Object.keys(commonAdbConfigs).join(', ');

function exitWithUsage() {
    console.error(`Usage: yarn mock-adb config-name\n`);
    console.error(`Supported config-names: ${availableConfigNameList}`);
    process.exit(1);
}

if (argv.length !== 3) {
    exitWithUsage();
}

const configName = argv[2];
const config = commonAdbConfigs[configName];

if (config == null) {
    console.error(`Unrecognized config-name: ${configName}\n`);
    exitWithUsage();
}

setupMockAdb(config, 'default')
    .then(() => {
        console.log('Successfully set up mock adb in folder:\n');
        console.log(mockAdbFolder);
        console.log('\n...supporting the following exact commands:\n');
        for (const command of Object.keys(config)) {
            console.log(`  adb [-P port] ${command}`);
        }
        console.log('\n...and the following regular expressions:\n');
        for (const value of Object.values(config)) {
            const regexTarget = value.regexTarget;
            if (regexTarget) {
                console.log(`  adb [-P port] ${regexTarget}`);
            }
        }
    })
    .catch(e => {
        console.error(e);
        process.exit(2);
    });
