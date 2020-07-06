// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AxiosResponse } from 'axios';
import { DeviceConfig, DeviceConfigParser } from 'electron/platform/android/device-config';
import {
    createDeviceConfigFetcher,
    DEVICE_CONFIG_FETCH_TIMEOUT_MS,
    DeviceConfigFetcher,
} from 'electron/platform/android/device-config-fetcher';
import { HttpGet } from 'electron/platform/android/fetch-scan-results';
import { IMock, It, Mock, MockBehavior } from 'typemoq';

describe('createDeviceConfigFetcher', () => {
    const successfulResponse = {
        status: 200,
        data: { opaqueProperty: 'any value' },
    } as AxiosResponse<any>;
    const errorResponse = {
        status: 500,
        statusText: 'internal server error',
    } as AxiosResponse<any>;

    let mockHttpGet: IMock<HttpGet>;
    let mockParser: IMock<DeviceConfigParser>;
    let testSubject: DeviceConfigFetcher;

    beforeEach(() => {
        mockHttpGet = Mock.ofType<HttpGet>(undefined, MockBehavior.Strict);
        mockParser = Mock.ofType<DeviceConfigParser>(undefined, MockBehavior.Strict);
        testSubject = createDeviceConfigFetcher(mockHttpGet.object, mockParser.object);
    });

    function verifyAllMocks(): void {
        mockHttpGet.verifyAll();
        mockParser.verifyAll();
    }

    it('coordinates HttpGet and DeviceConfigParser in the happy path', async () => {
        const port = 123;
        const expectedUrl = `http://localhost:123/AccessibilityInsights/config`;
        const expectedRequestConfig = { timeout: DEVICE_CONFIG_FETCH_TIMEOUT_MS };
        const parserOutput: DeviceConfig = { deviceName: 'device', appIdentifier: 'app' };

        mockHttpGet
            .setup(m => m(expectedUrl, expectedRequestConfig))
            .returns(() => Promise.resolve(successfulResponse));

        mockParser.setup(m => m(successfulResponse.data)).returns(() => parserOutput);

        expect(await testSubject(port)).toBe(parserOutput);

        verifyAllMocks();
    });

    it('propagates errors (like timeouts) from httpGet', async () => {
        const httpGetError = new Error('error from httpGet');
        mockHttpGet
            .setup(m => m(It.isAny(), It.isAny()))
            .returns(() => Promise.reject(httpGetError));

        await expect(testSubject(123)).rejects.toThrowError(httpGetError);

        verifyAllMocks();
    });

    it('propagates non-successful responses from httpGet as errors', async () => {
        mockHttpGet
            .setup(m => m(It.isAny(), It.isAny()))
            .returns(() => Promise.resolve(errorResponse));

        await expect(testSubject(123)).rejects.toThrowErrorMatchingInlineSnapshot(
            `"Invalid DeviceConfig response: 500: internal server error"`,
        );

        verifyAllMocks();
    });

    it('propagates errors from parser', async () => {
        mockHttpGet
            .setup(m => m(It.isAny(), It.isAny()))
            .returns(() => Promise.resolve(successfulResponse));

        const parserError = new Error('error from parser');
        mockParser.setup(m => m(successfulResponse.data)).throws(parserError);

        await expect(testSubject(123)).rejects.toThrowError(parserError);

        verifyAllMocks();
    });
});
