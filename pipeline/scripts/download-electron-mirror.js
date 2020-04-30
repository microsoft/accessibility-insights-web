// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const pkg = require('../../package.json');
const { downloadArtifact } = require('@electron/get');
const unzipper = require('unzipper');
const fs = require('fs');
const path = require('path');
const fstream = require('fstream');

if (
    process.env.ELECTRON_MIRROR_VAR === undefined ||
    process.env.ELECTRON_CUSTOM_DIR_VAR === undefined
) {
    console.error('ELECTRON_MIRROR_VAR and ELECTRON_CUSTOM_DIR_VAR must be defined');
    process.exit(1);
}

const downloadMirrors = async () => {
    await downloadElectronArtifact('electron', 'node_modules/electron/dist');
    // await downloadElectronArtifact('chromedriver', 'node_modules/electron-chromedriver/bin');
};

const downloadElectronArtifact = async (artifactName, destinationPath) => {
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
    console.log(`extracting to ${path.resolve(destinationPath)}`);
    fs.createReadStream(zipFilePath).pipe(
        unzipper.Extract({
            path: path.resolve(destinationPath),
            getWriter: opts => fstream.Writer({ path: opts.path, follow: true }),
        }),
    );
};

downloadMirrors().catch(err => {
    console.error(err);
    process.exit(1);
});
