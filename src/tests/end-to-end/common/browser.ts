// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Playwright from 'playwright';
import { ChromiumBrowserContext } from 'playwright';
import { NestedIframeTargetPage } from 'tests/end-to-end/common/page-controllers/nested-iframe-target-page';
import { browserLogPath } from './browser-factory';
import { forceTestFailure } from './force-test-failure';
import { BackgroundPage, hasBackgroundPageUrl } from './page-controllers/background-page';
import { ContentPage, contentPageRelativeUrl } from './page-controllers/content-page';
import { DetailsViewPage, detailsViewRelativeUrl } from './page-controllers/details-view-page';
import { Page } from './page-controllers/page';
import { PopupPage, popupPageRelativeUrl } from './page-controllers/popup-page';
import { TargetPage, targetPageUrl, TargetPageUrlOptions } from './page-controllers/target-page';
export class Browser {
    private memoizedBackgroundPage: BackgroundPage;
    private pages: Array<Page> = [];
    private underlyingBrowserContext: Playwright.BrowserContext | null;

    constructor(
        private readonly browserInstanceId: string,
        underlyingBrowserContext: Playwright.BrowserContext,
        private readonly onClose?: () => Promise<void>,
    ) {
        this.underlyingBrowserContext = underlyingBrowserContext;
        underlyingBrowserContext.on('close', onBrowserDisconnected);
    }

    public async close(): Promise<void> {
        if (null == this.underlyingBrowserContext) {
            return;
        }

        if (this.onClose) {
            await this.onClose();
        }

        this.underlyingBrowserContext.removeListener('close', onBrowserDisconnected);
        await this.underlyingBrowserContext.close();
        this.underlyingBrowserContext = null;
    }

    public async backgroundPage(): Promise<BackgroundPage> {
        if (this.memoizedBackgroundPage) {
            return this.memoizedBackgroundPage;
        }

        const ourBackgroundPage = await this.waitForBackgroundPageMatching(hasBackgroundPageUrl);

        this.memoizedBackgroundPage = new BackgroundPage(ourBackgroundPage, {
            onPageCrash: this.onPageCrash,
        });

        return this.memoizedBackgroundPage;
    }

    public async newPage(url: string): Promise<Page> {
        const underlyingPage = await this.underlyingBrowserContext.newPage();
        const page = new Page(underlyingPage, { onPageCrash: this.onPageCrash });
        this.pages.push(page);
        await page.goto(url);
        return page;
    }

    // TargetPageControllerT should be a subclass of TargetPage with a ctor
    // that has the same parameters as TargetPage's
    public async newNestedIframeTargetPage(): Promise<NestedIframeTargetPage> {
        const underlyingPage = await this.underlyingBrowserContext.newPage();
        const tabId = await this.getActivePageTabId();
        const targetPage = new NestedIframeTargetPage(underlyingPage, tabId);
        this.pages.push(targetPage);
        await targetPage.goto(NestedIframeTargetPage.url);
        return targetPage;
    }

    public async newTargetPage(urlOptions?: TargetPageUrlOptions): Promise<TargetPage> {
        const underlyingPage = await this.underlyingBrowserContext.newPage();
        const tabId = await this.getActivePageTabId();
        const targetPage = new TargetPage(underlyingPage, tabId);
        this.pages.push(targetPage);
        await targetPage.goto(targetPageUrl(urlOptions));
        return targetPage;
    }

    public async newPopupPage(targetPage: TargetPage): Promise<PopupPage> {
        const underlyingPage = await this.underlyingBrowserContext.newPage();
        const page = new PopupPage(underlyingPage, { onPageCrash: this.onPageCrash });
        const url = await this.getExtensionUrl(popupPageRelativeUrl(targetPage.tabId));
        this.pages.push(page);
        await page.goto(url);
        return page;
    }

    public async newDetailsViewPage(targetPage: TargetPage): Promise<DetailsViewPage> {
        const underlyingPage = await this.underlyingBrowserContext.newPage();
        const page = new DetailsViewPage(underlyingPage, { onPageCrash: this.onPageCrash });
        const url = await this.getExtensionUrl(detailsViewRelativeUrl(targetPage.tabId));
        this.pages.push(page);
        await page.goto(url);
        return page;
    }

    public async newAssessment(
        targetPageUrlOptions?: TargetPageUrlOptions,
    ): Promise<{ detailsViewPage: DetailsViewPage; targetPage: TargetPage }> {
        const targetPage = await this.newTargetPage(targetPageUrlOptions);
        await this.newPopupPage(targetPage); // Required for the details view to register as having permissions/being open

        const detailsViewPage = await this.newDetailsViewPage(targetPage);
        await detailsViewPage.switchToAssessment();

        return { detailsViewPage, targetPage };
    }

