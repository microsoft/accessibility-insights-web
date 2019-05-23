// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Q from 'q';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { BrowserAdapter } from '../../../../background/browser-adapters/browser-adapter';
import { ContentScriptInjector } from '../../../../background/injector/content-script-injector';
import { QStub } from '../../stubs/q-stub';

let mockBrowserAdpater: IMock<BrowserAdapter>;
let mockQ: IMock<typeof Q>;
let testSubject: ContentScriptInjector;

describe('ContentScriptInjectorTest', () => {
    beforeEach(() => {
        mockBrowserAdpater = Mock.ofType<BrowserAdapter>();
        mockQ = Mock.ofType(QStub, MockBehavior.Strict) as any;

        mockQ.setup(x => x.defer()).returns(() => Q.defer());
    });

    it('test inject content scripts', async done => {
        const tabId = 2;

        let jsLoadCallback: Function;
        testSubject = new ContentScriptInjector(mockBrowserAdpater.object, Q);

        ContentScriptInjector.cssFiles.forEach(cssFile => {
            mockBrowserAdpater.setup(x => x.injectCss(tabId, cssFile, null)).verifiable(Times.once());
        });

        ContentScriptInjector.jsFiles.forEach(jsFile => {
            mockBrowserAdpater
                .setup(x => x.injectJs(tabId, jsFile, It.isAny()))
                .callback((theTabId, theJsFile, callback) => {
                    jsLoadCallback = callback;
                })
                .verifiable(Times.once());
        });

        const promise = testSubject.injectScripts(tabId);

        promise.then(() => {
            mockBrowserAdpater.verifyAll();
            done();
        });
        expect(Q.isPending(promise)).toBeTruthy();
        for (let i = 0; i < ContentScriptInjector.jsFiles.length; i++) {
            jsLoadCallback();
        }
    });

    it('test inject content scripts timeout', async done => {
        const tabId = 2;
        testSubject = new ContentScriptInjector(mockBrowserAdpater.object, mockQ.object);

        ContentScriptInjector.cssFiles.forEach(cssFile => {
            mockBrowserAdpater.setup(x => x.injectCss(tabId, cssFile, null)).verifiable(Times.once());
        });

        mockBrowserAdpater.setup(x => x.injectJs(tabId, ContentScriptInjector.jsFiles[0], It.isAny())).verifiable(Times.once());

        const timeoutDeferred = Q.defer();
        mockQ
            .setup(x => x.timeout(It.isAny(), ContentScriptInjector.timeoutInMilliSec))
            .returns(() => timeoutDeferred.promise)
            .verifiable();

        const promise = testSubject.injectScripts(tabId);

        promise.then(null, () => {
            mockBrowserAdpater.verifyAll();
            done();
        });
        mockQ.verifyAll();
        expect(promise).toEqual(timeoutDeferred.promise);
        expect(Q.isPending(promise)).toBeTruthy();
        timeoutDeferred.reject(null);
    });
});
