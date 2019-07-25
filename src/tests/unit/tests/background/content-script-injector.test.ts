// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isFunction, range } from 'lodash';
import { IMock, It, Mock, Times } from 'typemoq';

import { ContentScriptInjector } from '../../../../background/injector/content-script-injector';
import { BrowserAdapter } from '../../../../common/browser-adapters/browser-adapter';
import { PromiseFactory } from '../../../../common/promises/promise-factory';

describe('ContentScriptInjector', () => {
    const testTabId = 1;
    const resolveCallbackImmediately = (tabId, details, callback) => {
        if (callback) {
            callback();
        }
    };
    let browserAdapterMock: IMock<BrowserAdapter>;
    let promiseFactoryMock: IMock<PromiseFactory>;

    let testSubject: ContentScriptInjector;

    beforeEach(() => {
        browserAdapterMock = Mock.ofType<BrowserAdapter>();

        promiseFactoryMock = Mock.ofType<PromiseFactory>();

        testSubject = new ContentScriptInjector(browserAdapterMock.object, promiseFactoryMock.object);
    });

    it('uses a timeout promise the expected timeout constant', async () => {
        promiseFactoryMock
            .setup(factory => factory.timeout(It.isAny(), ContentScriptInjector.timeoutInMilliSec))
            .returns(() => Promise.resolve())
            .verifiable(Times.once());

        await testSubject.injectScripts(testTabId);

        promiseFactoryMock.verifyAll();
    });

    it('rejects if a timeout occurs', async () => {
        promiseFactoryMock.setup(factory => factory.timeout(It.isAny(), It.isAny())).returns(() => Promise.reject('artificial timeout'));

        await expect(testSubject.injectScripts(testTabId)).rejects.toBe('artificial timeout');
    });

    describe('when no timeout occurs', () => {
        beforeEach(() => {
            promiseFactoryMock.setup(factory => factory.timeout(It.isAny(), It.isAny())).returns(originalPromise => originalPromise);
        });

        it('injects each CSS file once with the expected parameters', async () => {
            ContentScriptInjector.cssFiles.forEach(cssFile =>
                browserAdapterMock
                    .setup(adapter => adapter.insertCSSInTab(testTabId, { allFrames: true, file: cssFile }, It.isAny()))
                    .verifiable(Times.once()),
            );

            browserAdapterMock
                .setup(adapter => adapter.executeScriptInTab(It.isAny(), It.isAny(), It.isAny()))
                .callback(resolveCallbackImmediately);

            await testSubject.injectScripts(testTabId);

            browserAdapterMock.verifyAll();
        });

        it('injects each JS file once with the expected parameters', async () => {
            ContentScriptInjector.jsFiles.forEach(jsFile =>
                browserAdapterMock
                    .setup(adapter =>
                        adapter.executeScriptInTab(testTabId, { allFrames: true, file: jsFile, runAt: 'document_start' }, It.isAny()),
                    )
                    .callback(resolveCallbackImmediately)
                    .verifiable(Times.once()),
            );

            await testSubject.injectScripts(testTabId);

            browserAdapterMock.verifyAll();
        });

        it('resolves only after JS files have finished injecting', async () => {
            let callbackPassedToExecuteScript: Function;

            // simulate JS injection taking a while, only completing asynchronously when we explicitly invoke the callback
            browserAdapterMock
                .setup(adapter =>
                    adapter.executeScriptInTab(It.isAny(), It.isObjectWith({ file: ContentScriptInjector.jsFiles[0] }), It.isAny()),
                )
                .callback((tabId, details, passedCallback) => {
                    callbackPassedToExecuteScript = passedCallback;
                });

            let returnedPromiseCompleted = false;
            const returnedPromise = testSubject.injectScripts(testTabId).then(() => {
                returnedPromiseCompleted = true;
            });

            expect(callbackPassedToExecuteScript).toBeDefined();
            expect(returnedPromiseCompleted).toBe(false);

            callbackPassedToExecuteScript(); // simulate JS injection finishing
            await returnedPromise;

            expect(returnedPromiseCompleted).toBe(true);
        });

        it('does not wait for CSS files to be injected before resolving', async () => {
            // simulate JS injection immediately succeeding
            browserAdapterMock
                .setup(adapter => adapter.executeScriptInTab(It.isAny(), It.isAny(), It.isAny()))
                .callback(resolveCallbackImmediately);

            // simulate CSS injection never completing (by not setting it up with any callback)

            await testSubject.injectScripts(testTabId);

            // expect to not timeout
        });
    });
});
