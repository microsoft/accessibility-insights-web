// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { Logger } from 'common/logging/logger';
import { PromiseFactory } from 'common/promises/promise-factory';
import { flatten } from 'lodash';

export class ContentScriptInjector {
    public static readonly jsFiles: string[] = ['/bundle/injected.bundle.js'];

    public static readonly cssFiles: string[] = [
        '/injected/styles/default/injected.css',
        '/bundle/injected.css',
    ];

    public static timeoutInMilliSec = 5e4;

    constructor(
        private readonly browserAdapter: BrowserAdapter,
        private readonly promiseFactory: PromiseFactory,
        private readonly logger: Logger,
    ) {}

    public async injectScripts(tabId: number): Promise<void> {
        // We need the JS to be injected before we can continue (ie, before we resolve the promise),
        // because the tab can't receive other messages until that's done, but it's okay for the CSS
        // to keep loading in the background after-the-fact, so it's fire-and-forget.
        this.startInjectingCssFiles(tabId);
        const injectJsPromise = this.injectJsFilesInOrder(tabId);

        await this.promiseFactory.timeout(injectJsPromise, ContentScriptInjector.timeoutInMilliSec);
    }

    private startInjectingCssFiles(tabId: number): void {
        ContentScriptInjector.cssFiles.forEach(file => this.injectCssFile(tabId, file));
    }

    private injectJsFilesInOrder(tabId: number): Promise<any[]> {
        const files = ContentScriptInjector.jsFiles;
        return Promise.all(files.map(file => this.injectJsFile(tabId, file))).then(results =>
            flatten(results),
        );
    }

    private injectJsFile(tabId: number, file: string): Promise<any[]> {
        return this.browserAdapter
            .executeScriptInTab(tabId, {
                allFrames: true,
                file,
                runAt: 'document_start',
            })
            .catch(e => this.logAndRethrow(e, tabId, file));
    }

    private injectCssFile(tabId: number, file: string): Promise<void> {
        return this.browserAdapter
            .insertCSSInTab(tabId, {
                allFrames: true,
                file,
            })
            .catch(e => this.logAndSuppress(e, tabId, file));
    }

    private logAndSuppress(e: any, tabId: number, file: string): void {
        this.logger.error(`[tab-${tabId}] error injecting ${file}: ${e}`, e);
    }

    private logAndRethrow(e: any, tabId: number, file: string): never {
        this.logAndSuppress(e, tabId, file);
        throw e;
    }
}
