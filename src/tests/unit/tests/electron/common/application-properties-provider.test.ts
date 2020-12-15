// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createGetToolDataDelegate } from 'electron/common/application-properties-provider';
import { AndroidScanResults } from 'electron/platform/android/android-scan-results';
import { Mock } from 'typemoq';

describe('ToolDataDelegate', () => {
    it('returns proper tool data', () => {
        const scanResultsMock = Mock.ofType<AndroidScanResults>();
        scanResultsMock.setup(results => results.axeVersion).returns(() => 'test-axe-version');

        const testSubject = createGetToolDataDelegate(
            'Accessibility Insights for Android',
            'test-version',
            'axe-android',
        );

        const result = testSubject(scanResultsMock.object);

        expect(result).toMatchInlineSnapshot(`
            Object {
              "applicationProperties": Object {
                "environmentName": undefined,
                "name": "Accessibility Insights for Android",
                "resolution": undefined,
                "version": "test-version",
              },
              "scanEngineProperties": Object {
                "name": "axe-android",
                "version": "test-axe-version",
              },
            }
        `);
    });
});
