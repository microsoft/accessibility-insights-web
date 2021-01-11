// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as path from 'path';
import { apkVersionName } from 'accessibility-insights-for-android-service-bin';
import { AndroidServiceApkLocator } from 'electron/platform/android/android-service-apk-locator';

describe('AndroidServiceApkLocator', () => {
    describe('with successful getAppPathAsync', () => {
        const appPath = path.join('.', 'bundle');
        const getAppPathAsync = () => Promise.resolve(appPath);

        it('calculates the expected path based on appPath', async () => {
            const testSubject = new AndroidServiceApkLocator(getAppPathAsync);
            const result = await testSubject.locateBundledApk();

            expect(result.path).toBe(path.join('.', 'android-service', 'android-service.apk'));
        });

        it('propagates versionName from the service-bin package', async () => {
            const testSubject = new AndroidServiceApkLocator(getAppPathAsync);
            const result = await testSubject.locateBundledApk();

            expect(result.versionName).toBe(apkVersionName);
        });
    });

    it('propagates errors from getAppPathAsync', async () => {
        const testError = new Error('test error');
        const getAppPathAsync = () => Promise.reject(testError);
        const testSubject = new AndroidServiceApkLocator(getAppPathAsync);

        await expect(testSubject.locateBundledApk()).rejects.toThrowError(testError);
    });
});
