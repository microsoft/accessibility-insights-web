// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Puppeteer from 'puppeteer';

import { Browser } from './browser';
import { popupPageElementIdentifiers } from './element-identifiers/popup-page-element-identifiers';
import { DEFAULT_BROWSER_LAUNCH_TIMEOUT_MS } from './timeouts';

export interface ExtensionOptions {
    suppressFirstTimeDialog: boolean;
}

export async function launchBrowser(extensionOptions: ExtensionOptions): Promise<Browser> {
    const puppeteerBrowser = await launchNewBrowser();
    const browser = new Browser(puppeteerBrowser);

    if (extensionOptions.suppressFirstTimeDialog) {
        await suppressFirstTimeUsagePrompt(browser);
    }
    return browser;
}

async function suppressFirstTimeUsagePrompt(browser: Browser): Promise<void> {
    const targetPage = await browser.newTestResourcePage('all.html');

    await targetPage.bringToFront();

    const targetPageId = await browser.getActivePageTabId();
    const popupPage = await browser.newExtensionPopupPage(targetPageId);

    await popupPage.clickSelector(popupPageElementIdentifiers.startUsingProductButton);

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
            '--enable-extension-activity-logging',
            '--enable-logging',
            '--log-level=0',
        ],
        // This causes Chromium's stdout/stderr to be piped for Jest to see, which is useful for debugging
        // launch issues with the browser (especially in a CI environment)
        dumpio: true,
        timeout: DEFAULT_BROWSER_LAUNCH_TIMEOUT_MS,
    });

    return browser;
}
