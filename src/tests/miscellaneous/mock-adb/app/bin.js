// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const fs = require('fs');
const path = require('path');
const process = require('process');
const {
    startDetachedPortForwardServer,
    stopDetachedPortForwardServer,
    tryHandleAsPortForwardServer,
} = require('./port-forward-server.js');

async function main() {
    if (await tryHandleAsPortForwardServer(process.argv)) {
        return;
    }

    // Note: if you base a path on __dirname, pkg will bundle it into adb.exe
    // Use path.dirname(process.execPath) instead for it to look for the file at runtime
    const runtimeDirname = path.dirname(process.execPath);

    const defaultConfigPath = path.join(runtimeDirname, 'mock_adb_config.json');
    const configPath = process.env['MOCK_ADB_CONFIG'] || defaultConfigPath;

    const configContent = fs.readFileSync(configPath);
    const config = JSON.parse(configContent);

    const outputFile = path.join(path.dirname(process.execPath), 'mock_adb_output.json');

    let ignoredPrefixArgs = 2; // node.exe bin.js
    if (process.argv[2] === '-P') {
        ignoredPrefixArgs += 2; // -P 5037
    }

    const inputCommand = process.argv.slice(ignoredPrefixArgs).join(' ');
    const defaultResult = {
        exitCode: 1,
        stderr: `unrecognized command: ${inputCommand}`,
    };

    const result = config[inputCommand] != undefined ? config[inputCommand] : defaultResult;

    if (result.startTestServer != undefined) {
        const { port, path } = result.startTestServer;
        stopDetachedPortForwardServer(port);
        result.testServerPid = await startDetachedPortForwardServer(port, path);
    }
    if (result.stopTestServer != undefined) {
        const { port } = result.stopTestServer;
        result.testServerPid = stopDetachedPortForwardServer(port);
    }
    if (result.stderr != undefined) {
        console.error(result.stderr);
    }
    if (result.stdout != undefined) {
        console.log(result.stdout);
    }

    result.input = process.argv;
    result.inputCommand = inputCommand;
    fs.writeFileSync(outputFile, JSON.stringify(result, null, '    '), { flag: 'a' });

    if (result.exitCode != undefined) {
        process.exit(result.exitCode);
    }
}

main().catch(e => {
    console.error(`mock-adb error: ${e.stack}`);
    process.exit(1);
});
