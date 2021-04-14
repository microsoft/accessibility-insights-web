// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const fs = require('fs');
const path = require('path');
const hashUtil = require('app-builder-lib/out/util/hash');
const YAML = require('js-yaml');

const parentDir = process.argv[2];
const platform = process.argv[3]; // should be 'mac', 'linux', or 'windows'

const getLatestYAMLPath = parentDir => {
    const platformModifier = platform === 'windows' ? '' : `-${platform}`;
    const latestPath = path.join(parentDir, `latest${platformModifier}.yml`);
    return latestPath;
};

const readLatestYAML = latestPath => {
    const latestString = fs.readFileSync(latestPath);
    const latestContent = YAML.load(latestString);
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

    for (const file of latestContent.files) {
        await updateSha512PropertyFromFile(file, file.url);
    }
};

const writeLatestYAML = (latestPath, latestContent) => {
    const rawLatestContent = YAML.dump(latestContent);
    fs.writeFileSync(latestPath, rawLatestContent);
};

// On mac we add the zip file ourselves & thus need
// to update the latest-mac.yml files entry
const updateFileList = latestContent => {
    if (platform === 'mac') {
        const files = fs.readdirSync(parentDir);
        const zipFile = files.find(f => path.extname(f) === '.zip');
        latestContent.files.push({
            url: path.basename(zipFile),
            sha512: 'WILL BE OVERWRITTEN',
            size: fs.statSync(path.resolve(parentDir, zipFile)).size,
        });
    }
};

const updateLatestYaml = async () => {
    const latestPath = getLatestYAMLPath(parentDir);
    const latestContent = readLatestYAML(latestPath);
    updateFileList(latestContent);
    await updateAllSha512s(latestContent);
    writeLatestYAML(latestPath, latestContent);
};

updateLatestYaml().catch(err => {
    console.error(err);
    process.exit(1);
});
