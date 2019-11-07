// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { PromiseFactory } from 'common/promises/promise-factory';
import { flatten } from 'lodash';

export class ContentScriptInjector {
    public static readonly jsFiles: string[] = ['bundle/injected.bundle.js'];

    public static readonly cssFiles: string[] = ['injected/styles/default/injected.css', 'bundle/injected.css'];

    public static timeoutInMilliSec = 5e4;

    constructor(private readonly browserAdapter: BrowserAdapter, private readonly promiseFactory: PromiseFactory) {}

    public injectScripts(tabId: number): Promise<void> {
        const inject = new Promise<null>(resolve => {
            // We need the JS to be injected before we can continue (ie, before we resolve the promise),
            // because the tab can't receive other messages until that's done, but it's okay for the CSS
            // to keep loading in the background after-the-fact, so it's fire-and-forget.
            this.injectCssFilesConcurrently(tabId, ContentScriptInjector.cssFiles);
            this.injectJsFilesInOrder(tabId, ContentScriptInjector.jsFiles, resolve);
        });

        return this.promiseFactory.timeout(inject, ContentScriptInjector.timeoutInMilliSec);
    }

    public injectScriptsP(tabId: number): Promise<void> {
        this.injectCssFilesConcurrentlyP(tabId);
        const inject = Promise.all([this.injectJsFilesInOrderP(tabId)]).then(() => Promise.resolve());

        return this.promiseFactory.timeout(inject, ContentScriptInjector.timeoutInMilliSec);
    }

    private injectCssFilesConcurrently(tabId: number, files: string[]): void {
        ContentScriptInjector.cssFiles.forEach(file => {
            this.injectCssFile(tabId, file);
        });
    }

    private injectCssFilesConcurrentlyP(tabId: number): void {
        ContentScriptInjector.cssFiles.forEach(file => this.injectCssFileP(tabId, file));
        // return Promise.all(ContentScriptInjector.cssFiles.map(file => this.injectCssFileP(tabId, file))).then(() => Promise.resolve());
    }

    private injectJsFilesInOrder(tabId: number, files: string[], callback: Function): void {
        if (files.length > 0) {
            this.injectJsFile(tabId, files[0], () => {
                this.injectJsFilesInOrder(tabId, files.slice(1, files.length), callback);
            });
        } else {
            callback();
        }
    }

    private injectJsFilesInOrderP(tabId: number): Promise<any[]> {
        const files = ContentScriptInjector.jsFiles;
        return Promise.all(files.map(file => this.injectJsFileP(tabId, file))).then(results => flatten(results));
    }

    private injectJsFile(tabId: number, file: string, callback?: (result: any[]) => void): void {
        this.browserAdapter.executeScriptInTab(
            tabId,
            {
                allFrames: true,
                file: file,
                runAt: 'document_start',
            },
            callback,
        );
    }

    private injectJsFileP(tabId: number, file: string): Promise<any[]> {
        return this.browserAdapter.executeScriptInTabP(tabId, {
            allFrames: true,
            file,
            runAt: 'document_start',
        });
    }

    private injectCssFile(tabId: number, file: string): void {
        this.browserAdapter.insertCSSInTab(tabId, {
            allFrames: true,
            file: file,
        });
    }

    private injectCssFileP(tabId: number, file: string): Promise<void> {
        return this.browserAdapter.insertCSSInTabP(tabId, {
            allFrames: true,
            file,
        });
    }
}
