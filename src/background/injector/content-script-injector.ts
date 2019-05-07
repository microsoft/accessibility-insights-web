// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Q from 'q';

import { BrowserAdapter } from '../browser-adapters/browser-adapter';

export class ContentScriptInjector {
    public static readonly jsFiles: string[] = ['bundle/injected.bundle.js'];

    public static readonly cssFiles: string[] = ['injected/styles/default/injected.css'];

    public static timeoutInMilliSec = 5e4;
    private readonly _chromeAdapter: BrowserAdapter;
    private readonly _q: typeof Q;

    constructor(chromeAdapter: BrowserAdapter, q: typeof Q) {
        this._chromeAdapter = chromeAdapter;
        this._q = q;
    }

    public injectScripts(tabId: number): Q.IPromise<null> {
        const deferred = this._q.defer<null>();

        ContentScriptInjector.cssFiles.forEach(file => {
            this._chromeAdapter.injectCss(tabId, file, null);
        });

        this.injectJsFiles(tabId, ContentScriptInjector.jsFiles, () => {
            deferred.resolve(null);
        });

        return this._q.timeout(deferred.promise, ContentScriptInjector.timeoutInMilliSec);
    }

    private injectJsFiles(tabId: number, files: string[], callback: Function): void {
        if (files.length > 0) {
            this._chromeAdapter.injectJs(tabId, files[0], () => {
                this.injectJsFiles(tabId, files.slice(1, files.length), callback);
            });
        } else {
            callback();
        }
    }
}
