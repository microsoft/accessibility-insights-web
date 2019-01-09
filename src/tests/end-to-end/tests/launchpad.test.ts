// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Page } from 'puppeteer';
import { ExtensionPuppeteerConnection } from '../common/extension-puppeteer-connection';

describe('Launchpad (popup page)', () => {
    let extensionConnection: ExtensionPuppeteerConnection;
    let targetPage: Page;
    let targetPageTabId: number;

    beforeAll(async () => {
        extensionConnection = await ExtensionPuppeteerConnection.connect(browser);

        targetPage = await browser.newPage();
        await targetPage.goto('https://bing.com');

        targetPageTabId = await extensionConnection.backgroundPage.evaluate(() => {
            return new Promise(resolve => {
                chrome.tabs.query({ active: true, currentWindow: true }, tabs => resolve(tabs[0].id));
            });
        });
    });

    afterAll(async () => {
        targetPage.close();
    });

    it('should open the telemetry prompt on first run', async () => {
        const popupPage = page;
        await popupPage.goto(extensionConnection.getExtensionUrl(`popup/popup.html?tabId=${targetPageTabId}`));

        await popupPage.waitForSelector('#Dialog3-title');
        const title = await popupPage.$eval('#Dialog3-title', element => element.textContent);
        expect(title).toEqual('We need your help');
    });

    it('should dismiss the telemetry prompt after hitting "okay"', async () => {
        throw 'notimpl';
    });

    it('should dismiss the telemetry prompt after hitting "okay"', async () => {
        throw 'notimpl';
    });
});
