// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
(async () => {
    const { execSync } = require('child_process');
    const fs = require('fs');
    const path = require('path');
    const { globbySync } = await import('globby');

    function sign(path, withEntitlements) {
        console.log(`signing ${path}`);
        const identity = '$(mac-notarization-developerid-certificate-identity)';
        const entitlementsPath = withEntitlements
            ? '--entitlements $(System.DefaultWorkingDirectory)/src/electron/resources/entitlements.plist'
            : '';
        execSync(
            `codesign -s ${identity} --timestamp --force --options runtime ${entitlementsPath} ${path}`,
            { stdio: 'inherit' },
        );
    }

    const appLocations = [
        path.resolve('./drop/electron/unified-canary/packed/mac/'),
        // path.resolve('./drop/electron/unified-insider/packed/mac/'),
        // path.resolve('./drop/electron/unified-production/packed/mac/'),
    ];

    appLocations.forEach(dir => {
        const files = fs.readdirSync(dir);
        const app = files.find(f => path.extname(f) === '.app');
        const frameworksPath = path.join(app, 'Contents/Frameworks');
        const frameworks = globbySync(`*.framework`, { cwd: frameworksPath, onlyFiles: false });

        frameworks.forEach(fw => {
            const subFWPath = path.join(frameworksPath, fw, 'Versions/A');
            const dyLibs = globbySync(`Libraries/*.dylib`, { cwd: subFWPath });

            dyLibs.forEach(lib => {
                const libPath = path.join(subFWPath, lib);
                sign(libPath, false);
            });

            sign(subFWPath, false);
        });

        const subApps = globbySync(`*.app`, { cwd: frameworksPath, onlyFiles: false });

        subApps.forEach(app => {
            const appPath = path.join(frameworksPath, app);
            sign(appPath, true);
        });
    });
})();
