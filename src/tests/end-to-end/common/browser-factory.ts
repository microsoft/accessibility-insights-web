// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Puppeteer from 'puppeteer';
import { Browser } from './browser';

export async function launchBrowser(): Promise<Browser> {
    const puppeteerBrowser = await launchNewBrowser();

    return new Browser(puppeteerBrowser);
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
