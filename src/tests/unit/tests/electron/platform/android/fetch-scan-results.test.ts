// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AxiosResponse } from 'axios';
import { FeatureFlagStore } from 'background/stores/global/feature-flag-store';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { UnifiedFeatureFlags } from 'electron/common/unified-feature-flags';
import { AndroidScanResults } from 'electron/platform/android/android-scan-results';
import {
    createScanResultsFetcher,
    HttpGet,
    ScanResultsFetcher,
} from 'electron/platform/android/fetch-scan-results';
import { IMock, Mock, Times } from 'typemoq';

describe('fetchScanResults', () => {
    let httpGetMock: IMock<HttpGet>;
    let featureFlagStoreMock: IMock<FeatureFlagStore>;
    let testSubject: ScanResultsFetcher;

    const storeDataStub: FeatureFlagStoreData = {
        [UnifiedFeatureFlags.atfaResults]: false,
    };
    const port = 10101;

    beforeEach(() => {
        httpGetMock = Mock.ofType<HttpGet>();
        featureFlagStoreMock = Mock.ofType<FeatureFlagStore>();
        featureFlagStoreMock.setup(store => store.getState()).returns(() => storeDataStub);
        testSubject = createScanResultsFetcher(httpGetMock.object, featureFlagStoreMock.object);
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

    it.each([
        ['enabled', true],
        ['disabled', false],
    ])('calls expected API when atfaResults feature flag is %s', async (testName, flag) => {
        storeDataStub[UnifiedFeatureFlags.atfaResults] = flag;
        const versionNumber = flag ? '_v2' : '';

        httpGetMock
            .setup(getter =>
                getter(`http://localhost:${port}/AccessibilityInsights/result${versionNumber}`),
            )
            .returns(() => Promise.resolve({} as AxiosResponse<any>))
            .verifiable(Times.once());

        await testSubject(port);

        httpGetMock.verifyAll();
    });
});
