// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const path = require('path');

function generateOutputLogsDir(rootDir, currentContext) {
    return path.join(rootDir, 'logs', currentContext);
}

function generateAdbLogPath(outputLogsDir) {
    return path.join(outputLogsDir, 'adb.log');
}

function generateServerLogPath(outputLogsDir) {
    return path.join(outputLogsDir, 'server.log');
}

module.exports = {
    generateAdbLogPath,
    generateOutputLogsDir,
    generateServerLogPath,
};
