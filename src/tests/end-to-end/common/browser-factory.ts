// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Puppeteer from 'puppeteer';

import { Browser } from './browser';
import { popupPageSelectors } from './selectors/popup-page-selectors';

export interface ExtensionOptions {
    dismissFirstTimeDialog: boolean;
}

export async function launchBrowser(extensionOptions: ExtensionOptions): Promise<Browser> {
    const puppeteerBrowser = await launchNewBrowser();
    const browser = new Browser(puppeteerBrowser);

    if (extensionOptions.dismissFirstTimeDialog) {
        await dismissFirstTimeUsagePrompt(browser);
    }
    return browser;
}

async function dismissFirstTimeUsagePrompt(browser: Browser): Promise<void> {
    const targetPage = await browser.newTestResourcePage('all.html');

    await targetPage.bringToFront();

    const targetPageId = await browser.getActivePageTabId();
    const popupPage = await browser.newExtensionPopupPage(targetPageId);

    await popupPage.clickSelector(popupPageSelectors.startUsingProductButton);

    await targetPage.close();
    await popupPage.close();
}

async function launchNewBrowser(): Promise<Puppeteer.Browser> {
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

    return browser;
}
