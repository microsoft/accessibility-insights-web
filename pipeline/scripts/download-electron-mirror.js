// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const pkg = require('../../package.json');
const { download } = require('@electron/get');
const unzipper = require('unzipper');
const fs = require('fs');
const path = require('path');

if (
    process.env.ELECTRON_MIRROR_VAR === undefined ||
    process.env.ELECTRON_CUSTOM_DIR_VAR === undefined
) {
    console.error('ELECTRON_MIRROR_VAR and ELECTRON_CUSTOM_DIR_VAR must be defined');
    process.exit(1);
}

const destinationPath = 'node_modules/electron/dist';

const downloadElectron = async () => {
    const zipFilePath = await download(`${pkg.dependencies.electron}`, {
        mirrorOptions: {
            mirror: process.env.ELECTRON_MIRROR_VAR,
            customDir: process.env.ELECTRON_CUSTOM_DIR_VAR,
        },
        force: true,
    });
    console.log(`zip downloaded to dir ${zipFilePath}`);
    fs.createReadStream(zipFilePath).pipe(unzipper.Extract({ path: destinationPath }));
    console.log(`zip extracted to ${path.resolve(destinationPath)}`);
};

downloadElectron().catch(err => {
    console.error(err);
    process.exit(1);
});
