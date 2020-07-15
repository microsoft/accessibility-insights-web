// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const {
    commonAdbConfigs,
    simulateNoDevicesConnected,
    simulateServiceNotInstalled,
    simulateServiceInstallationError,
    simulateServiceLacksPermissions,
    simulatePortForwardingError,
} = require('./common-adb-configs');

const exists = promisify(fs.exists);
const writeFile = promisify(fs.writeFile);

const mockAdbFolder = path.join(__dirname, '../../../../drop/mock-adb');

const binPath = path.join(mockAdbFolder, process.platform === 'win32' ? 'adb.exe' : 'adb');
const configPath = path.join(mockAdbFolder, 'mock_adb_config.json');

async function setupMockAdb(config) {
    if (!(await exists(binPath))) {
        throw new Error(
            `Could not find mock-adb executable at expected path "${binPath}", try rebuilding with yarn build:mock-adb`,
        );
    }

    await writeFile(configPath, JSON.stringify(config));
}

module.exports = {
    mockAdbFolder,
    setupMockAdb,
    commonAdbConfigs,
    simulateNoDevicesConnected,
    simulateServiceNotInstalled,
    simulateServiceInstallationError,
    simulateServiceLacksPermissions,
    simulatePortForwardingError,
};
