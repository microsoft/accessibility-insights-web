// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const {
    commonAdbConfigs,
    delayAllCommands,
    emulatorDeviceName,
    physicalDeviceName1,
    physicalDeviceName2,
    simulateNoDevicesConnected,
    simulateServiceNotInstalled,
    simulateServiceInstallationError,
    simulateServiceLacksPermissions,
    simulatePortForwardingError,
    simulateInputKeyeventError,
} = require('./common-adb-configs');
const { fileWithExpectedLoggingPath, fileWithMockAdbConfig } = require('./common-file-names.js');

const exists = promisify(fs.exists);
const writeFile = promisify(fs.writeFile);

const mockAdbFolder = path.join(__dirname, '../../../../drop/mock-adb');

const binPath = path.join(mockAdbFolder, process.platform === 'win32' ? 'adb.exe' : 'adb');
const configPath = path.join(mockAdbFolder, fileWithMockAdbConfig);

async function setupMockAdb(config, logFolderName, ...extraLogNames) {
    if (!(await exists(binPath))) {
        throw new Error(
            `Could not find mock-adb executable at expected path "${binPath}", try rebuilding with yarn build:mock-adb`,
        );
    }

    await writeFile(
        path.join(mockAdbFolder, fileWithExpectedLoggingPath),
        path.join(logFolderName, ...extraLogNames),
    );
    await writeFile(configPath, JSON.stringify(config, null, 2 /*spaces per indent*/));
}

module.exports = {
    mockAdbFolder,
    setupMockAdb,
    commonAdbConfigs,
    delayAllCommands,
    emulatorDeviceName,
    physicalDeviceName1,
    physicalDeviceName2,
    simulateNoDevicesConnected,
    simulateServiceNotInstalled,
    simulateServiceInstallationError,
    simulateServiceLacksPermissions,
    simulatePortForwardingError,
    simulateInputKeyeventError,
};
