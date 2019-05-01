// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isFunction } from 'lodash';
import { It, Mock } from 'typemoq';
import { ChromeAdapter } from '../../../../background/browser-adapter';
import { UrlValidator } from '../../../../common/url-validator';

describe('UrlValidatorTest', () => {
    let testSubject: UrlValidator;

    const supportedUrlCases = [
        ['http://url', true],
        ['https://url', true],
        ['https://accessibilityinsights.io/docs/en/web/overview', true],
        ['https://chrome.google.com/webstore/', false],
        ['https://microsoftedge.microsoft.com/insider-addons/', false],
        ['chrome://are/you/ok?', false],
        ['edge://extensions/', false],
        ['http://domain-with-no-trailing-slash', true],
        ['http:/oops', false],
        ['oops_http://example.com', false],
    ];

    test.each(supportedUrlCases)('isSupportedUrl: %s should be %s', async (url: string, expected: boolean) => {
        testSubject = new UrlValidator();
        const isSupported = await testSubject.isSupportedUrl(url, It.isAny());
        expect(isSupported).toBe(expected);
    });

    test('isSupportedUrl: file', async () => {
        const url: string = 'file://test';
        testSubject = new UrlValidator();
        const browserAdapterMock = Mock.ofType(ChromeAdapter);
        browserAdapterMock
            .setup(b => b.isAllowedFileSchemeAccess(It.is(isFunction)))
            .callback(callback => {
                callback(true);
            })
            .verifiable();

        const isSupported = await testSubject.isSupportedUrl(url, browserAdapterMock.object);
        expect(isSupported).toBe(true);

        browserAdapterMock.verifyAll();
    });

    test('isFileUrl, but have no access, so isNotSupportedUrl', async () => {
        const url: string = 'file://yes/I/am!';
        testSubject = new UrlValidator();
        const browserAdapterMock = Mock.ofType(ChromeAdapter);
        browserAdapterMock
            .setup(b => b.isAllowedFileSchemeAccess(It.is(isFunction)))
            .callback(callback => {
                callback(false);
            })
            .verifiable();

        const isSupported = await testSubject.isSupportedUrl(url, browserAdapterMock.object);
        expect(isSupported).toBe(false);

        browserAdapterMock.verifyAll();
    });
});
