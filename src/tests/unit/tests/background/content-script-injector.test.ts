// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Q from 'q';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { BrowserAdapter } from '../../../../background/browser-adapters/browser-adapter';
import { ContentScriptInjector } from '../../../../background/injector/content-script-injector';
import { PromiseFactory } from '../../../../common/promises/promise-factory';
import { QStub } from '../../stubs/q-stub';

describe('ContentScriptInjectorTest', () => {
    let browserAdapterMock: IMock<BrowserAdapter>;
    let qMock: IMock<typeof Q>;
    let promiseFactoryMock: IMock<PromiseFactory>;

    let testSubject: ContentScriptInjector;

    beforeEach(() => {
        browserAdapterMock = Mock.ofType<BrowserAdapter>();

        promiseFactoryMock = Mock.ofType<PromiseFactory>();
        qMock = Mock.ofType(QStub, MockBehavior.Strict) as any;

        qMock.setup(x => x.defer()).returns(() => Q.defer());
    });

    it('test inject content scripts', async done => {
        const tabId = 2;

        let jsLoadCallback: Function;
        testSubject = new ContentScriptInjector(browserAdapterMock.object, Q, promiseFactoryMock.object);

        ContentScriptInjector.cssFiles.forEach(cssFile => {
            browserAdapterMock.setup(x => x.injectCss(tabId, cssFile, null)).verifiable(Times.once());
        });

        ContentScriptInjector.jsFiles.forEach(jsFile => {
            browserAdapterMock
                .setup(x => x.injectJs(tabId, jsFile, It.isAny()))
                .callback((theTabId, theJsFile, callback) => {
                    jsLoadCallback = callback;
                })
                .verifiable(Times.once());
        });

        const promise = testSubject.injectScripts(tabId);

        promise.then(() => {
            browserAdapterMock.verifyAll();
            done();
        });
        expect(Q.isPending(promise)).toBeTruthy();
        for (let i = 0; i < ContentScriptInjector.jsFiles.length; i++) {
            jsLoadCallback();
        }
    });

    it('test inject content scripts timeout', async done => {
        const tabId = 2;
        testSubject = new ContentScriptInjector(browserAdapterMock.object, qMock.object, promiseFactoryMock.object);

        ContentScriptInjector.cssFiles.forEach(cssFile => {
            browserAdapterMock.setup(x => x.injectCss(tabId, cssFile, null)).verifiable(Times.once());
        });

        browserAdapterMock.setup(x => x.injectJs(tabId, ContentScriptInjector.jsFiles[0], It.isAny())).verifiable(Times.once());

        const timeoutDeferred = Q.defer();
        qMock
            .setup(x => x.timeout(It.isAny(), ContentScriptInjector.timeoutInMilliSec))
            .returns(() => timeoutDeferred.promise)
            .verifiable();

        const promise = testSubject.injectScripts(tabId);

        promise.then(null, () => {
            browserAdapterMock.verifyAll();
            done();
        });
        qMock.verifyAll();
        expect(promise).toEqual(timeoutDeferred.promise);
        expect(Q.isPending(promise)).toBeTruthy();
        timeoutDeferred.reject(null);
    });
});
