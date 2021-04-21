// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const core = require('./download-electron-mirror-core');

const downloadMirrorBinaries = async () => {
    await core.downloadAndExtractElectronArtifact('electron', 'node_modules/electron/dist');
    await core.downloadAndExtractElectronArtifact(
        'chromedriver',
        'node_modules/electron-chromedriver/bin',
    );
};

downloadMirrorBinaries().catch(err => {
    console.error(err);
    process.exit(1);
});
