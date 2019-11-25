// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { PromiseFactory } from 'common/promises/promise-factory';
import { flatten } from 'lodash';

export class ContentScriptInjector {
    public static readonly jsFiles: string[] = ['bundle/injected.bundle.js'];

    public static readonly cssFiles: string[] = [
        'injected/styles/default/injected.css',
        'bundle/injected.css',
    ];

    public static timeoutInMilliSec = 5e4;

    constructor(
        private readonly browserAdapter: BrowserAdapter,
        private readonly promiseFactory: PromiseFactory,
    ) {}

    public injectScripts(tabId: number): Promise<void> {
        // We need the JS to be injected before we can continue (ie, before we resolve the promise),
        // because the tab can't receive other messages until that's done, but it's okay for the CSS
        // to keep loading in the background after-the-fact, so it's fire-and-forget.
        this.injectCssFilesConcurrently(tabId);
        const inject = Promise.all([this.injectJsFilesInOrder(tabId)]).then(() =>
            Promise.resolve(),
        );

        return this.promiseFactory.timeout(inject, ContentScriptInjector.timeoutInMilliSec);
    }

    private injectCssFilesConcurrently(tabId: number): void {
        ContentScriptInjector.cssFiles.forEach(file => this.injectCssFile(tabId, file));
    }

    private injectJsFilesInOrder(tabId: number): Promise<any[]> {
        const files = ContentScriptInjector.jsFiles;
        return Promise.all(files.map(file => this.injectJsFile(tabId, file))).then(results =>
            flatten(results),
        );
    }

    private injectJsFile(tabId: number, file: string): Promise<any[]> {
        return this.browserAdapter.executeScriptInTab(tabId, {
            allFrames: true,
            file,
            runAt: 'document_start',
        });
    }

    private injectCssFile(tabId: number, file: string): Promise<void> {
        return this.browserAdapter.insertCSSInTab(tabId, {
            allFrames: true,
            file,
        });
    }
}
