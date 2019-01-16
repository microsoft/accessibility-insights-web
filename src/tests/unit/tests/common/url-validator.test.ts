// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isFunction } from 'lodash';
import { It, Mock } from 'typemoq';

import { ChromeAdapter } from '../../../../background/browser-adapter';
import { UrlValidator } from '../../../../common/url-validator';

describe('UrlValidatorTest', () => {
    let testSubject: UrlValidator;

    test('isSupportedUrl: http', async () => {
        const url: string = 'http://url';
        testSubject = new UrlValidator();
        const isSupported = await testSubject.isSupportedUrl(url, It.isAny());
        expect(isSupported).toBe(true);
    });

    test('isSupportedUrl: https', async () => {
        const url: string = 'https://url';
        testSubject = new UrlValidator();
        const isSupported = await testSubject.isSupportedUrl(url, It.isAny());
        expect(isSupported).toBe(true);
    });

    test('isSupportedUrl: file', async () => {
        const url: string = 'file://test';
        testSubject = new UrlValidator();
        const browserAdapterMock = Mock.ofType(ChromeAdapter);
        browserAdapterMock
            .setup(b =>
                b.isAllowedFileSchemeAccess(It.is(isFunction)),
            )
            .callback(callback => {
                callback(true);
            })
            .verifiable();

        const isSupported = await testSubject.isSupportedUrl(url, It.isAny());
        expect(isSupported).toBe(true);

        browserAdapterMock.verifyAll();
    });

    test('isNotSupportedUrl: chrome://', async done => {
        const url: string = 'chrome://are/you/ok?';
        testSubject = new UrlValidator();
        const isSupported = await testSubject.isSupportedUrl(url, It.isAny());
        expect(isSupported).toBe(false);
    });

    test('isFileUrl, but have no access, so isNotSupportedUrl', async done => {
        const url: string = 'file://yes/I/am!';
        testSubject = new UrlValidator();
        const browserAdapterMock = Mock.ofType(ChromeAdapter);
        browserAdapterMock
            .setup(b =>
                b.isAllowedFileSchemeAccess(It.is(isFunction)),
            )
            .callback(callback => {
                callback(false);
            })
            .verifiable();

        const isSupported = await testSubject.isSupportedUrl(url, It.isAny());
        expect(isSupported).toBe(false);

        browserAdapterMock.verifyAll();
    });
});
