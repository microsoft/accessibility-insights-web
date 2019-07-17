// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as fs from 'fs';
import * as path from 'path';
import * as Puppeteer from 'puppeteer';
import * as util from 'util';
import { generateUID } from '../../../common/uid-generator';
import { Browser } from './browser';
import { popupPageElementIdentifiers } from './element-identifiers/popup-page-element-identifiers';
import { DEFAULT_BROWSER_LAUNCH_TIMEOUT_MS } from './timeouts';

export const chromeLogsPath = path.join(__dirname, '../../../../test-results/e2e/chrome-logs/');

export interface ExtensionOptions {
    suppressFirstTimeDialog: boolean;
}

export async function launchBrowser(extensionOptions: ExtensionOptions): Promise<Browser> {
    const browserInstanceId = generateUID();
    const puppeteerBrowser = await launchNewBrowser(browserInstanceId);
    const browser = new Browser(browserInstanceId, puppeteerBrowser);

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

async function launchNewBrowser(browserInstanceId: string): Promise<Puppeteer.Browser> {
    // only unpacked extension paths are supported
    const extensionPath = `${(global as any).rootDir}/drop/dev/extension/`;

    // It's important that we verify this before calling Puppeteer.launch because its behavior if the
    // extension can't be loaded is "the Chromium instance hangs with an alert and everything on Puppeteer's
    // end shows up as a generic timeout error with no meaningful logging".
    await verifyExtensionIsBuilt(extensionPath);

    const browserLogPath = path.join(chromeLogsPath, browserInstanceId);

    // If this isn't present when chrome launches, it'll silently fail to log anything
    await util.promisify(fs.mkdir)(browserLogPath, { recursive: true });

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
            // Causes crash dumps to be saved locally rather than handled by the underlying OS reporting mechanism
            '--noerrdialogs',
            // Keeps process logs, useful for debugging page crashes
            '--enable-logging',
            '--v=1',
        ],
        timeout: DEFAULT_BROWSER_LAUNCH_TIMEOUT_MS,
        env: {
            CHROME_LOG_FILE: path.join(browserLogPath, `CHROME_LOG_FILE.txt`),
        },
        userDataDir: path.join(browserLogPath, 'userDataDir'),
    });

    return browser;
}
