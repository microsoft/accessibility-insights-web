// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { popupPageSelectors } from '../../common/popup-page-selectors';
import { getTestResourceUrl } from '../../common/test-resources';
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { Page } from '../../common/page';

describe('Ad hoc tools', () => {
    let browser: Browser;
    let targetPage: Page;
    let targetPageTabId: number;
    let popupPage: Page;

    beforeEach(async () => {
        browser = await launchBrowser();

        await setupNewTargetPage();
        popupPage = await browser.newExtensionPopupPage(targetPageTabId);
        await popupPage.bringToFront();
        await dismissTelemetryDialog();
        await popupPage.waitForSelectorToDisappear(popupPageSelectors.telemetryDialog);
    });

    afterEach(async () => {
        await browser.stop();
    });

    async function setupNewTargetPage() {
        targetPage = await browser.newPage(getTestResourceUrl('all.html'));

        await targetPage.bringToFront();
        targetPageTabId = await browser.getActivePageTabId();
    }

    async function dismissTelemetryDialog() {
        await popupPage.waitForSelector(popupPageSelectors.telemetryDialog);
        await popupPage.clickSelector(popupPageSelectors.startUsingProductButton);
    }

    it('adhoc title button exists and clicking on it takes us to the adhoc panel', async () => {
        const adhocButton = await popupPage.getElementByXPath("//button[text()='Ad hoc tools']");

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
