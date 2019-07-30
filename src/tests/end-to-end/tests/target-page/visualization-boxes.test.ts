// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { PopupPage } from '../../common/page-controllers/popup-page';
import { TargetPage } from '../../common/page-controllers/target-page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';

describe('Target Page visualization boxes', () => {
    let browser: Browser;
    let targetPage: TargetPage;
    let popupPage: PopupPage;

    beforeAll(async () => {
        browser = await launchBrowser({ suppressFirstTimeDialog: true });
        targetPage = await browser.newTargetPage();
        popupPage = await browser.newPopupPage(targetPage);
    });

    afterAll(async () => {
        if (browser) {
            await browser.close();
            browser = undefined;
        }
    });

    describe('Headings', () => {
        it('should pass accessibility validation', async () => {
            await popupPage.gotoAdhocPanel();
            await popupPage.enableToggleByAriaLabel('Headings');

            const results = await scanForAccessibilityIssues(targetPage, '#accessibility-insights-root-container');
            expect(results).toHaveLength(0);
        });
    });
});
