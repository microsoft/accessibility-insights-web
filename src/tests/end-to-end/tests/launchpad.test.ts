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

        // This is important; without this, UI simulation (like click()) will time out.
        page.bringToFront();
    });

    afterAll(async () => {
        targetPage.close();
    });

    it('should open the telemetry prompt on first run', async () => {
        const popupPage = page;
        await popupPage.goto(extensionConnection.getExtensionUrl(`popup/popup.html?tabId=${targetPageTabId}`));

        await popupPage.waitForSelector('.telemetry-permission-dialog-modal');

        const title = await popupPage.$eval('#telemetry-permission-title', element => element.textContent);

        expect(title).toBe('We need your help');
    });

    it('should dismiss the telemetry prompt after hitting "OK"', async () => {
        const popupPage = page;
        await popupPage.goto(extensionConnection.getExtensionUrl(`popup/popup.html?tabId=${targetPageTabId}`));

        await popupPage.waitForSelector('.telemetry-permission-dialog-modal');

        await popupPage.click('button.start-using-product-button');

        await popupPage.waitFor(() => !document.querySelector('.telemetry-permission-dialog-modal'), {timeout: 1000});
    });
});
