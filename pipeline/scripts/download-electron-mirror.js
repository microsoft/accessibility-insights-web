// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const pkg = require('../../package.json');
const { downloadArtifact } = require('@electron/get');
const extract = require('extract-zip');
const fs = require('fs');
const path = require('path');

if (
    process.env.ELECTRON_MIRROR_VAR === undefined ||
    process.env.ELECTRON_CUSTOM_DIR_VAR === undefined
) {
    console.error('ELECTRON_MIRROR_VAR and ELECTRON_CUSTOM_DIR_VAR must be defined');
    process.exit(1);
}

const downloadMirrors = async () => {
    await downloadElectronArtifact('electron', 'node_modules/electron/dist');
    await downloadElectronArtifact('chromedriver', 'node_modules/electron-chromedriver/bin');
};

const downloadElectronArtifact = async (artifactName, destinationPath) => {
    destinationPath = path.resolve(destinationPath);
    console.log(`downloading ${artifactName} at ${pkg.dependencies.electron}`);
    const zipFilePath = await downloadArtifact({
        version: `${pkg.dependencies.electron}`,
        artifactName,
        mirrorOptions: {
            mirror: process.env.ELECTRON_MIRROR_VAR,
            customDir: process.env.ELECTRON_CUSTOM_DIR_VAR,
        },
        force: true,
    });
    console.log(`zip downloaded to dir ${zipFilePath}`);
    console.log(`extracting to ${destinationPath}`);

    fs.rmdirSync(destinationPath, { recursive: true });

    await extract(zipFilePath, { dir: destinationPath });
};

downloadMirrors().catch(err => {
    console.error(err);
    process.exit(1);
});
