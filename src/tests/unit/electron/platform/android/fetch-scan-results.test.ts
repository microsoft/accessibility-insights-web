// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AxiosResponse } from 'axios';
import { createFetchScanResults, FetchScanResultsType, HttpGet } from 'electron/platform/android/fetch-scan-results';
import { ScanResults } from 'electron/platform/android/scan-results';
import { IMock, Mock } from 'typemoq';

describe('fetchScanResults', () => {
    let httpGetMock: IMock<HttpGet>;

    let testSubject: FetchScanResultsType;

    const port = 10101;

    beforeEach(() => {
        httpGetMock = Mock.ofType<HttpGet>();
        testSubject = createFetchScanResults(httpGetMock.object);
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
            .setup(getter => getter(`http://localhost:${port}/axe/result`))
            .returns(() => Promise.resolve({ data } as AxiosResponse<any>));

        const result = await testSubject(port);

        expect(result).toEqual(new ScanResults(data));
    });

    it('propagates errors properly', async () => {
        const reason = 'test exception reason';

        httpGetMock.setup(getter => getter(`http://localhost:${port}/axe/result`)).returns(() => Promise.reject(reason));

        await expect(testSubject(port)).rejects.toMatch(reason);
    });
});
