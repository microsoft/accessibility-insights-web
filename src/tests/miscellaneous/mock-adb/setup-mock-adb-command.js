// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const { argv } = require('process');
const { commonAdbConfigs } = require('./common-adb-configs');
const { mockAdbFolder, setupMockAdb } = require('./setup-mock-adb');

const configName = argv[2];
const config = commonAdbConfigs[configName];

if (config == undefined) {
    const availableConfigNames = Object.keys(commonAdbConfigs).join(', ');
    console.error(`No mock-adb config "${configName}", expected one of: ${availableConfigNames}`);
    process.exit(1);
}

setupMockAdb(config)
    .then(() => {
        console.log('Successfully set up mock adb in folder:\n');
        console.log(mockAdbFolder);
        console.log('\n...supporting the following commands:\n');
        for (const command of Object.keys(config)) {
            console.log(`  adb [-P port] ${command}`);
        }
    })
    .catch(e => {
        console.error(e);
        process.exit(2);
    });
