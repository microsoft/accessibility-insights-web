// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Puppeteer from 'puppeteer';

import { forceTestFailure } from './force-test-failure';
import { Page } from './page';

export interface NewPopupPageOptions {
    suppressFirstTimeTelemetryDialog: boolean;
}

export class Browser {
    private memorizedBackgroundPage: Page;

    constructor(
        private readonly underlyingBrowser: Puppeteer.Browser,
    ) {
        underlyingBrowser.on('disconnected', onBrowserDisconnected);
    }

    public async stop() {
        this.underlyingBrowser.removeListener('disconnected', onBrowserDisconnected);
        await this.underlyingBrowser.close();
    }

    public async newPage(url: string): Promise<Page> {
        const underlyingPage = await this.underlyingBrowser.newPage();
        const page = new Page(underlyingPage);
        await page.goto(url);
        return page;
    }

    public async newExtensionPage(relativePath: string): Promise<Page> {
        const url = await this.getExtensionUrl(relativePath);
        return await this.newPage(url);
    }

    public async newExtensionPopupPage(targetTabId: number): Promise<Page> {
        return await this.newExtensionPage(`popup/popup.html?tabId=${targetTabId}`);
    }

    public async closeAllPages() {
        const pages = await this.underlyingBrowser.pages();
        await Promise.all(pages.map(page => page.close()));
    }

    public async getActivePageTabId(): Promise<number> {
        const backgroundPage = await this.waitForExtensionBackgroundPage();
        return await backgroundPage.evaluate(() => {
            return new Promise(resolve => {
                chrome.tabs.query({ active: true, currentWindow: true }, tabs => resolve(tabs[0].id));
            });
        });
    }

    public async waitForPageMatchingUrl(urlMatchFn: (url: string) => boolean): Promise<Page> {
        const underlyingTarget = await this.underlyingBrowser.waitForTarget(t => urlMatchFn(t.url()));
        const underlyingPage = await underlyingTarget.page();
        return new Page(underlyingPage);
    }

    private async getExtensionUrl(relativePath: string): Promise<string> {
        const backgroundPage = await this.waitForExtensionBackgroundPage();
        const pageUrl = backgroundPage.url();

        // pageUrl.origin would be correct here, but it doesn't get populated correctly in all node.js versions we build
        return `${pageUrl.protocol}//${pageUrl.host}/${relativePath}`;
    }

    private async waitForExtensionBackgroundPage(): Promise<Page> {
        if (this.memorizedBackgroundPage) {
            return this.memorizedBackgroundPage;
        }

        const backgroundPageTarget = await this.underlyingBrowser
            .waitForTarget(t => t.type() === 'background_page' && new URL(t.url()).pathname === '/background/background.html');

        this.memorizedBackgroundPage = new Page(await backgroundPageTarget.page());

        return this.memorizedBackgroundPage;
    }
}

function onBrowserDisconnected() {
    const errorMessage =
        `Browser disconnected unexpectedly; test results past this point should not be trusted. This probably means that either:
            - BrowserController's browser instance was .close() or .disconnect()ed without going through BrowserController.tearDown()
            - Chromium crashed (this is most commonly an out-of-memory issue)`;

    // This is best-effort - in many/most cases, a disconnected browser will cause an async puppeteer operation in
    // progress to fail (causing a test failure with a less useful error message) before this handler gets called.
    forceTestFailure(errorMessage);
}
