// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const hashUtil = require('app-builder-lib/out/util/hash');
const fs = require('fs');
const YAML = require('js-yaml');
const path = require('path');

const getLatestYAMLPath = () => {
    const parentDir = process.argv.length > 2 ? process.argv[2] : 'dist'; // TODO - use library or envvar?

    const platformModifier = process.platform == 'darwin' ? '-mac' : process.platform == 'linux' ? '-linux' : '';
    const latestPath = path.join(parentDir, `latest${platformModifier}.yml`);
    return latestPath;
};

const readLatestYAML = latestPath => {
    const latestString = fs.readFileSync(latestPath);
    const latest = YAML.safeLoad(latestString);
    return latest;
};

const getSetupChecksum = async latest => {
    const setupFilePath = path.join('dist', latest.path);
    const setupChecksum = await hashUtil.hashFile(setupFilePath, 'sha512', 'base64');
    return setupChecksum;
};

const updateChecksumInLatest = (latest, setupChecksum) => {
    latest.sha512 = setupChecksum;
    latest.files[0].sha512 = setupChecksum;
};

const writeLatestYAML = (latestPath, latest) => {
    const latestYAML = YAML.safeDump(latest);
    fs.writeFileSync(latestPath, latestYAML);
};

const updateElectronChecksum = async () => {
    const latestPath = getLatestYAMLPath();
    const latest = readLatestYAML(latestPath);
    const setupChecksum = await getSetupChecksum(latest);

    updateChecksumInLatest(latest, setupChecksum);
    writeLatestYAML(latestPath, latest);
};

updateElectronChecksum();
