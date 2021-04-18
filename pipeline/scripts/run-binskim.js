// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const child_process = require('child_process');
const fs = require('fs-extra');
const path = require('path');

const runBinSkim = async () => {
    const buildDir = process.argv[2];
    const logFile = path.resolve(process.argv[3]);
    const logDir = path.dirname(logFile);
    const fileTarget = path.resolve('electron-symbols', '*.*');

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
                    );
                    if (fs.existsSync(exe)) {
                        foundFile = true;
                        fs.mkdirSync(logDir, { recursive: true });
                        child_process.execFileSync(
                            exe,
                            ['analyze', fileTarget, '--recurse', '--output', logFile],
                            {
                                stdio: ['pipe', process.stdout, process.stderr],
                            },
                        );
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
