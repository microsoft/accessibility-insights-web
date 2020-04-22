// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const pkg = require('../../package.json');
const { download } = require('@electron/get');
const unzipper = require('unzipper');
const fs = require('fs');
const path = require('path');
const os = require('os');

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
    const renamedZip = path.join(fs.mkdtempSync(`${os.tmpdir()}${path.sep}`), 'electron.zip');
    fs.renameSync(zipFilePath, renamedZip);
    console.log(`zip renamed to ${renamedZip}`);
    const d = await unzipper.Open.file(renamedZip);
    await d.extract({ path: path.resolve(destinationPath), concurrency: 5 });
    console.log(`zip extracted to ${path.resolve(destinationPath)}`);
};

downloadElectron().catch(err => {
    console.error(err);
    process.exit(1);
});
