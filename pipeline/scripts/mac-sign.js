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
    path.resolve('./drop/electron/unified-canary/packed/mac/'),
    path.resolve('./drop/electron/unified-insider/packed/mac/'),
    path.resolve('./drop/electron/unified-production/packed/mac/'),
];

appLocations.forEach(dir => {
    const files = fs.readdirSync(dir);
    const app = files.find(f => path.extname(f) === '.app');
    console.log(app);
});
