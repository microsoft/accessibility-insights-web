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

    public injectScriptsP(tabId: number): Promise<void> {
        this.injectCssFilesConcurrentlyP(tabId);
        const inject = Promise.all([this.injectJsFilesInOrderP(tabId)]).then(() => Promise.resolve());

        return this.promiseFactory.timeout(inject, ContentScriptInjector.timeoutInMilliSec);
    }

    private injectCssFilesConcurrentlyP(tabId: number): void {
        ContentScriptInjector.cssFiles.forEach(file => this.injectCssFileP(tabId, file));
    }

    private injectJsFilesInOrderP(tabId: number): Promise<any[]> {
        const files = ContentScriptInjector.jsFiles;
        return Promise.all(files.map(file => this.injectJsFileP(tabId, file))).then(results => flatten(results));
    }

    private injectJsFileP(tabId: number, file: string): Promise<any[]> {
        return this.browserAdapter.executeScriptInTabP(tabId, {
            allFrames: true,
            file,
            runAt: 'document_start',
        });
    }

    private injectCssFileP(tabId: number, file: string): Promise<void> {
        return this.browserAdapter.insertCSSInTabP(tabId, {
            allFrames: true,
            file,
        });
    }
}
