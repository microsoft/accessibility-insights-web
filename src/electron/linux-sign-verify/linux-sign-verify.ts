// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as process from 'child_process';
import { autoUpdater, UpdateInfo } from 'electron-updater';
import { isNil } from 'lodash';
import * as os from 'os';

const verifySignatureCommand = function(verifyCommand, callback): void {
    process.exec(verifyCommand, (err, stderr, stdout) => {
        if (!isNil(err)) {
            console.log("There's an error:", err);
            return;
        } else {
            if (!isNil(stdout)) {
                console.log('stdout:\n', stdout);
                callback(stdout);
            } else if (!isNil(stderr)) {
                console.log('stderr:\n', stderr);
                callback(stderr);
            } else {
                return;
            }
        }
    });
};

export function verifySignatureOnLinux(info: UpdateInfo): void {
    console.log('verifySignatureOnLinux');
    if (os.platform() !== 'linux') {
        return;
    }

    console.log('isLinux');

    if (!isNil(info)) {
        if (!isNil(info.files)) {
            info.files.forEach(file => {
                console.log('\n=================\n');
                console.log('file: ', file);
                console.log('\n=================\n');
            });
        }

        if (!isNil(info.path)) {
            console.log('\n=================\n');
            console.log('path: ', info.path);
            console.log('\n=================\n');
        }

        if (!isNil(info.releaseDate)) {
            console.log('\n=================\n');
            console.log('releaseDate: ', info.releaseDate);
            console.log('\n=================\n');
        }

        if (!isNil(info.releaseName)) {
            console.log('\n=================\n');
            console.log('releaseName: ', info.releaseName);
            console.log('\n=================\n');
        }

        if (!isNil(info.releaseNotes)) {
            console.log('\n=================\n');
            console.log('releaseNotes: ', info.releaseNotes);
            console.log('\n=================\n');
        }

        if (!isNil(info.version)) {
            console.log('\n=================\n');
            console.log('version: ', info.version);
            console.log('\n=================\n');
        }

        if (!isNil(info.files)) {
            const privateKeyFile: string = info.files[0].url;
            const appFile: string = info.files[1].url;
            const verifyCommand = 'gpg --verify ' + privateKeyFile + ' ' + appFile;

            verifySignatureCommand(verifyCommand, function(result): void {
                autoUpdater.autoInstallOnAppQuit = false;
                const resultLines = result.split('\n');

                if (resultLines.length >= 3) {
                    if (resultLines[2].indexOf('Good signature from "Microsoft') < 0) {
                        autoUpdater.autoInstallOnAppQuit = true;
                    }
                }
            });
        }
    }
}
