// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ExtensionPuppeteerConnection } from '../common/extension-puppeteer-connection';

describe('puppeteer demo', () => {
    let extensionConnection: ExtensionPuppeteerConnection;

    beforeAll(async () => {
        extensionConnection = await ExtensionPuppeteerConnection.connect(browser);
    });

    it('Popup page should include telemetry opt-in', async () => {
        const targetPage = await browser.newPage();
        await targetPage.goto('https://bing.com');

        const { backgroundPage, extensionBaseUrl } = extensionConnection;
        const activeTabId = await backgroundPage.evaluate(() => {
            return new Promise(resolve => {
                chrome.tabs.query({ active: true, currentWindow: true }, tabs => resolve(tabs[0].id));
            });
        });

        const popupPage = await browser.newPage();
        await popupPage.goto(`${extensionBaseUrl}/popup/popup.html?tabId=${activeTabId}`);

        await popupPage.waitForSelector('#Dialog3-title');
        const title = await popupPage.$eval('#Dialog3-title', element => element.textContent);
        expect(title).toEqual('We need your help');
    });
});
