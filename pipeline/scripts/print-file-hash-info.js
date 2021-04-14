// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// In the build loop it can be helpful to know the
// sha256/512 value of the installer to help debug signing
const fs = require('fs');
const path = require('path');
const hashUtil = require('app-builder-lib/out/util/hash');

const parentDir = process.argv[2];

const printFileInfo = async () => {
    const entries = fs
        .readdirSync(parentDir, { withFileTypes: true })
        .filter(e => e.isFile())
        .map(e => e.name);
    for (const f of entries) {
        console.log(f);
        const filepath = path.resolve(parentDir, f);
        const sha256 = await hashUtil.hashFile(filepath, 'sha256', 'base64');
        const sha512 = await hashUtil.hashFile(filepath, 'sha512', 'base64');
        console.log(`  sha256 ${sha256}`);
        console.log(`  sha512 ${sha512}`);
    }
};

printFileInfo().catch(err => {
    console.error(err);
    process.exit(1);
});
