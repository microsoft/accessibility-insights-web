// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Page } from 'puppeteer';

import { ExtensionPuppeteerConnection } from '../common/extension-puppeteer-connection';
import { waitForElementToDisappear } from '../common/page-utils';
import { popupPageSelectors } from '../common/popup-page-selectors';
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
        await dismissTelemetryDialog();
        await waitForElementToDisappear(popupPage, popupPageSelectors.telemetryDialog);
    });

    afterEach(async () => {
        await extensionConnection.tearDown();
    });

    async function setupNewTargetPage() {
        targetPage = await extensionConnection.newPage(getTestResourceUrl('all.html'));

        await targetPage.bringToFront();
        targetPageTabId = await extensionConnection.getActivePageTabId();
    }

    async function dismissTelemetryDialog() {
        await popupPage.waitForSelector(popupPageSelectors.telemetryDialog);
        await popupPage.click(popupPageSelectors.startUsingProductButton);
    }

    it('adhoc title button exists and clicking on it takes us to the adhoc panel', async () => {

        await popupPage.waitForSelector('.launch-pad-item-description');

        const adhocButton = await popupPage.$x("//button[text()='Ad hoc tools']");

        expect(adhocButton).toBeDefined();
        expect(adhocButton.length).toBe(1);

        await adhocButton[0].click();

        await popupPage.waitForSelector('.ad-hoc-tools-panel-footer');

        await popupPage.waitForSelector('main');

        const mainAdhocPanel = await popupPage.evaluate(() => {
            const elements = Array.from(document.querySelectorAll('main'));
            const html = elements.map(e => e.outerHTML);
            return html;
        });

        expect(mainAdhocPanel).toBeDefined();
        expect(mainAdhocPanel.length).toBe(1);
    });

});