    public async waitForDetailsViewPage(targetPage: TargetPage): Promise<DetailsViewPage> {
        const expectedUrl = await this.getExtensionUrl(detailsViewRelativeUrl(targetPage.tabId));
        const isMatch = (p: Playwright.Page) => p.url().toLowerCase() === expectedUrl.toLowerCase();

        const underlyingPage = await this.waitForVisiblePageMatching(isMatch);
        const page = new DetailsViewPage(underlyingPage, { onPageCrash: this.onPageCrash });
        this.pages.push(page);
        return page;
    }

    public async newContentPage(contentPath: string): Promise<ContentPage> {
        const underlyingPage = await this.underlyingBrowserContext.newPage();
        const page = new ContentPage(underlyingPage, { onPageCrash: this.onPageCrash });
        const url = await this.getExtensionUrl(contentPageRelativeUrl(contentPath));
        this.pages.push(page);
        await page.goto(url);
        return page;
    }

    public async gotoContentPage(existingPage: ContentPage, newContentPath: string): Promise<void> {
        const url = await this.getExtensionUrl(contentPageRelativeUrl(newContentPath));
        await existingPage.goto(url);
    }

    public async closeAllPages(): Promise<void> {
        for (let pos = 0; pos < this.pages.length; pos++) {
            await this.pages[pos].close(true);
        }
    }

    public async setHighContrastMode(highContrastMode: boolean): Promise<void> {
        const backgroundPage = await this.backgroundPage();
        await backgroundPage.setHighContrastMode(highContrastMode);
    }

    private async getActivePageTabId(): Promise<number> {
        const backgroundPage = await this.backgroundPage();
        return await backgroundPage.evaluate(() => {
            return new Promise(resolve => {
                chrome.tabs.query({ active: true, currentWindow: true }, tabs =>
                    resolve(tabs[0].id),
                );
            });
        }, null);
    }

    private async waitForBackgroundPageMatching(
        predicate: (candidate: Playwright.Page) => boolean,
    ): Promise<Playwright.Page> {
        const apiSupported = (this.underlyingBrowserContext as any).backgroundPages != null;
        if (!apiSupported) {
            // Tracking issue for native Playwright support: https://github.com/microsoft/playwright/issues/2874
            // Suggested workaround for Firefox: https://github.com/microsoft/playwright/issues/2644#issuecomment-647842059
            throw new Error("Don't know how to query for backgroundPages() in non-Chromium");
        }
        const context = this.underlyingBrowserContext as ChromiumBrowserContext;

        const allBackgroundPages = context.backgroundPages();

        const existingMatches = allBackgroundPages.filter(hasBackgroundPageUrl);
        if (existingMatches.length > 0) {
            return existingMatches[0];
        }

        return await new Promise(resolve => {
            const onNewPage = async newPage => {
                if (predicate(newPage)) {
                    context.off('backgroundpage', onNewPage);
                    resolve(newPage);
                }
            };
            context.on('backgroundpage', onNewPage);
        });
    }

    private async waitForVisiblePageMatching(
        predicate: (candidate: Playwright.Page) => boolean,
    ): Promise<Playwright.Page> {
        const existingMatches = this.underlyingBrowserContext.pages().filter(predicate);
        if (existingMatches.length > 0) {
            return existingMatches[0];
        }

        return await new Promise(resolve => {
            const onNewPage = async newPage => {
                if (predicate(newPage)) {
                    this.underlyingBrowserContext.off('page', onNewPage);
                    resolve(newPage);
                }
            };
            this.underlyingBrowserContext.on('page', onNewPage);
        });
    }

    private async getExtensionUrl(relativePath: string): Promise<string> {
        const backgroundPage = await this.backgroundPage();
        const pageUrl = backgroundPage.url();

        // pageUrl.origin would be correct here, but it doesn't get populated correctly in all node.js versions we build
        return `${pageUrl.protocol}//${pageUrl.host}/${relativePath}`;
    }

    private onPageCrash = () => {
        const errorMessage = `!!! Browser.onPageCrashed: see detailed chrome logs '${browserLogPath(
            this.browserInstanceId,
        )}'`;
        console.error(errorMessage);
    };
}

function onBrowserDisconnected(): void {
    const errorMessage = `Browser disconnected unexpectedly; test results past this point should not be trusted. This probably means that either:
            - BrowserController's browser instance was .close() or .disconnect()ed without going through BrowserController.tearDown()
            - Chromium crashed (this is most commonly an out-of-memory issue)`;

    // This is best-effort - in many/most cases, a disconnected browser will cause an async Playwright operation in
    // progress to fail (causing a test failure with a less useful error message) before this handler gets called.
    forceTestFailure(errorMessage);
}
