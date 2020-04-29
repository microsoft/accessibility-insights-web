// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const pkg = require('../../package.json');
const download = require('electron-download');
const unzipper = require('unzipper');
const fs = require('fs');

download(
    {
        version: pkg.dependencies.electron,
        cache: 'drop/zips',
    },
    function (err, zipPath) {
        // zipPath will be the path of the zip that it downloaded.
        // If the zip was already cached it will skip
        // downloading and call the cb with the cached zip path.
        // If it wasn't cached it will download the zip and save
        // it in the cache path.
        if (err) {
            console.log('Failed to download: ', err);
        } else {
            console.log('zipPath= ', zipPath);
            fs.createReadStream(zipPath).pipe(unzipper.Extract({ path: 'drop/electron-local' }));
        }
    },
);
