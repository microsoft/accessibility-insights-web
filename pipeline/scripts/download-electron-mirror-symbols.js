// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const core = require('./download-electron-mirror-core');

const downloadMirrorSymbols = async () => {
    await core.downloadAndExtractElectronArtifact('electron', 'symbols', 'pdb');
};

downloadMirrorSymbols().catch(err => {
    console.error(err);
    process.exit(1);
});
