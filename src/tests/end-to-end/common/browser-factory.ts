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
            ...cypressDefaultChromiumArgs,
        ],
        timeout: DEFAULT_BROWSER_LAUNCH_TIMEOUT_MS,
        env: {
            CHROME_LOG_FILE: path.join(chromeLogsPath, `${browserInstanceId}.txt`),
        },
    });

    return browser;
}

// cypressDefaultChromiumArgs definition taken from Cypress, which is MIT licensed per https://github.com/cypress-io/cypress/blob/develop/LICENSE
// https://github.com/cypress-io/cypress/blob/4506ead8831db78dc2488ba875dfde37e6e31c74/packages/server/lib/browsers/chrome.coffee#L21
const cypressDefaultChromiumArgs: string[] = [
    '--test-type',
    '--ignore-certificate-errors',
    '--start-maximized',
    '--silent-debugger-extension-api',
    '--no-default-browser-check',
    '--no-first-run',
    '--noerrdialogs',
    '--enable-fixed-layout',
    '--disable-popup-blocking',
    '--disable-password-generation',
    '--disable-save-password-bubble',
    '--disable-single-click-autofill',
    '--disable-prompt-on-repos',
    '--disable-background-timer-throttling',
    '--disable-renderer-backgrounding',
    '--disable-renderer-throttling',
    '--disable-restore-session-state',
    '--disable-translate',
    '--disable-new-profile-management',
    '--disable-new-avatar-menu',
    '--allow-insecure-localhost',
    '--reduce-security-for-testing',
    '--enable-automation',
    '--disable-infobars',
    '--disable-device-discovery-notifications',

    // https://github.com/cypress-io/cypress/issues/2376
    '--autoplay-policy=no-user-gesture-required',

    // http://www.chromium.org/Home/chromium-security/site-isolation
    // https://github.com/cypress-io/cypress/issues/1951
    '--disable-site-isolation-trials',

    // the following come frome chromedriver
    // https://code.google.com/p/chromium/codesearch#chromium/src/chrome/test/chromedriver/chrome_launcher.cc&sq=package:chromium&l=70
    '--metrics-recording-only',
    '--disable-prompt-on-repost',
    '--disable-hang-monitor',
    '--disable-sync',
    // this flag is causing throttling of XHR callbacks for
    // as much as 30 seconds. If you VNC in and open dev tools or
    // click on a button, it'll "instantly" work. with this
    // option enabled, it will time out some of our tests in circle
    // "--disable-background-networking",
    '--disable-web-resources',
    '--safebrowsing-disable-auto-update',
    '--safebrowsing-disable-download-protection',
    '--disable-client-side-phishing-detection',
    '--disable-component-update',
    '--disable-default-apps',

    // These flags are for webcam/WebRTC testing
    // https://github.com/cypress-io/cypress/issues/2704
    '--use-fake-ui-for-media-stream',
    '--use-fake-device-for-media-stream',
];
