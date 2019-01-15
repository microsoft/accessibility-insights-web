// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { Page } from '../../common/page';
import { getTestResourceUrl } from '../../common/test-resources';

describe('Ad hoc tools', () => {
    let browser: Browser;
    let targetPage: Page;
    let targetPageTabId: number;
    let popupPage: Page;

    beforeEach(async () => {
        browser = await launchBrowser({ dismissFirstTimeDialog: true });
        await setupNewTargetPage();
        popupPage = await browser.newExtensionPopupPage(targetPageTabId);
        await popupPage.bringToFront();
    });

    afterEach(async () => {
        await browser.close();
    });

    async function setupNewTargetPage() {
        targetPage = await browser.newPage(getTestResourceUrl('all.html'));

        await targetPage.bringToFront();
        targetPageTabId = await browser.getActivePageTabId();
    }

    it('clicking the adhoc panel takes us to main page', async () => {
        await popupPage.clickSelectorXPath("//button[text()='Ad hoc tools']");

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
