// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/*
    Pre-requisites for this signing script: can only be run on Mac and our developer cert must be
    added to the default key-chain before codesign can use it for signing purposes. Additionally,
    the paths for .app locations must match below.
*/
const appLocations = [
    path.resolve('./drop/electron/unified-canary/packed/mac/'),
    path.resolve('./drop/electron/unified-insider/packed/mac/'),
    path.resolve('./drop/electron/unified-production/packed/mac/'),
];

/*
    Entitlements are derived from: https://github.com/electron/electron-notarize#prerequisites
    and https://github.com/electron-userland/electron-builder/issues/3940. These are also the same
    ones used by electron-builder:
    https://github.com/electron-userland/electron-builder/blob/master/packages/app-builder-lib/templates/entitlements.mac.plist

    .plist files cannot contain comments, so they are shared here, where they are applied.
*/
const entitlementsPath = process.argv[3];
const identityPath = process.argv[2];

function sign(pathToSign, withEntitlements) {
    const entitlements = withEntitlements ? ['--entitlements', entitlementsPath] : [];

    const cmd = 'codesign';
    const args = [
        '-s',
        identityPath,
        '--timestamp',
        '--force',
        '--options',
        'runtime',
        ...entitlements,
        pathToSign,
    ];

    console.log(
        `executing: codesign -s ***** --timestamp --force --options runtime ${entitlements} ${pathToSign}`,
    );
    execFileSync(cmd, args, { stdio: 'inherit' });
}

function signAsset(asset, pathToAsset) {
    const fullAssetPath = path.join(pathToAsset, asset);
    sign(fullAssetPath, false);
}

function getItemsInDir(pathToDir, extName = null) {
    if (fs.existsSync(pathToDir) === false) {
        return [];
    }

    const items = fs.readdirSync(pathToDir);

    if (extName === null) {
        return items;
    }

    return items.filter(f => path.extname(f) === extName);
}

/*
    https://developer.apple.com/forums/thread/701514#701514021 covers the basics of what to sign,
    how to sign it, and structuring the code. The BotFramework-Composter team also provided with an
    good example: https://github.com/microsoft/BotFramework-Composer/blob/main/Composer/packages/electron-server/scripts/sign-mac.js.
    Finally, the codesign verify task in the build will also point to files if anything goes awry.
*/
appLocations.forEach(dir => {
    const app = getItemsInDir(dir, '.app')[0];
    const frameworksPath = path.join(dir, app, 'Contents/Frameworks');
    const frameworks = getItemsInDir(frameworksPath, '.framework');
    const subApps = getItemsInDir(frameworksPath, '.app');

    frameworks.forEach(fw => {
        const subFWPath = path.join(frameworksPath, fw, 'Versions/A');
        const librariesPath = path.join(subFWPath, 'Libraries');
        const helpersPath = path.join(subFWPath, 'Helpers');
        const dyLibs = getItemsInDir(librariesPath, '.dylib');
        const helpers = getItemsInDir(helpersPath);

        dyLibs.forEach(lib => signAsset(lib, librariesPath));
        helpers.forEach(helper => signAsset(helper, helpersPath));

        sign(subFWPath, false);
    });

    subApps.forEach(subAppPath => {
        const appPath = path.join(frameworksPath, subAppPath);
        sign(appPath, true);
    });

    sign(path.join(dir, app), true);
});
