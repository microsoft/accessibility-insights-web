// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const child_process = require('child_process');
const path = require('path');
const fs = require('fs-extra');

const runBinSkim = async () => {
    const binSkimDir = path.resolve('analysis/binskim');
    const fileTarget = path.resolve(binSkimDir, 'files-to-scan/*.*');
    const toolsDir = path.resolve(binSkimDir, 'tools');
    const logDir = path.resolve(binSkimDir, 'logs');
    const logFile = path.resolve(logDir, 'binskim.sarif');

    fs.readdir(toolsDir, (error, files) => {
        if (error) {
            console.log(error);
        } else {
            let foundFile = false;

            files.forEach(file => {
                if (file.startsWith('Microsoft.CodeAnalysis.BinSkim')) {
                    console.log(`found ${file}`);
                    const exe = path.resolve(
                        toolsDir,
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
