// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { allOriginsPattern } from 'background/browser-permissions-tracker';
import { generateUID } from 'common/uid-generator';
import * as fs from 'fs';
import * as path from 'path';
import * as Playwright from 'playwright';
import { ManifestOveride } from 'tests/end-to-end/common/manifest-overide';
import * as util from 'util';
import { testResourceServerConfig } from '../setup/test-resource-server-config';
import { Browser } from './browser';
import { DEFAULT_BROWSER_LAUNCH_TIMEOUT_MS } from './timeouts';

export const chromeLogsPath = path.join(__dirname, '../../../../test-results/e2e/chrome-logs/');

export const browserLogPath = (browserInstanceId: string): string =>
    path.join(chromeLogsPath, browserInstanceId);

const fileExists = util.promisify(fs.exists);

export type ExtraPermissions = 'all-origins' | 'fake-activeTab';

export interface ExtensionOptions {
    suppressFirstTimeDialog: boolean;
    addExtraPermissionsToManifest?: ExtraPermissions;
}

export async function launchBrowser(extensionOptions: ExtensionOptions): Promise<Browser> {
    const browserInstanceId = generateUID();

    // only unpacked extension paths are supported
    const devExtensionPath = `${(global as any).rootDir}/drop/extension/dev/product`;
    const manifestPath = getManifestPath(devExtensionPath);

    const manifestOveride = await ManifestOveride.fromManifestPath(manifestPath);
    addPermissions(extensionOptions, manifestOveride);
    await manifestOveride.write();

    const playwrightBrowser = await launchNewBrowser(browserInstanceId, devExtensionPath);

    // It would be good to try out using a persistent browser and creating a context per test,
    // rather than creating a browser per test. Doing a 1:1 browser:context mapping for now to
    // simplify the initial migration from Puppeteer to Playwright.
    const playwrightContext = await playwrightBrowser.newContext();

    const browser = new Browser(
        browserInstanceId,
        playwrightBrowser,
        playwrightContext,
        manifestOveride.restoreOriginalManifest,
    );

    const backgroundPage = await browser.backgroundPage();
    if (extensionOptions.suppressFirstTimeDialog) {
        await backgroundPage.setTelemetryState(false);
    }

    return browser;
}

function getManifestPath(extensionPath: string): string {
    return `${extensionPath}/manifest.json`;
}

async function verifyExtensionIsBuilt(extensionPath: string): Promise<void> {
    const manifestPath = getManifestPath(extensionPath);
    if (!(await fileExists(manifestPath))) {
        throw new Error(
            `Cannot launch extension-enabled browser instance because extension has not been built.\n` +
                `Expected manifest file ${manifestPath} does not exist.\n` +
                `Have you run 'yarn build'?`,
        );
    }
}

const addPermissions = (
    extensionOptions: ExtensionOptions,
    manifestOveride: ManifestOveride,
): void => {
    const { addExtraPermissionsToManifest } = extensionOptions;

    switch (addExtraPermissionsToManifest) {
        case 'fake-activeTab':
            // we need to add localhost origin permission in order to fake activeTab
            // the main reason is Playwright (like Puppeteer) lacks an API to activate the extension
            // via clicking the extenion icon (on the toolbar) or sending the extension shortcut
            // see https://github.com/puppeteer/puppeteer/issues/2486 for more details
            manifestOveride.addTemporaryPermission(
                `http://localhost:${testResourceServerConfig.port}/*`,
            );
            break;

        case 'all-origins':
            manifestOveride.addTemporaryPermission(allOriginsPattern);
            break;
        default:
        // no-op
    }
};

async function launchNewBrowser(
    browserInstanceId: string,
    extensionPath: string,
): Promise<Playwright.Browser> {
    // It's important that we verify this before calling Playwright.chromium because its behavior if the
    // extension can't be loaded is "the Chromium instance hangs with an alert and everything on Playwright's
    // end shows up as a generic timeout error with no meaningful logging".
    await verifyExtensionIsBuilt(extensionPath);

    const browserLogDir = browserLogPath(browserInstanceId);
    const userDataDir = path.join(browserLogDir, 'userDataDir');

    // The userDataDir needs to be created before we launch Chromium; if we skip this, it prevents the
    // --enable-logging flag we pass to launch() below from producing the log file it's supposed to.
    await util.promisify(fs.mkdir)(userDataDir, { recursive: true });

    const browser = await Playwright.chromium.launch({
        // Headless doesn't support extensions
        // see https://playwright.dev/#version=v1.2.0&path=docs%2Fapi.md&q=working-with-chrome-extensions
        headless: false,
        defaultViewport: null,
        args: [
            // We use the smallest size we support both because we want to ensure functionality works there
            // and also because it improves test runtime to render fewer pixels, especially in environments
            // that can't hardware-accelerate rendering (eg, docker)
            '--window-size=320x240',
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
        // For reasons we haven't fully root caused, allowing Playwright to use its default userDataDir location based on fs.mkdtemp
        // causes inconsistent page crashes on the Pipelines hosted Windows build agents. We suspect there may be some overaggressive
        // cleanup task removing the temp directories. Using a userDataDir in our test-results directory instead of the system %TEMP%
        // directory seems to prevent the crashes.
        userDataDir: userDataDir,
    });

    return browser;
}
