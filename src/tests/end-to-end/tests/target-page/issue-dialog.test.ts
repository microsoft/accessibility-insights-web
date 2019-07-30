// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { popupPageElementIdentifiers } from '../../common/element-identifiers/popup-page-element-identifiers';
import { PopupPage } from '../../common/page-controllers/popup-page';
import { TargetPage } from '../../common/page-controllers/target-page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';

describe('Target Page', () => {
    let browser: Browser;
    let targetPage: TargetPage;
    let adhocPanel: PopupPage;

    beforeAll(async () => {
        browser = await launchBrowser({ suppressFirstTimeDialog: true });
        targetPage = await browser.newTargetPage();
        adhocPanel = await openAdhocPanel(browser, targetPage);
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

            const results = await scanForAccessibilityIssues(targetPage, '#accessibility-insights-root-container');
            expect(results).toHaveLength(0);
        });
    });

    async function openAdhocPanel(browser: Browser, targetPage: TargetPage): Promise<PopupPage> {
        const popupPage = await browser.newPopupPage(targetPage);
        await popupPage.clickSelectorXPath(popupPageElementIdentifiers.adhocLaunchPadLinkXPath);
        await popupPage.waitForSelector(popupPageElementIdentifiers.adhocPanel);

        return popupPage;
    }
});
