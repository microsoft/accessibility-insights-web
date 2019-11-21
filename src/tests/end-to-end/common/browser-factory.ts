// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { generateUID } from 'common/uid-generator';
import * as fs from 'fs';
import * as path from 'path';
import * as Puppeteer from 'puppeteer';
import * as util from 'util';
import { Browser } from './browser';
import { DEFAULT_BROWSER_LAUNCH_TIMEOUT_MS } from './timeouts';

export const chromeLogsPath = path.join(__dirname, '../../../../test-results/e2e/chrome-logs/');

export function browserLogPath(browserInstanceId: string): string {
    return path.join(chromeLogsPath, browserInstanceId);
}

export interface ExtensionOptions {
    suppressFirstTimeDialog: boolean;
    enableHighContrast?: boolean;
}

export async function launchBrowser(extensionOptions: ExtensionOptions): Promise<Browser> {
    const browserInstanceId = generateUID();
    const puppeteerBrowser = await launchNewBrowser(browserInstanceId);
    const browser = new Browser(browserInstanceId, puppeteerBrowser);

    const backgroundPage = await browser.backgroundPage();
    if (extensionOptions.suppressFirstTimeDialog) {
        await backgroundPage.setTelemetryState(false);
    }
    if (extensionOptions.enableHighContrast) {
        await backgroundPage.setHighContrastMode(true);
    }

    return browser;
}

function fileExists(filePath: string): Promise<boolean> {
    return new Promise(resolve => fs.exists(filePath, resolve));
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
    const extensionPath = `${(global as any).rootDir}/drop/extension/dev/product`;

    // It's important that we verify this before calling Puppeteer.launch because its behavior if the
    // extension can't be loaded is "the Chromium instance hangs with an alert and everything on Puppeteer's
    // end shows up as a generic timeout error with no meaningful logging".
    await verifyExtensionIsBuilt(extensionPath);

    const browserLogDir = browserLogPath(browserInstanceId);
    const userDataDir = path.join(browserLogDir, 'userDataDir');

    // The userDataDir needs to be created before we launch Chromium; if we skip this, it prevents the
    // --enable-logging flag we pass to launch() below from producing the log file it's supposed to.
    await util.promisify(fs.mkdir)(userDataDir, { recursive: true });

    const browser = await Puppeteer.launch({
        // Headless doesn't support extensions, see https://github.com/GoogleChrome/puppeteer/issues/659
        headless: false,
        defaultViewport: null,
        args: [
            // Required to work around https://github.com/GoogleChrome/puppeteer/pull/774
            `--disable-extensions-except=${extensionPath}`,
            `--load-extension=${extensionPath}`,
            '--no-sandbox',
            // Causes crash dumps to be saved locally (in ${userDataDir}/Crashpad/reports)
            '--noerrdialogs',
            // Writes a verbose chrome log at ${userDataDir}/chrome_debug.log, useful for debugging page crashes
            '--enable-logging',
            '--v=1',
        ],
        timeout: DEFAULT_BROWSER_LAUNCH_TIMEOUT_MS,
        // For reasons we haven't fully root caused, allowing Puppeteer to use its default userDataDir location based on fs.mkdtemp
        // causes inconsistent page crashes on the Pipelines hosted Windows build agents. We suspect there may be some overaggressive
        // cleanup task removing the temp directories. Using a userDataDir in our test-results directory instead of the system %TEMP%
        // directory seems to prevent the crashes.
        userDataDir: userDataDir,
    });

    return browser;
}
