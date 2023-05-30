// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as path from 'path';

export const AndroidServicePackageName = 'com.microsoft.accessibilityinsightsforandroidservice';
export type AndroidServiceApkInfo = {
    path: string;
    versionName: string;
};

export class AndroidServiceApkLocator {
    public constructor(private readonly getAppPathAsync: () => Promise<string>) {}

    public async locateBundledApk(): Promise<AndroidServiceApkInfo> {
        const appPath = await this.getAppPathAsync();
        const apkVersionName = '2.1.0'; // Last supported version
        return {
            // This should be kept in sync with the corresponding Gruntfile copy config
            path: path.join(appPath, '..', 'android-service', 'android-service.apk'),
            versionName: apkVersionName,
        };
    }
}
