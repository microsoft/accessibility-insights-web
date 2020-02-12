// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const hashUtil = require('app-builder-lib/out/util/hash');
const fs = require('fs');
const YAML = require('js-yaml');
const path = require('path');

const parentDir = process.argv[2];

const getLatestYAMLPath = parentDir => {
    const platformModifier =
        process.platform == 'darwin' ? '-mac' : process.platform == 'linux' ? '-linux' : '';
    const latestPath = path.join(parentDir, `latest${platformModifier}.yml`);
    return latestPath;
};

const readLatestYAML = latestPath => {
    const latestString = fs.readFileSync(latestPath);
    const latestContent = YAML.safeLoad(latestString);
    return latestContent;
};

const calculateSha512 = async absoluteFilePath => {
    return await hashUtil.hashFile(absoluteFilePath, 'sha512', 'base64');
};

const updateSha512PropertyFromFile = async (objectWithSha512Property, relativeFilePath) => {
    const absoluteFilePath = path.join(parentDir, relativeFilePath);
    const sha512 = await calculateSha512(absoluteFilePath);
    objectWithSha512Property.sha512 = sha512;
};

const updateAllSha512s = async latestContent => {
    await updateSha512PropertyFromFile(latestContent, latestContent.path);

    for (file of latestContent.files) {
        await updateSha512PropertyFromFile(file, file.url);
    }
};

const writeLatestYAML = (latestPath, latestContent) => {
    const rawLatestContent = YAML.safeDump(latestContent);
    fs.writeFileSync(latestPath, rawLatestContent);
};

const updateElectronChecksum = async () => {
    const latestPath = getLatestYAMLPath(parentDir);
    const latestContent = readLatestYAML(latestPath);
    await updateAllSha512s(latestContent);
    writeLatestYAML(latestPath, latestContent);
};

updateElectronChecksum();
