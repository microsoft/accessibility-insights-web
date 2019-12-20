// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as process from 'child_process';
import { autoUpdater } from 'electron-updater';
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

export function verifySignatureOnLinux(privateKeyFile: string, appFile: string): void {
    if (os.platform() !== 'linux') {
        return;
    }

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
