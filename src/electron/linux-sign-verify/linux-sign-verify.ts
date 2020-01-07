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

const downloadFilesCommand = function(downloadCommand, callback): void {
    process.exec(downloadCommand, _ => {
        callback();
    });
};

export function verifySignatureOnLinux(
    event: any,
    releaseNotes: any,
    releaseName: any,
    releaseDate: any,
    updateUrl: any,
): void {
    if (os.platform() !== 'linux') {
        return;
    }

    console.log('\n=================\n');
    console.log('event: ', event);
    console.log('\n=================\n');

    console.log('\n=================\n');
    console.log('releaseNotes: ', releaseNotes);
    console.log('\n=================\n');

    console.log('\n=================\n');
    console.log('releaseName: ', releaseName);
    console.log('\n=================\n');

    console.log('\n=================\n');
    console.log('releaseDate: ', releaseDate);
    console.log('\n=================\n');

    console.log('\n=================\n');
    console.log('updateUrl: ', updateUrl);
    console.log('\n=================\n');

    const downloadCommand =
        'mkdir verifyDetachedSignatureForAIAndroid\n' +
        'wget -O "verifyDetachedSignatureForAIAndroid/doc.AppImage" "https://a11yinsightsandroidblob.blob.core.windows.net/aimobile-canary/Accessibility Insights for Android.AppImage"\n' +
        'wget -O "verifyDetachedSignatureForAIAndroid/doc.sig" "https://a11yinsightsandroidblob.blob.core.windows.net/aimobile-canary/Accessibility Insights for Android.sig"\n';
    downloadFilesCommand(downloadCommand, function(): void {
        const privateKeyFile: string = 'verifyDetachedSignatureForAIAndroid/doc.sig';
        const appFile: string = 'verifyDetachedSignatureForAIAndroid/doc.AppImage';
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
        process.exec('rm -rf "verifyDetachedSignatureForAIAndroid"');
    });
}
