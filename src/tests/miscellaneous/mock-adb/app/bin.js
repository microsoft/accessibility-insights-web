// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const fs = require('fs');
const { EOL } = require('os');
const path = require('path');
const process = require('process');
const { fileWithExpectedLoggingPath, fileWithMockAdbConfig } = require('../common-file-names.js');
const { generateAdbLogPath, generateOutputLogsDir } = require('../generate-log-paths.js');

function resultFromCommand(config, inputCommand) {
    // First option: exact match
    if (config[inputCommand]) {
        return config[inputCommand];
    }

    // Second option: regex match
    Object.values(config).forEach(value => {
        const regexTarget = value.regexTarget;
        if (regexTarget) {
            const regex = new RegExp(regexTarget);
            if (regex.test(inputCommand)) {
                return value;
            }
        }
    });

    // default result (error)
    return {
        exitCode: 1,
        stderr: `unrecognized command: ${inputCommand}`,
    };
}

async function main() {
    // Note: if you base a path on __dirname, pkg will bundle it into adb.exe
    // Use path.dirname(process.execPath) instead for it to look for the file at runtime
    const runtimeDirname = path.dirname(process.execPath);

    const defaultConfigPath = path.join(runtimeDirname, fileWithMockAdbConfig);
    const configPath = process.env['MOCK_ADB_CONFIG'] || defaultConfigPath;

    const configContent = fs.readFileSync(configPath);
    const config = JSON.parse(configContent);

    const currentContext = fs.readFileSync(
        path.join(runtimeDirname, fileWithExpectedLoggingPath),
        'utf-8',
    );

    const outputLogsDir = generateOutputLogsDir(path.dirname(process.execPath), currentContext);
    fs.mkdirSync(outputLogsDir, { recursive: true });

    const adbLogsPath = generateAdbLogPath(outputLogsDir);

    const outputFile = path.join(outputLogsDir, 'mock_adb_output.json');

    let ignoredPrefixArgs = 2; // node.exe bin.js
    if (process.argv[2] === '-P') {
        ignoredPrefixArgs += 2; // -P 5037
    }

    const inputCommand = process.argv.slice(ignoredPrefixArgs).join(' ');

    const result = resultFromCommand(config, inputCommand);

    if (result.delayMs != null) {
        await new Promise(resolve => {
            setTimeout(resolve, result.delayMs);
        });
    }
    if (result.stderr != null) {
        console.error(result.stderr);
    }
    if (result.stdout != null) {
        console.log(result.stdout);
    }

    result.input = process.argv;
    result.inputCommand = inputCommand;

    fs.writeFileSync(adbLogsPath, `ADB ${inputCommand}\n`, {
        flag: 'a',
    });
    fs.writeFileSync(outputFile, JSON.stringify(result, null, '    ') + EOL, { flag: 'a' });

    const outputConfigFile = path.join(outputLogsDir, fileWithMockAdbConfig);
    fs.copyFileSync(configPath, outputConfigFile);

    if (result.exitCode != null) {
        process.exit(result.exitCode);
    }
}

main().catch(e => {
    console.error(`mock-adb error: ${e.stack}`);
    process.exit(1);
});
