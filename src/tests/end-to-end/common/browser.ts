// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Puppeteer from 'puppeteer';

import { forceTestFailure } from './force-test-failure';
import { Page } from './page';
import { getTestResourceUrl } from './test-resources';

export class Browser {
    private memoizedBackgroundPage: Page;
    private pages: Array<Page> = [];

    constructor(
        private readonly underlyingBrowser: Puppeteer.Browser,
    ) {
        underlyingBrowser.on('disconnected', onBrowserDisconnected);
    }

    public async close(): Promise<void> {
        this.underlyingBrowser.removeListener('disconnected', onBrowserDisconnected);
        await this.underlyingBrowser.close();
    }

    public async newPage(url: string): Promise<Page> {
        const underlyingPage = await this.underlyingBrowser.newPage();
        const page = new Page(underlyingPage);
        await page.goto(url);
        this.pages.push(page);
        return page;
    }

    public async newExtensionPage(relativePath: string): Promise<Page> {
        const url = await this.getExtensionUrl(relativePath);
        return await this.newPage(url);
    }

    public async newTestResourcePage(relativePath: string): Promise<Page> {
        const url = getTestResourceUrl(relativePath);
        return await this.newPage(url);
    }

    public async newExtensionPopupPage(targetTabId: number): Promise<Page> {
        return await this.newPage(await this.getPopupPageUrl(targetTabId));
    }

    public async newExtensionDetailsViewPage(targetTabId: number): Promise<Page> {
        return await this.newPage(await this.getDetailsViewPageUrl(targetTabId));
    }

    public async getPopupPageUrl(targetTabId: number): Promise<string> {
        return await this.getExtensionUrl(`popup/popup.html?tabId=${targetTabId}`);
    }

    public async getDetailsViewPageUrl(targetTabId: number): Promise<string> {
        return this.getExtensionUrl(`detailsView/detailsView.html?tabId=${targetTabId}`);
    }

    public async closeAllPages(): Promise<void> {
        for (let pos = 0; pos < this.pages.length; pos++) {
            await this.pages[pos].close(true);
        }
    }

    public async getLastOpenPage(): Promise<Page> {
        const targets = await this.underlyingBrowser.targets();
        const puppeteerPage = await targets[targets.length - 1].page();
        return new Page(puppeteerPage);
    }

    public async getActivePageTabId(): Promise<number> {
        const backgroundPage = await this.waitForExtensionBackgroundPage();
        return await backgroundPage.evaluate(() => {
            return new Promise(resolve => {
                chrome.tabs.query({ active: true, currentWindow: true }, tabs => resolve(tabs[0].id));
            });
        });
    }

    public async waitForPageMatchingUrl(url: string): Promise<Page> {
        const underlyingTarget = await this.underlyingBrowser.waitForTarget(t => t.url().toLowerCase() === url.toLowerCase());
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
        if (this.memoizedBackgroundPage) {
            return this.memoizedBackgroundPage;
        }

        const backgroundPageTarget = await this.underlyingBrowser
            .waitForTarget(t => t.type() === 'background_page' && Browser.isExtensionBackgroundPage(t.url()));

        this.memoizedBackgroundPage = new Page(await backgroundPageTarget.page());

        return this.memoizedBackgroundPage;
    }

    private static isExtensionBackgroundPage(url: string): boolean {
        return new URL(url).pathname === '/background/background.html';
    }
}

function onBrowserDisconnected(): void {
    const errorMessage =
        `Browser disconnected unexpectedly; test results past this point should not be trusted. This probably means that either:
            - BrowserController's browser instance was .close() or .disconnect()ed without going through BrowserController.tearDown()
            - Chromium crashed (this is most commonly an out-of-memory issue)`;

    // This is best-effort - in many/most cases, a disconnected browser will cause an async puppeteer operation in
    // progress to fail (causing a test failure with a less useful error message) before this handler gets called.
    forceTestFailure(errorMessage);
}
