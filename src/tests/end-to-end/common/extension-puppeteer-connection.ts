// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Browser, Page } from 'puppeteer';

export class ExtensionPuppeteerConnection {
    private constructor(
        private readonly extensionBaseUrl: string,
        public readonly backgroundPage: Page,
    ) { }

    public getExtensionUrl(relativePath: string) {
        return `${this.extensionBaseUrl}/${relativePath}`;
    }

    public static async connect(browser: Browser): Promise<ExtensionPuppeteerConnection> {
        const allTargets = await browser.targets();
        const backgroundPageTarget = allTargets.find(t => {
            return t.type() === 'background_page' && t.url().endsWith('background.html');
        });

        const backgroundPageUrl = await backgroundPageTarget.url();
        const extensionBaseUrl = backgroundPageUrl.match(/(.*)\/background\/background.html/)[1];
        const backgroundPage = await backgroundPageTarget.page();

        return new ExtensionPuppeteerConnection(extensionBaseUrl, backgroundPage);
    }
}
