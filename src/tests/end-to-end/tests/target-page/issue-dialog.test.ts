// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Browser, TargetPageInfo } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { detailsViewSelectors } from '../../common/element-identifiers/details-view-selectors';
import { popupPageElementIdentifiers } from '../../common/element-identifiers/popup-page-element-identifiers';
import { Page } from '../../common/page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';

describe('Target Page', () => {
    let browser: Browser;
    let targetPageInfo: TargetPageInfo;
    let adhocPanel: Page;

    beforeAll(async () => {
        browser = await launchBrowser({ suppressFirstTimeDialog: true });
        targetPageInfo = await browser.setupNewTargetPage();
        adhocPanel = await openAdhocPanel(browser, targetPageInfo.tabId);
    });

    afterAll(async () => {
        if (browser) {
            await browser.close();
            browser = undefined;
        }
    });

    describe('issue dialog', () => {
        it('should pass accessibility validation', async () => {
            await adhocPanel.clickSelector('button[aria-label="Automated checks"]');

            const results = await scanForAccessibilityIssues(targetPageInfo.page, '#accessibility-insights-root-container');
            expect(results).toHaveLength(0);
        });
    });

    async function openAdhocPanel(browser: Browser, targetTabId: number): Promise<Page> {
        const popupPage = await browser.newExtensionPopupPage(targetTabId);
        await popupPage.clickSelectorXPath(popupPageElementIdentifiers.adhocLaunchPadLinkXPath);
        await popupPage.waitForSelector(popupPageElementIdentifiers.adhocPanel);

        return popupPage;
    }
});
