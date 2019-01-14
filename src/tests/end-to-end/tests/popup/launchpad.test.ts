// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { launchBrowser } from '../../common/browser-factory';
import { popupPageSelectors } from '../../common/popup-page-selectors';
import { getTestResourceUrl } from '../../common/test-resources';
import { Browser } from '../../common/browser';
import { Page } from '../../common/page';

describe('Adhoc Panel test', () => {
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

    it('test snapshot for launchpad', async () => {
        await popupPage.waitForSelector('#new-launch-pad');

        const element = await popupPage.getPrintableHtmlElement('#new-launch-pad');
        expect(element).toMatchSnapshot();
    });

    it('test if text for all the links in launchpad show properly', async () => {
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
