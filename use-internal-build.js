// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const download = require('electron-download');
const unzipper = require('unzipper');
const fs = require('fs');

download(
    {
        version: '7.1.1',
        cache: 'zips',
    },
    function(err, zipPath) {
        // zipPath will be the path of the zip that it downloaded.
        // If the zip was already cached it will skip
        // downloading and call the cb with the cached zip path.
        // If it wasn't cached it will download the zip and save
        // it in the cache path.
        console.log('zipPath= ', zipPath);
        fs.createReadStream(zipPath).pipe(unzipper.Extract({ path: 'node_modules/electron/dist' }));
    },
);
