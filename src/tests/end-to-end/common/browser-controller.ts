// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Puppeteer from 'puppeteer';

export interface NewLaunchpadPageOptions {
    suppressFirstTimeTelemetryDialog: boolean;
}

// We want these to be as precise as possible, to avoid accidentally matching other built-in extensions
// that might also be running concurrently (we've seen this even though we use --disable-extensions-except=ours
// when we launch puppeteer).
const backgroundPageUrlRegex = /(^chrome-extension:\/\/\w+)\/background\/background.html$/;
const detailsViewUrlRegex = /(^chrome-extension:\/\/\w+)\/DetailsView\/detailsView.html(\?tabId=(\d+))?$/;

export class BrowserController {
    private alreadySuppressedTelemetryDialog: boolean = false;

    private constructor(
        private readonly extensionBaseUrl: string,
        private readonly browser: Puppeteer.Browser,
        public readonly backgroundPage: Puppeteer.Page,
    ) { }

    public static async launch(): Promise<BrowserController> {
        const browser = await BrowserController.launchNewBrowser();
        const backgroundPage = await BrowserController.waitForExtensionBackgroundPage(browser);

        // It's important to use .target().url() instead of just .url() here because there is an inconsistent
        // race condition where sometimes backgroundPage.mainFrame() doesn't get populated correctly, and so
        // url() (which is implemented in terms of mainFrame()) shows as ':' incorrectly
        const backgroundPageUrl = new URL(backgroundPage.target().url());
        const extensionBaseUrl = backgroundPageUrl.origin;

        return new BrowserController(extensionBaseUrl, browser, backgroundPage);
    }

    public async close() {
        this.browser.removeListener('disconnected', BrowserController.onBrowserDisconnected);
        await this.browser.close();
    }

    public async newPage(url: string): Promise<Puppeteer.Page> {
        const page = await this.browser.newPage();
        page.on('pageerror', error => {
            BrowserController.forceTestFailure(`Unhandled pageerror (console.error) emitted from page '${page.url()}': ${error}`);
        });
        await page.goto(url);
        return page;
    }

    public async newLaunchpadPage(
        targetPageUrl: string,
        options: NewLaunchpadPageOptions = {suppressFirstTimeTelemetryDialog: true},
    ): Promise<Puppeteer.Page> {
        const targetPage = await this.newPage(targetPageUrl);
        await targetPage.bringToFront();
        const targetTabId = await this.getActivePageTabId();
        const launchpadPage = await this.newLaunchpadPageForExistingTarget(targetTabId, options);

        return launchpadPage;
    }

    public async waitForDetailsPage() {
        const detailsPageTarget = await this.browser.waitForTarget(t => detailsViewUrlRegex.test(t.url()));
        const detailsPage = await detailsPageTarget.page();
        detailsPage.waitFor('header', {timeout: 2000});
        return detailsPage;
    }

    public async closeAllPages() {
        const pages = await this.browser.pages();
        await Promise.all(pages.map(page => page.close()));
    }

    private getExtensionUrl(relativePath: string) {
        return `${this.extensionBaseUrl}/${relativePath}`;
    }

    private async newLaunchpadPageForExistingTarget(targetTabId: number, options: NewLaunchpadPageOptions): Promise<Puppeteer.Page> {
        // Ideally we'd be asking puppeteer to invoke our extension's browser action; opening popup.html
        // with an explicit tab ID is a workaround until puppeteer supports invoking browser actions.
        const page = await this.newPage(this.getExtensionUrl(`popup/popup.html?tabId=${targetTabId}`));

        if (!this.alreadySuppressedTelemetryDialog && options.suppressFirstTimeTelemetryDialog) {
            await page.waitForSelector('.telemetry-permission-dialog-modal');
            await page.click('button.start-using-product-button');
            this.alreadySuppressedTelemetryDialog = true;
        }

        return page;
    }

    private getActivePageTabId(): Promise<number> {
        return this.backgroundPage.evaluate(() => {
            return new Promise(resolve => {
                chrome.tabs.query({ active: true, currentWindow: true }, tabs => resolve(tabs[0].id));
            });
        });
    }

    private static async launchNewBrowser(): Promise<Puppeteer.Browser> {
        // only unpacked extension paths are supported
        const extensionPath = `${process.cwd()}/drop/dev/extension/`;
        const browser = await Puppeteer.launch({
            // Headless doesn't support extensions, see https://github.com/GoogleChrome/puppeteer/issues/659
            headless: false,
            args: [
                // Required to work around https://github.com/GoogleChrome/puppeteer/pull/774
                `--disable-extensions-except=${extensionPath}`,
                `--load-extension=${extensionPath}`,
            ],
        });

        browser.on('disconnected', BrowserController.onBrowserDisconnected);
        return browser;
    }

    private static onBrowserDisconnected() {
        const errorMessage =
            `Browser disconnected unexpectedly; test results past this point should not be trusted. This probably means that either:
                - BrowserController's browser instance was .close() or .disconnect()ed without going through BrowserController.tearDown()
                - Chromium crashed (this is most commonly an out-of-memory issue)`;

        // This is best-effort - in many/most cases, a disconnected browser will cause an async puppeteer operation in
        // progress to fail (causing a test failure with a less useful error message) before this handler gets called.
        BrowserController.forceTestFailure(errorMessage);
    }

    private static forceTestFailure(errorMessage: string) {
        process.emit('uncaughtException', new Error(errorMessage));
    }

    private static async waitForExtensionBackgroundPage(browser: Puppeteer.Browser): Promise<Puppeteer.Page> {
        const backgroundPageTarget = await browser
            .waitForTarget(t => t.type() === 'background_page' && backgroundPageUrlRegex.test(t.url()));

        return await backgroundPageTarget.page();
    }
}
