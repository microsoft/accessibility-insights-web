// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const child_process = require('child_process');
const fs = require('fs-extra');
const path = require('path');

const runBinSkim = async () => {
    const buildDir = process.argv[2];
    const symbolsPath = path.resolve('electron-symbols');

    fs.readdir(buildDir, (error, files) => {
        if (error) {
            console.log(error);
        } else {
            let foundFile = false;

            files.forEach(file => {
                if (file.startsWith('Microsoft.CodeAnalysis.BinSkim')) {
                    console.log(`found ${file}`);
                    const exe = path.resolve(
                        buildDir,
                        file,
                        'tools',
                        'netcoreapp3.1',
                        'win-x64',
                        'BinSkim.exe',
                        '*.*',
                    );
                    console.log(`exe = ${exe}`);
                    if (fs.existsSync(exe)) {
                        foundFile = true;
                        child_process.execFileSync(exe, ['analyze', symbolsPath, '--recurse'], {
                            stdio: ['pipe', process.stdout, process.stderr],
                        });
                    }
                }
            });

            if (!foundFile) {
                throw new Error('Could not find BinSkim.exe');
            }
        }
    });
};

runBinSkim().catch(err => {
    console.error(err);
    process.exit(1);
});
