// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as fs from 'fs';
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

function fileExists(path: string): Promise<boolean> {
    return new Promise(resolve => fs.exists(path, resolve));
}

async function verifyExtensionIsBuilt(extensionPath: string): Promise<void> {
    const manifestPath = `${extensionPath}/manifest.json`;
    if (!(await fileExists(manifestPath))) {
        throw new Error(
            `Cannot launch extension-enabled browser instance because extension has not been built.\n` +
                `Expected manifest file ${manifestPath} does not exist.\n` +
                `Have you run 'yarn build'?`,
        );
    }
}

async function launchNewBrowser(): Promise<Puppeteer.Browser> {
    // only unpacked extension paths are supported
    const extensionPath = `${(global as any).rootDir}/drop/dev/extension/`;

    // It's important that we verify this before calling Puppeteer.launch because its behavior if the
    // extension can't be loaded is "the Chromium instance hangs with an alert and everything on Puppeteer's
    // end shows up as a generic timeout error with no meaningful logging".
    await verifyExtensionIsBuilt(extensionPath);

    const platformSpecificArgs: string[] = [];
    if (process.platform === 'win32') {
        // Works around "Error: Page crashed!" failures caused by out-of-memory issues
        // (empirically, these issues have been win32-specific; we aren't sure why)
        platformSpecificArgs.push('--max-old-space-size=2048');
    }

    const browser = await Puppeteer.launch({
        // Headless doesn't support extensions, see https://github.com/GoogleChrome/puppeteer/issues/659
        headless: false,
        defaultViewport: {
            width: 1024,
            height: 768,
        },
        args: [
            // Required to work around https://github.com/GoogleChrome/puppeteer/pull/774
            `--disable-extensions-except=${extensionPath}`,
            `--load-extension=${extensionPath}`,
            '--no-sandbox',
            ...platformSpecificArgs,
        ],
        timeout: DEFAULT_BROWSER_LAUNCH_TIMEOUT_MS,
    });

    return browser;
}
