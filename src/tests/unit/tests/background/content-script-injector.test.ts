// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Q from 'q';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { InjectorAdapter } from '../../../../background/browser-adapters/injector-adapter';
import { ContentScriptInjector } from '../../../../background/injector/content-script-injector';
import { QStub } from '../../stubs/q-stub';

describe('ContentScriptInjectorTest', () => {
    let injectorAdapterMock: IMock<InjectorAdapter>;
    let qMock: IMock<typeof Q>;
    let testSubject: ContentScriptInjector;

    beforeEach(() => {
        injectorAdapterMock = Mock.ofType<InjectorAdapter>();
        qMock = Mock.ofType(QStub, MockBehavior.Strict) as any;

        qMock.setup(q => q.defer()).returns(() => Q.defer());
    });

    it('test inject content scripts', async done => {
        const tabId = 2;

        let jsLoadCallback: Function;
        testSubject = new ContentScriptInjector(injectorAdapterMock.object, Q);

        ContentScriptInjector.cssFiles.forEach(cssFile => {
            injectorAdapterMock.setup(adapter => adapter.injectCss(tabId, cssFile, null)).verifiable(Times.once());
        });

        ContentScriptInjector.jsFiles.forEach(jsFile => {
            injectorAdapterMock
                .setup(adapter => adapter.injectJs(tabId, jsFile, It.isAny()))
                .callback((theTabId, theJsFile, callback) => {
                    jsLoadCallback = callback;
                })
                .verifiable(Times.once());
        });

        const promise = testSubject.injectScripts(tabId);

        promise.then(() => {
            injectorAdapterMock.verifyAll();
            done();
        });
        expect(Q.isPending(promise)).toBeTruthy();
        for (let i = 0; i < ContentScriptInjector.jsFiles.length; i++) {
            jsLoadCallback();
        }
    });

    it('test inject content scripts timeout', async done => {
        const tabId = 2;
        testSubject = new ContentScriptInjector(injectorAdapterMock.object, qMock.object);

        ContentScriptInjector.cssFiles.forEach(cssFile => {
            injectorAdapterMock.setup(adapter => adapter.injectCss(tabId, cssFile, null)).verifiable(Times.once());
        });

        injectorAdapterMock
            .setup(adapter => adapter.injectJs(tabId, ContentScriptInjector.jsFiles[0], It.isAny()))
            .verifiable(Times.once());

        const timeoutDeferred = Q.defer();
        qMock
            .setup(q => q.timeout(It.isAny(), ContentScriptInjector.timeoutInMilliSec))
            .returns(() => timeoutDeferred.promise)
            .verifiable();

        const promise = testSubject.injectScripts(tabId);

        promise.then(null, () => {
            injectorAdapterMock.verifyAll();
            done();
        });

        qMock.verifyAll();
        expect(promise).toEqual(timeoutDeferred.promise);
        expect(Q.isPending(promise)).toBeTruthy();
        timeoutDeferred.reject(null);
    });
});
