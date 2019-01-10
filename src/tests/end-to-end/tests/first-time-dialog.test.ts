// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Page } from 'puppeteer';

import { ExtensionPuppeteerConnection } from '../common/extension-puppeteer-connection';

describe('FirstTimeDialogTest', () => {
    let extensionConnection: ExtensionPuppeteerConnection;
    let targetPage: Page;
    let targetPageTabId: number;
    let popupPage: Page;

    beforeEach(async () => {
        extensionConnection = await ExtensionPuppeteerConnection.connect();

        await setupNewTargetPage();

        popupPage = await extensionConnection.newExtensionPopupPage(targetPageTabId);

        // This is important; without this, UI simulation (like click()) will time out.
        popupPage.bringToFront();
    });

    afterEach(async () => {
        extensionConnection.tearDown();
    });

    it('verify first time dialog content', async () => {
        await popupPage.waitForSelector('.telemetry-permission-dialog-modal');

        const title = await popupPage.$eval('#telemetry-permission-title', element => element.textContent);
        expect(title).toBe('We need your help');
    });

    it('should not show telemetry dialog after dismissed', async () => {
        await popupPage.waitForSelector('.telemetry-permission-dialog-modal');
        await popupPage.click('button.start-using-product-button');

        await popupPage.waitFor(() => !document.querySelector('.telemetry-permission-dialog-modal'));

        // verify telemetry dialog doesn't show up in new popup
        setupNewTargetPage();
        popupPage = await extensionConnection.newExtensionPopupPage(targetPageTabId);
        popupPage.waitForSelector('#new-launch-pad');
        await popupPage.waitFor(() => !document.querySelector('.telemetry-permission-dialog-modal'));
    });

    async function setupNewTargetPage() {
        targetPage = await extensionConnection.newPage('https://bing.com');

        targetPageTabId = await extensionConnection.getTabId(targetPage);
    }
});
