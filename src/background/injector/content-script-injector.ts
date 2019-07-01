// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PromiseFactory } from '../../common/promises/promise-factory';
import { BrowserAdapter } from '../browser-adapters/browser-adapter';

export class ContentScriptInjector {
    public static readonly jsFiles: string[] = ['bundle/injected.bundle.js'];

    public static readonly cssFiles: string[] = ['injected/styles/default/injected.css', 'bundle/injected.css'];

    public static timeoutInMilliSec = 5e4;

    constructor(private readonly chromeAdapter: BrowserAdapter, private readonly promiseFactory: PromiseFactory) {}

    public injectScripts(tabId: number): Promise<void> {
        const inject = new Promise<null>(resolve => {
            ContentScriptInjector.cssFiles.forEach(file => {
                // we need js to be injected in all frames before we start sending message, but,
                // we do not need to wait for css, since css loading doesn't affect our messaging,
                // hence the null callback here.
                this.chromeAdapter.injectCss(tabId, file, null);
            });

            this.injectJsFiles(tabId, ContentScriptInjector.jsFiles, () => {
                resolve();
            });
        });

        return this.promiseFactory.timeout(inject, ContentScriptInjector.timeoutInMilliSec);
    }

    private injectJsFiles(tabId: number, files: string[], callback: Function): void {
        if (files.length > 0) {
            this.chromeAdapter.injectJs(tabId, files[0], () => {
                this.injectJsFiles(tabId, files.slice(1, files.length), callback);
            });
        } else {
            callback();
        }
    }
}
