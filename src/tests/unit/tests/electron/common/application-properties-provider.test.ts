// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AppDataAdapter } from 'common/browser-adapters/app-data-adapter';
import { createGetToolDataDelegate } from 'electron/common/application-properties-provider';
import { AndroidScanResults } from 'electron/platform/android/scan-results';
import { Mock } from 'typemoq';

describe('ToolDataDelegate', () => {
    it('returns proper tool data', () => {
        const appDataAdapterMock = Mock.ofType<AppDataAdapter>();
        appDataAdapterMock.setup(adapter => adapter.getVersion()).returns(() => 'test-version');

        const scanResultsMock = Mock.ofType<AndroidScanResults>();
        scanResultsMock.setup(results => results.axeVersion).returns(() => 'test-axe-version');

        const testSubject = createGetToolDataDelegate(appDataAdapterMock.object);

        const result = testSubject(scanResultsMock.object);

        expect(result).toMatchInlineSnapshot(`
            Object {
              "applicationProperties": Object {
                "name": "Accessibility Insights for Android",
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
