// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { popupPageElementIdentifiers } from '../../common/element-identifiers/popup-page-element-identifiers';
import { Page } from '../../common/page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';

describe('Adhoc Panel test', () => {
    let browser: Browser;
    let targetPage: Page;
    let targetPageTabId: number;
    let popupPage: Page;

    beforeAll(async () => {
        browser = await launchBrowser({ suppressFirstTimeDialog: true });
    });

    beforeEach(async () => {
        await setupNewTargetPage();
        popupPage = await browser.newExtensionPopupPage(targetPageTabId);
        await popupPage.bringToFront();
    });

    afterEach(async () => {
        await browser.closeAllPages();
    });

    afterAll(async () => {
        await browser.close();
    });

    async function setupNewTargetPage() {
        targetPage = await browser.newTestResourcePage('all.html');

        await targetPage.bringToFront();
        targetPageTabId = await browser.getActivePageTabId();
    }

    it('test snapshot for launchpad', async () => {
        await popupPage.waitForSelector(popupPageElementIdentifiers.launchPad);

        const element = await popupPage.getPrintableHtmlElement(popupPageElementIdentifiers.launchPad);
        expect(element).toMatchSnapshot();
    });

    it('test if text for all the links in launchpad show properly', async () => {
        await popupPage.waitForSelector(popupPageElementIdentifiers.launchPad);

        const launchPadItemListText = await popupPage.getMatchingElements(popupPageElementIdentifiers.launchPadItemTitle, 'textContent');

        expect(launchPadItemListText.length).toBe(3);
        expect(launchPadItemListText).toEqual(['FastPass', 'Assessment', 'Ad hoc tools']);
    });

    it('should pass accessibility validation', async () => {
        await popupPage.waitForSelector(popupPageElementIdentifiers.launchPad);

        const results = await scanForAccessibilityIssues(popupPage, '*');
        expect(results).toHaveLength(0);
    });
});
