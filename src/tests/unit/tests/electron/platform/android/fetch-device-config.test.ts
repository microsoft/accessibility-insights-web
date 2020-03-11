// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AxiosResponse } from 'axios';
import { DeviceConfig } from 'electron/platform/android/device-config';
import {
    createDeviceConfigFetcher,
    DeviceConfigFetcher,
} from 'electron/platform/android/device-config-fetcher';
import { HttpGet } from 'electron/platform/android/fetch-scan-results';
import { IMock, Mock } from 'typemoq';

describe('fetchDeviceConfig', () => {
    let httpGetMock: IMock<HttpGet>;

    let testSubject: DeviceConfigFetcher;

    const port = 10101;

    beforeEach(() => {
        httpGetMock = Mock.ofType<HttpGet>();
        testSubject = createDeviceConfigFetcher(httpGetMock.object);
    });

    it('returns a ScanResults instance', async () => {
        const data = {
            deviceName: 'some device',
            packageName: 'some app',
            serviceVersion: '0.1.0',
        };

        httpGetMock
            .setup(getter => getter(`http://localhost:${port}/AccessibilityInsights/config`))
            .returns(() => Promise.resolve({ data } as AxiosResponse<any>));

        const result = await testSubject(port);

        expect(result).toEqual(new DeviceConfig(data));
    });

    it('propagates errors properly', async () => {
        const reason = 'test exception reason';

        httpGetMock
            .setup(getter => getter(`http://localhost:${port}/AccessibilityInsights/config`))
            .returns(() => Promise.reject(reason));

        await expect(testSubject(port)).rejects.toMatch(reason);
    });
});
