// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as process from 'child_process';
import { isNil } from 'lodash';
import * as os from 'os';

function isOSLinux(): boolean {
    return os.platform() === 'linux';
}

function importPublicKey(): void {
    const execCommand = function(importCommand, callback): void {
        process.exec(importCommand, (err, stderr, stdout) => {
            if (!isNil(err)) {
                console.log("There's an error:", err);
                return;
            } else {
                console.log('stderr:\n', stderr);
                console.log('stdout:\n', stdout);
                callback(true);
            }
        });
    };
}

function verifySignature(): void {
    const execCommand = function(verifyCommand, callback): void {
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
}

function verifySignatureOnLinux(publicKeyFile, privateKeyFile, appFile): void {
    if (os.platform() !== 'linux') {
        return;
    }

    const importCommand = 'gpg --import ' + publicKeyFile;
    const importPublicKeyFunc = new importPublicKey();

    importPublicKeyFunc.execCommand(importCommand, function(isImported): void {
        if (isImported) {
            console.log('Public key was imported successfully');

            const verifySignatureFunc = new verifySignature();
            const verifyCommand = 'gpg --verify ' + privateKeyFile + ' ' + appFile;

            verifySignatureFunc.execCommand(verifyCommand, function(result): void {
                const resultLines = result.split('\n');

                if (resultLines.length === 7) {
                    if (resultLines[2].indexOf('Good signature') >= 0) {
                        if (
                            resultLines[3].indexOf(
                                'This key is certified with a trusted signature',
                            ) >= 0
                        ) {
                            console.log('The certificate is trusted');
                            return;
                        }
                    }
                }
                console.log('The certificate is not trusted, deletion process is started....');
            });
        }
    });
}
