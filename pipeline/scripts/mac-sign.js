// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function sign(path) {
    console.log(`signing ${path}`);
    const identity = '$(mac-notarization-developerid-certificate-identity)';
    const entitlementsPath =
        '$(System.DefaultWorkingDirectory)/src/electron/resources/entitlements.plist';
    execSync(
        `codesign -s ${identity} --timestamp --force --options runtime --entitlements ${entitlementsPath} ${path}`,
    );
}

const appLocations = [
    path.resolve(__dirname, './drop/electron/unified-canary/packed/mac/'),
    path.resolve(__dirname, './drop/electron/unified-insider/packed/mac/'),
    path.resolve(__dirname, './drop/electron/unified-production/packed/mac/'),
];

appLocations.forEach(console.log);
execSync(`echo $(System.DefaultWorkingDirectory)/drop/electron/unified-canary/packed/mac/`);
