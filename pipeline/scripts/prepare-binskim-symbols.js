// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const fs = require('fs-extra');
const path = require('path');

const prepareBinskimDir = async () => {
    const symbolsPath = path.resolve('electron-symbols');
    const productPath = path.resolve('drop/electron/unified-production/packed/win-unpacked');

    await fs.copy(productPath, symbolsPath);
    await fs.rename(
        path.join(symbolsPath, 'Accessibility Insights for Android.exe'),
        path.join(symbolsPath, 'electron.exe'),
    );
};

prepareBinskimDir().catch(err => {
    console.error(err);
    process.exit(1);
});
