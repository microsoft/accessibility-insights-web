// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Page } from 'puppeteer';
import { ExtensionPuppeteerConnection } from '../common/extension-puppeteer-connection';
import { getTestResourceUrl } from '../common/test-resources';

describe('Adhoc Panel test', () => {
    let extensionConnection: ExtensionPuppeteerConnection;
    let targetPage: Page;
    let targetPageTabId: number;
    let popupPage: Page;

    beforeAll(async () => {
        extensionConnection = await ExtensionPuppeteerConnection.connect();

        await setupNewTargetPage();
        popupPage = await extensionConnection.newExtensionPopupPage(targetPageTabId);
        await popupPage.bringToFront();
        await dismissTelemetryPopup();
    });

    afterAll(async () => {
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

    it('test if launchpad title is there before pre', async () => {
        await popupPage.waitForSelector('.launch-pad-title');
        const launchpadTitle = await popupPage.$eval('.launch-pad-title', element => element.textContent);

        expect(launchpadTitle).toBe('Launch pad');
    });

    it('test if text for all the links in launchpad show properly', async () => {
        await popupPage.waitForSelector('.launch-pad-item-description');
        const launchPadItemListText = await popupPage.evaluate(() => {
            const elements = Array.from(document.querySelectorAll('.launch-pad-item-title'));
            const links = elements.map(element => {
                return element.textContent;
            });
            return links;
        });
        expect(launchPadItemListText.length).toBe(3);
        expect(launchPadItemListText).toEqual(['FastPass', 'Assessment', 'Ad hoc tools']);
    });
});
