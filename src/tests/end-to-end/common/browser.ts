// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Puppeteer from 'puppeteer';
import { forceTestFailure } from './force-test-failure';
import { Page } from './page';
import { DEFAULT_NEW_PAGE_WAIT_TIMEOUT_MS } from './timeouts';
import { popupPageSelectors } from './popup-page-selectors';

export interface NewPopupPageOptions {
    suppressFirstTimeTelemetryDialog: boolean;
}

export class Browser {
    private alreadySuppressedTelemetryDialog: boolean = false;
    private memoizedBackgroundPage: Page;

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
            .waitForTarget(t => t.type() === 'background_page' && new URL(t.url()).pathname === '/background/background.html');

        this.memoizedBackgroundPage = new Page(await backgroundPageTarget.page());

        return this.memoizedBackgroundPage;
    }

    public async waitForDetailsPage() {
        const detailsViewUrlRegex = /(^chrome-extension:\/\/\w+)\/DetailsView\/detailsView.html(\?tabId=(\d+))?$/;
        const detailsPageTarget = await this.underlyingBrowser.waitForTarget(t => detailsViewUrlRegex.test(t.url()));
        const detailsPage = await detailsPageTarget.page();
        detailsPage.waitFor('header', {timeout: DEFAULT_NEW_PAGE_WAIT_TIMEOUT_MS});
        return detailsPage;
    }

    public async newPopupPageForTarget(targetTabId: number, options?: NewPopupPageOptions): Promise<Page> {
        options = {
            suppressFirstTimeTelemetryDialog: true,
            ...options,
        };

        // Ideally we'd be asking puppeteer to invoke our extension's browser action; opening popup.html
        // with an explicit tab ID is a workaround until puppeteer supports invoking browser actions.
        const page = await this.newExtensionPage(`popup/popup.html?tabId=${targetTabId}`);

        if (!this.alreadySuppressedTelemetryDialog && options.suppressFirstTimeTelemetryDialog) {
            await page.clickSelector(popupPageSelectors.startUsingProductButton);
            this.alreadySuppressedTelemetryDialog = true;
        }

        return page;
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
