// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Page } from 'puppeteer';
import { ExtensionPuppeteerConnection } from '../common/extension-puppeteer-connection';
import { getTestResourceUrl } from '../common/test-resources';

describe('Ad hoc tools', () => {
    let extensionConnection: ExtensionPuppeteerConnection;
    let targetPage: Page;
    let targetPageTabId: number;
    let popupPage: Page;

    beforeEach(async () => {
        extensionConnection = await ExtensionPuppeteerConnection.connect();
        await setupNewTargetPage();
        popupPage = await extensionConnection.newExtensionPopupPage(targetPageTabId);
        await popupPage.bringToFront();
        await dismissTelemetryPopup();
    });

    afterEach(async () => {
        await extensionConnection.tearDown();
    });

    async function setupNewTargetPage() {
        targetPage = await extensionConnection.newPage(getTestResourceUrl('all.html'));

        await targetPage.bringToFront();
        targetPageTabId = await extensionConnection.getActivePageTabId();
    }

    async function dismissTelemetryPopup() {
        await popupPage.waitForSelector('.telemetry-permission-dialog-modal');
        await popupPage.click('button.start-using-product-button');
        await popupPage.waitFor(() => !document.querySelector('.telemetry-permission-dialog-modal'));
    }

    it('adhoc title button exists and clicking on it takes us to the adhoc panel', async () => {
        await popupPage.waitForSelector('.launch-pad-item-description');

        const adhocButton = await popupPage.$x("//button[text()='Ad hoc tools']");

        expect(adhocButton).toBeDefined();
        expect(adhocButton.length).toBe(1);

        await adhocButton[0].click();

        await popupPage.waitForSelector('.ad-hoc-tools-panel-footer');

        await popupPage.waitForSelector('#adhoc-tools-panel-main');

        const mainAdhocPanel = await popupPage.$x('//*[@id="adhoc-tools-panel-main"]');

        expect(mainAdhocPanel).toBeDefined();
        expect(mainAdhocPanel.length).toBe(1);
    });
});
