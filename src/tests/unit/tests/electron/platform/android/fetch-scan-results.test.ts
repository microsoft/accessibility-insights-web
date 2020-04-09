// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AxiosResponse } from 'axios';
import {
    createScanResultsFetcher,
    HttpGet,
    ScanResultsFetcher,
} from 'electron/platform/android/fetch-scan-results';
import { AndroidScanResults } from 'electron/platform/android/android-scan-results';
import { IMock, Mock } from 'typemoq';

describe('fetchScanResults', () => {
    let httpGetMock: IMock<HttpGet>;

    let testSubject: ScanResultsFetcher;

    const port = 10101;

    beforeEach(() => {
        httpGetMock = Mock.ofType<HttpGet>();
        testSubject = createScanResultsFetcher(httpGetMock.object);
    });

    it('returns a ScanResults instance', async () => {
        const data = {
            axeContext: {
                axeDevice: {
                    name: 'test device name',
                },
                axeMetadata: {
                    appIdentifier: 'test app identifier',
                },
            },
        };

        httpGetMock
            .setup(getter => getter(`http://localhost:${port}/AccessibilityInsights/result`))
            .returns(() => Promise.resolve({ data } as AxiosResponse<any>));

        const result = await testSubject(port);

        expect(result).toEqual(new AndroidScanResults(data));
    });

    it('propagates errors properly', async () => {
        const reason = 'test exception reason';

        httpGetMock
            .setup(getter => getter(`http://localhost:${port}/AccessibilityInsights/result`))
            .returns(() => Promise.reject(reason));

        await expect(testSubject(port)).rejects.toMatch(reason);
    });
});
