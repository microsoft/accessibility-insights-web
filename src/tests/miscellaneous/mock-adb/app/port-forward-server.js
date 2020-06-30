// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const child_process = require('child_process');
const fs = require('fs');
const path = require('path');
const process = require('process');

// This is helpful for debugging, but causes us to not be able to exit before "detached" child
// process (the "correct" behavior), so we leave it off except when debugging mock-adb itself
const LOG_DETACHED_PROCESS = false;

const portForwardSentinelArgument = '__PORT_FORWARD_SERVER';

function portFile(port, fileExtension) {
    return path.join(path.dirname(process.execPath), `test-server-${port}.${fileExtension}`);
}

function startDetachedPortForwardServer(port, path) {
    const testServerProcess = child_process.spawn(
        process.argv[0],
        [process.argv[1], portForwardSentinelArgument, port, path],
        {
            detached: true, // avoid having test server exit when adb exits
            stdio: LOG_DETACHED_PROCESS ? ['ignore', 'pipe', 'pipe'] : 'ignore',
        },
    );
    if (LOG_DETACHED_PROCESS) {
        testServerProcess.stderr.pipe(fs.createWriteStream(portFile(port, 'err'), { flags: 'a' }));
        testServerProcess.stdout.pipe(fs.createWriteStream(portFile(port, 'out'), { flags: 'a' }));
    }
    testServerProcess.unref(); // avoid having adb wait for test server before exiting

    const pidFile = portFile(port, 'pid');
    fs.writeFileSync(pidFile, testServerProcess.pid);

    return testServerProcess.pid;
}

function stopDetachedPortForwardServer(port) {
    const pidFile = portFile(port, 'pid');
    if (!fs.existsSync(pidFile)) {
        return;
    }

    const pid = parseInt(fs.readFileSync(pidFile).toString(), 10);

    try {
        process.kill(pid);
    } catch (e) {
        // PID not found is ok, process already gone
        if (e.code !== 'ESRCH') {
            throw e;
        }
    }

    fs.unlinkSync(pidFile);

    return pid;
}

module.exports = {
    portForwardSentinelArgument,
    startDetachedPortForwardServer,
    stopDetachedPortForwardServer,
};
