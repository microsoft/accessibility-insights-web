// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Q from 'q';

import { InjectorAdapter } from '../browser-adapters/injector-adapter';

export class ContentScriptInjector {
    public static readonly jsFiles: string[] = ['bundle/injected.bundle.js'];

    public static readonly cssFiles: string[] = ['injected/styles/default/injected.css'];

    public static timeoutInMilliSec = 5e4;

    constructor(private readonly injectorAdapter: InjectorAdapter, private readonly q: typeof Q) {}

    public injectScripts(tabId: number): Q.IPromise<null> {
        const deferred = this.q.defer<null>();

        ContentScriptInjector.cssFiles.forEach(file => {
            this.injectorAdapter.injectCss(tabId, file, null);
        });

        this.injectJsFiles(tabId, ContentScriptInjector.jsFiles, () => {
            deferred.resolve(null);
        });

        return this.q.timeout(deferred.promise, ContentScriptInjector.timeoutInMilliSec);
    }

    private injectJsFiles(tabId: number, files: string[], callback: Function): void {
        if (files.length > 0) {
            this.injectorAdapter.injectJs(tabId, files[0], () => {
                this.injectJsFiles(tabId, files.slice(1, files.length), callback);
            });
        } else {
            callback();
        }
    }
}
