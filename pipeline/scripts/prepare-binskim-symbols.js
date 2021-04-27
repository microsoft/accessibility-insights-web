// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const path = require('path');
const fs = require('fs-extra');

const prepareBinskimDir = async () => {
    const symbolsPath = path.resolve('analysis/binskim/files-to-scan');
    const productPath = path.resolve('drop/electron/unified-production/packed/win-unpacked');

    await fs.copy(productPath, symbolsPath);
    await fs.rename(
        path.join(symbolsPath, 'Accessibility Insights for Android.exe'),
        path.join(symbolsPath, 'electron.exe'),
    );

    // These assemblies don't have symbols and are intentionally ignored
    const swiftShaderPath = path.join(symbolsPath, 'swiftshader');
    await fs.unlink(path.join(swiftShaderPath, 'libEGL.dll'));
    await fs.unlink(path.join(swiftShaderPath, 'libGLESv2.dll'));
    await fs.unlink(path.join(symbolsPath, 'd3dcompiler_47.dll'));

    console.log(`Symbols prepared in ${symbolsPath}`);
};

prepareBinskimDir().catch(err => {
    console.error(err);
    process.exit(1);
});
