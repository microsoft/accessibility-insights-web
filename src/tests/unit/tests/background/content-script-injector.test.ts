// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ContentScriptInjector } from 'background/injector/content-script-injector';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { Logger } from 'common/logging/logger';
import { PromiseFactory } from 'common/promises/promise-factory';
import { IMock, It, Mock, Times } from 'typemoq';
import { ExtensionTypes } from 'webextension-polyfill-ts';

describe('ContentScriptInjector', () => {
    const testTabId = 1;
    let browserAdapterMock: IMock<BrowserAdapter>;
    let promiseFactoryMock: IMock<PromiseFactory>;
    let loggerMock: IMock<Logger>;

    let testSubject: ContentScriptInjector;

    beforeEach(() => {
        browserAdapterMock = Mock.ofType<BrowserAdapter>();
        promiseFactoryMock = Mock.ofType<PromiseFactory>();
        loggerMock = Mock.ofType<Logger>();

        testSubject = new ContentScriptInjector(
            browserAdapterMock.object,
            promiseFactoryMock.object,
            loggerMock.object,
        );
    });

    describe('timeout behavior', () => {
        beforeEach(() => {
            setupExecuteScriptToSucceedImmediately();
            setupInsertCSSToSucceedImmediately();
        });

        it('uses a timeout promise with the expected timeout constant', async () => {
            promiseFactoryMock
                .setup(factory =>
                    factory.timeout(It.isAny(), ContentScriptInjector.timeoutInMilliSec),
                )
                .returns(() => Promise.resolve({}))
                .verifiable(Times.once());

            await testSubject.injectScripts(testTabId);

            promiseFactoryMock.verifyAll();
        });

        it('rejects if a timeout occurs', async () => {
            const timeoutError = new Error('artificial timeout');

            promiseFactoryMock
                .setup(factory => factory.timeout(It.isAny(), It.isAny()))
                .returns(() => Promise.reject(timeoutError));

            await expect(testSubject.injectScripts(testTabId)).rejects.toThrowError(timeoutError);
        });
    });

    describe('when no timeout occurs', () => {
        beforeEach(() => {
            promiseFactoryMock
                .setup(factory => factory.timeout(It.isAny(), It.isAny()))
                .returns(originalPromise => originalPromise);
        });

        it('injects each CSS file once with the expected parameters', async () => {
            setupExecuteScriptToSucceedImmediately();

            ContentScriptInjector.cssFiles.forEach(cssFile => {
                const expectedDetails = { allFrames: true, file: cssFile };
                browserAdapterMock
                    .setup(adapter => adapter.insertCSSInTab(testTabId, expectedDetails))
                    .returns(() => Promise.resolve());
            });

            await testSubject.injectScripts(testTabId);

            browserAdapterMock.verifyAll();
        });

        it('injects each JS file once with the expected parameters', async () => {
            setupInsertCSSToSucceedImmediately();

            ContentScriptInjector.jsFiles.forEach(jsFile => {
                const expectedDetails: ExtensionTypes.InjectDetails = {
                    allFrames: true,
                    file: jsFile,
                    runAt: 'document_start',
                };
                browserAdapterMock
                    .setup(adapter => adapter.executeScriptInTab(testTabId, expectedDetails))
                    .returns(() => Promise.resolve([]));
            });

            await testSubject.injectScripts(testTabId);

            browserAdapterMock.verifyAll();
        });

        it('resolves only after JS files have finished injecting', async () => {
            setupInsertCSSToSucceedImmediately();

            let resolvable: Function;

            // simulate JS injection taking a while,
            // only completing asynchronously when we explicitly invoke the resolve function from the returned promise
            browserAdapterMock
                .setup(adapter =>
                    adapter.executeScriptInTab(
                        It.isAny(),
                        It.isObjectWith({ file: ContentScriptInjector.jsFiles[0] }),
                    ),
                )
                .returns(
                    () =>
                        new Promise(resolve => {
                            resolvable = resolve;
                        }),
                );

            let returnedPromiseCompleted = false;
            const returnedPromise = testSubject.injectScripts(testTabId).then(() => {
                returnedPromiseCompleted = true;
            });

            expect(returnedPromiseCompleted).toBe(false);

            resolvable(); // simulate JS injection finishing
            await returnedPromise;

            expect(returnedPromiseCompleted).toBe(true);
        });

        it('does not wait for CSS files to be injected before resolving', async () => {
            setupExecuteScriptToSucceedImmediately();
            setupInsertCSSToNeverComplete();

            await testSubject.injectScripts(testTabId);

            // expect to not timeout
        });

        it('logs and rethrows if script injection throws an error', async () => {
            const errorFromBrowser = new Error('from browserAdapterMock');

            setupInsertCSSToSucceedImmediately();

            browserAdapterMock
                .setup(adapter => adapter.executeScriptInTab(It.isAny(), It.isAny()))
                .returns(() => Promise.reject(errorFromBrowser));

            loggerMock.setup(m => m.error('expected messsage'));

            await expect(testSubject.injectScripts(testTabId)).rejects.toThrowError(
                errorFromBrowser,
            );

            for (const file of ContentScriptInjector.jsFiles) {
                loggerMock.verify(
                    m =>
                        m.error(
                            It.is(s => s.includes(testTabId) && s.includes(file)),
                            errorFromBrowser,
                        ),
                    Times.once(),
                );
            }
        });

        it('logs and does not rethrow if CSS injection throws an error', async () => {
            const errorFromBrowser = new Error('from browserAdapterMock');

            setupExecuteScriptToSucceedImmediately();

            browserAdapterMock
                .setup(adapter => adapter.insertCSSInTab(It.isAny(), It.isAny()))
                .returns(() => Promise.reject(errorFromBrowser));

            await testSubject.injectScripts(testTabId); // should complete without throwing

            for (const file of ContentScriptInjector.cssFiles) {
                loggerMock.verify(
                    m =>
                        m.error(
                            It.is(s => s.includes(testTabId) && s.includes(file)),
                            errorFromBrowser,
                        ),
                    Times.once(),
                );
            }
        });
    });

    function setupInsertCSSToSucceedImmediately(): void {
        browserAdapterMock
            .setup(adapter => adapter.insertCSSInTab(It.isAny(), It.isAny()))
            .returns(() => Promise.resolve());
    }

    function setupInsertCSSToNeverComplete(): void {
        browserAdapterMock
            .setup(adapter => adapter.insertCSSInTab(It.isAny(), It.isAny()))
            .returns(() => new Promise(() => {})); // promise never resolves or rejects
    }

    function setupExecuteScriptToSucceedImmediately(): void {
        browserAdapterMock
            .setup(adapter => adapter.executeScriptInTab(It.isAny(), It.isAny()))
            .returns(() => Promise.resolve([]));
    }
});
