// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Puppeteer from 'puppeteer';
import { browserLogPath } from './browser-factory';
import { popupPageElementIdentifiers } from './element-identifiers/popup-page-element-identifiers';
import { forceTestFailure } from './force-test-failure';
import { Page } from './page';
import { BackgroundPage, isBackgroundPageTarget } from './page-controllers/background-page';
import { DetailsViewPage } from './page-controllers/details-view-page';
import { PopupPage } from './page-controllers/popup-page';
import { TargetPage } from './page-controllers/target-page';
import { getTestResourceUrl } from './test-resources';

export class Browser {
    private memoizedBackgroundPage: BackgroundPage;
    private pages: Array<Page> = [];

    constructor(private readonly browserInstanceId: string, private readonly underlyingBrowser: Puppeteer.Browser) {
        underlyingBrowser.on('disconnected', onBrowserDisconnected);
    }

    public async close(): Promise<void> {
        this.underlyingBrowser.removeListener('disconnected', onBrowserDisconnected);
        await this.underlyingBrowser.close();
    }

    public async backgroundPage(): Promise<BackgroundPage> {
        if (this.memoizedBackgroundPage) {
            return this.memoizedBackgroundPage;
        }

        const backgroundPageTarget = await this.underlyingBrowser.waitForTarget(isBackgroundPageTarget);

        this.memoizedBackgroundPage = new BackgroundPage(await backgroundPageTarget.page(), { onPageCrash: this.onPageCrash });

        return this.memoizedBackgroundPage;
    }

    public async newPage(url: string): Promise<Page> {
        const underlyingPage = await this.underlyingBrowser.newPage();
        const page = new Page(underlyingPage, { onPageCrash: this.onPageCrash });
        this.pages.push(page);
        await page.goto(url);
        return page;
    }

    public async newTargetPage(url: string): Promise<TargetPage> {
        const underlyingPage = await this.underlyingBrowser.newPage();
        await underlyingPage.bringToFront();
        const tabId = await this.getActivePageTabId();
        const targetPage = new TargetPage(underlyingPage, tabId);
        this.pages.push(targetPage);
        await targetPage.goto(url);
        return targetPage;
    }

    public async newPopupPage(targetPage: TargetPage): Promise<PopupPage> {
        const popupUrl = await this.getPopupPageUrl(targetPage.tabId);
        const underlyingPage = await this.underlyingBrowser.newPage();
        const page = new PopupPage(underlyingPage, { onPageCrash: this.onPageCrash });
        this.pages.push(page);
        await page.goto(popupUrl);
        return page;
    }

    public async newDetailsViewPage(targetPage: TargetPage): Promise<DetailsViewPage> {
        const detailsViewUrl = await this.getDetailsViewPageUrl(targetPage.tabId);
        const underlyingPage = await this.underlyingBrowser.newPage();
        const page = new DetailsViewPage(underlyingPage, { onPageCrash: this.onPageCrash });
        this.pages.push(page);
        await page.goto(detailsViewUrl);
        return page;
    }

    public async newExtensionPage(relativePath: string): Promise<Page> {
        const url = await this.getExtensionUrl(relativePath);
        return await this.newPage(url);
    }

    public async newTestResourceTargetPage(relativePath: string): Promise<TargetPage> {
        const url = getTestResourceUrl(relativePath);
        return await this.newTargetPage(url);
    }

    public async newContentPage(contentPath: string): Promise<Page> {
        return await this.newPage(await this.getContentPageUrl(contentPath));
    }

    public async newExtensionAssessmentDetailsViewPage(targetTabId: number): Promise<Page> {
        const popupPage = await this.newExtensionPopupPage(targetTabId);

        let detailsViewPage: Page;

        await Promise.all([
            this.waitForPageMatchingUrl(await this.getDetailsViewPageUrl(targetTabId)).then(page => (detailsViewPage = page)),
            popupPage.clickSelector(popupPageElementIdentifiers.launchPadAssessmentButton),
        ]);

        return detailsViewPage;
    }

    public async getPopupPageUrl(targetTabId: number): Promise<string> {
        return await this.getExtensionUrl(`popup/popup.html?tabId=${targetTabId}`);
    }

    public async getDetailsViewPageUrl(targetTabId: number): Promise<string> {
        return this.getExtensionUrl(`DetailsView/detailsView.html?tabId=${targetTabId}`);
    }

    public async getContentPageUrl(contentPath: string): Promise<string> {
        return this.getExtensionUrl(`insights.html#/content/${contentPath}`);
    }

    public async closeAllPages(): Promise<void> {
        for (let pos = 0; pos < this.pages.length; pos++) {
            await this.pages[pos].close(true);
        }
    }

    public async getActivePageTabId(): Promise<number> {
        const backgroundPage = await this.backgroundPage();
        return await backgroundPage.evaluate(() => {
            return new Promise(resolve => {
                chrome.tabs.query({ active: true, currentWindow: true }, tabs => resolve(tabs[0].id));
            });
        });
    }

    public async waitForPageMatchingUrl(url: string): Promise<Page> {
        const underlyingTarget = await this.underlyingBrowser.waitForTarget(t => t.url().toLowerCase() === url.toLowerCase());
        const underlyingPage = await underlyingTarget.page();
        const page = new Page(underlyingPage, { onPageCrash: this.onPageCrash });
        await page.disableAnimations();
        return page;
    }

    private async getExtensionUrl(relativePath: string): Promise<string> {
        const backgroundPage = await this.backgroundPage();
        const pageUrl = backgroundPage.url();

        // pageUrl.origin would be correct here, but it doesn't get populated correctly in all node.js versions we build
        return `${pageUrl.protocol}//${pageUrl.host}/${relativePath}`;
    }

    private onPageCrash = () => {
        const errorMessage = `!!! Browser.onPageCrashed: see detailed chrome logs '${browserLogPath(this.browserInstanceId)}'`;
        console.error(errorMessage);
    };
}

function onBrowserDisconnected(): void {
    const errorMessage = `Browser disconnected unexpectedly; test results past this point should not be trusted. This probably means that either:
            - BrowserController's browser instance was .close() or .disconnect()ed without going through BrowserController.tearDown()
            - Chromium crashed (this is most commonly an out-of-memory issue)`;

    // This is best-effort - in many/most cases, a disconnected browser will cause an async puppeteer operation in
    // progress to fail (causing a test failure with a less useful error message) before this handler gets called.
    forceTestFailure(errorMessage);
}
