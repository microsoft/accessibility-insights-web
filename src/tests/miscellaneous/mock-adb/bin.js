const fs = require('fs');
const path = require('path');
const process = require('process');

const defaultConfigPath = path.join(__dirname, 'mock_adb_config.json');
const configPath = process.env['MOCK_ADB_CONFIG'] || defaultConfigPath;

const configContent = fs.readFileSync(configPath);
const config = JSON.parse(configContent);

const inputCommand = process.argv.slice(2).join(' ');
if (config[inputCommand] === undefined) {
    console.error(`unrecognized command: ${inputCommand}`);
    process.exit(1);
}

const result = config[inputCommand]

if (result.stderr != undefined) {
    console.error(result.stderr);
}
if (result.stdout != undefined) {
    console.log(result.stdout);
}
if (result.exitCode != undefined) {
    process.exit(result.exitCode);
}
