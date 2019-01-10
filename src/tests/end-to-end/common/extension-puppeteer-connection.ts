// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as puppeteer from 'puppeteer';

export class ExtensionPuppeteerConnection {
    private constructor(
        private readonly extensionBaseUrl: string,
        public readonly browser: puppeteer.Browser,
        public readonly backgroundPage: puppeteer.Page,
    ) { }

    public getExtensionUrl(relativePath: string) {
        return `${this.extensionBaseUrl}/${relativePath}`;
    }

    public async newBlankPage(): Promise<puppeteer.Page> {
        const page =  await this.browser.newPage();
        page.on('pageerror', error => {
            process.emit('uncaughtException', new Error(`console error in page - '${page.url()}' : ${error}`));
        });

        return page;
    }

    public async newExtensionPopupPage(targetTabId: number): Promise<puppeteer.Page> {
        return await this.newPage(this.getExtensionUrl(`popup/popup.html?tabId=${targetTabId}`));
    }

    public async getActivePageTabId(): Promise<number> {
        return this.backgroundPage.evaluate(() => {
            return new Promise(resolve => {
                chrome.tabs.query({ active: true, currentWindow: true }, tabs => resolve(tabs[0].id));
            });
        });
    }

    public async newPage(url: string): Promise<puppeteer.Page> {
        const page = await this.newBlankPage();
        await page.goto(url);

        return page;
    }

    public async tearDown() {
        await this.browser.close();
    }

    public static async connect(): Promise<ExtensionPuppeteerConnection> {
        const browser = await ExtensionPuppeteerConnection.launchNewBrowser();
        const backgroundPage = await ExtensionPuppeteerConnection.waitForExtensionBackgroundPage(browser);

        const backgroundPageUrl = backgroundPage.url();
        const extensionBaseUrl = backgroundPageUrl.match(/(.*)\/background\/background.html/)[1];

        return new ExtensionPuppeteerConnection(extensionBaseUrl, browser, backgroundPage);
    }

    private static launchNewBrowser(): Promise<puppeteer.Browser> {
        // only unpacked extension paths are supported
        const extensionPath = `${process.cwd()}/drop/dev/extension/`;
        return puppeteer.launch({
            // Headless doesn't support extensions, see https://github.com/GoogleChrome/puppeteer/issues/659
            headless: false,
            args: [
                // Required to work around https://github.com/GoogleChrome/puppeteer/pull/774
                `--disable-extensions-except=${extensionPath}`,
                `--load-extension=${extensionPath}`,
            ],
        });
    }

    private static async waitForExtensionBackgroundPage(browser: puppeteer.Browser): Promise<puppeteer.Page> {
        const backgroundPageTarget = await browser
            .waitForTarget(t => t.type() === 'background_page' && t.url().endsWith('background.html'));

        return backgroundPageTarget.page();
    }

}
