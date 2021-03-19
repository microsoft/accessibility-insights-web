// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const child_process = require('child_process');
const fs = require('fs');
const path = require('path');
const process = require('process');
const { startMockService } = require('../../mock-service-for-android/mock-service');

// This is helpful for debugging, but causes us to not be able to exit before "detached" child
// process (the "correct" behavior), so we leave it off except when debugging mock-adb itself
const LOG_DETACHED_PROCESS = false;

const portForwardSentinelArgument = '__PORT_FORWARD_SERVER';
const portForwardProcessReadyMessage = 'PORT_FORWARD_PROCESS_READY';
const portForwardProcessStartTimeoutMs = 10000;

function portFile(port, fileExtension) {
    return path.join(path.dirname(process.execPath), `test-server-${port}.${fileExtension}`);
}

// Returns whether argv indicated it *should* be handled as a port server
async function tryHandleAsPortForwardServer(argv) {
    if (argv[2] !== portForwardSentinelArgument) {
        return false;
    }

    const port = parseInt(process.argv[3], 10);
    const path = process.argv[4];
    const testLogsDir = process.argv[5];

    await startMockService(port, path, testLogsDir);

    process.send(portForwardProcessReadyMessage);
    return true;
}

async function waitForReadyMessage(testServerProcess) {
    return new Promise((resolve, reject) => {
        let timeoutId = null;

        const onMessage = message => {
            if (message === portForwardProcessReadyMessage) {
                testServerProcess.off('message', onMessage);
                if (timeoutId != null) {
                    clearTimeout(timeoutId);
                }
                resolve();
            }
        };

        const onTimeout = () => {
            testServerProcess.off('message', onMessage);
            reject(new Error('Timeout: child port-forwarding server never sent ready message'));
        };

        timeoutId = setTimeout(onTimeout, portForwardProcessStartTimeoutMs);
        testServerProcess.on('message', onMessage);
    });
}

async function startDetachedPortForwardServer(port, path, testLogsDir) {
    const testServerProcess = child_process.fork(
        process.argv[1],
        [portForwardSentinelArgument, port, path, testLogsDir],
        {
            detached: true, // avoid having test server exit when adb exits
            stdio: LOG_DETACHED_PROCESS
                ? ['ignore', 'pipe', 'pipe', 'ipc']
                : ['ignore', 'ignore', 'ignore', 'ipc'],
        },
    );
    if (LOG_DETACHED_PROCESS) {
        testServerProcess.stderr.pipe(fs.createWriteStream(portFile(port, 'err'), { flags: 'a' }));
        testServerProcess.stdout.pipe(fs.createWriteStream(portFile(port, 'out'), { flags: 'a' }));
    }

    try {
        await waitForReadyMessage(testServerProcess);
    } catch (e) {
        testServerProcess.kill();
        throw e;
    }

    testServerProcess.disconnect();
    testServerProcess.unref(); // avoid having adb wait for test server before exiting

    const pidFile = portFile(port, 'pid');
    fs.writeFileSync(pidFile, `${testServerProcess.pid}`);

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
    startDetachedPortForwardServer,
    stopDetachedPortForwardServer,
    tryHandleAsPortForwardServer,
};
