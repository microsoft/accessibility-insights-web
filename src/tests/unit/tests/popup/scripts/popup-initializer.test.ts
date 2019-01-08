// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isFunction } from 'lodash';
import * as Q from 'q';
import { It, Mock } from 'typemoq';

import { ChromeAdapter } from '../../../../../background/browser-adapter';
import { ITab } from '../../../../../common/itab';
import { UrlValidator } from '../../../../../common/url-validator';
import { PopupInitializer } from '../../../../../popup/scripts/popup-initializer';

describe('PopupInitializerTests', () => {
    test('initializePopup', async done => {
        const tabStub: ITab = {
            id: 1,
            url: 'url',
        };
        const tabs: ITab[] = [tabStub];
        const browserAdapterMock = Mock.ofType(ChromeAdapter);
        const urlValidatorMock = Mock.ofType(UrlValidator);

        browserAdapterMock
            .setup(b => b.tabsQuery(
                It.isValue({
                    active: true,
                    currentWindow: true,
                }), It.is(isFunction)))
            .returns((query, callback) => {
                callback(tabs);
            })
            .verifiable();

        urlValidatorMock
            .setup(uV => uV.isSupportedUrl(tabStub.url, browserAdapterMock.object))
            .returns(hasAccess => {
                const deferred = Q.defer<boolean>();
                deferred.resolve(true);
                return deferred.promise;
            })
            .verifiable();

        const initializePopupMock = Mock.ofInstance(result => { });
        initializePopupMock.setup(i => i(It.isAny())).verifiable();
        const testOubject: PopupInitializer = new PopupInitializer(browserAdapterMock.object, urlValidatorMock.object);
        (testOubject as any).initializePopup = initializePopupMock.object;

        const promise = testOubject.initialize();
        promise.then(result => {
            urlValidatorMock.verifyAll();
            initializePopupMock.verifyAll();
            browserAdapterMock.verifyAll();
            done();
        });
    });
});

