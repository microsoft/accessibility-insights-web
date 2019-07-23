// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isFunction } from 'lodash';
import { IMock, It, Mock, Times } from 'typemoq';

import { BrowserAdapter } from '../../../../common/browser-adapters/browser-adapter';
import { ContentScriptInjector } from '../../../../background/injector/content-script-injector';
import { PromiseFactory } from '../../../../common/promises/promise-factory';

describe('ContentScriptInjectorTest', () => {
    let browserAdapterMock: IMock<BrowserAdapter>;
    let promiseFactoryMock: IMock<PromiseFactory>;

    let testSubject: ContentScriptInjector;

    beforeEach(() => {
        browserAdapterMock = Mock.ofType<BrowserAdapter>();

        promiseFactoryMock = Mock.ofType<PromiseFactory>();

        testSubject = new ContentScriptInjector(browserAdapterMock.object, promiseFactoryMock.object);
    });

    it('injects content scripts', () => {
        expect.assertions(1);

        const tabId = -1;

        promiseFactoryMock
            .setup(factory => factory.timeout(It.is(promise => promise instanceof Promise), ContentScriptInjector.timeoutInMilliSec))
            .returns((promise, delay) => promise);

        ContentScriptInjector.cssFiles.forEach(cssFile =>
            browserAdapterMock.setup(adapter => adapter.injectCss(tabId, cssFile, null)).verifiable(Times.once()),
        );

        ContentScriptInjector.jsFiles.forEach(jsFile => {
            browserAdapterMock
                .setup(adapter => adapter.injectJs(tabId, jsFile, It.is(isFunction)))
                .callback((theTabId, theJsFile, callback) => callback())
                .verifiable(Times.once());
        });

        const injected = testSubject.injectScripts(tabId);

        return expect(injected).resolves.toBeUndefined();
    });
});
