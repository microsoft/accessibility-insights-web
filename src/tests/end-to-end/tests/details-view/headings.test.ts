// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { GuidanceContentSelectors } from '../../common/element-identifiers/common-selectors';
import { detailsViewSelectors } from '../../common/element-identifiers/details-view-selectors';
import { enableHighContrast } from '../../common/enable-high-contrast';
import { Page } from '../../common/page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';

describe('Headings Page', () => {
    describe('Normal mode', () => {
        let browser: Browser;
        let targetTabId: number;
        let headingsPage: Page;

        beforeAll(async () => {
            browser = await launchBrowser({ suppressFirstTimeDialog: true });
            targetTabId = (await browser.setupNewTargetPage()).tabId;
            headingsPage = await openHeadingsPage(browser, targetTabId);
        });

        afterAll(async () => {
            if (browser) {
                await browser.close();
                browser = undefined;
            }
        });

        it('should pass accessibility validation', async () => {
            const results = await scanForAccessibilityIssues(headingsPage, GuidanceContentSelectors.detailsContent);
            expect(results).toHaveLength(0);
        });
    });

    describe('High contrast mode', () => {
        let browser: Browser;
        let targetTabId: number;
        let headingsPage: Page;

        beforeAll(async () => {
            browser = await launchBrowser({ suppressFirstTimeDialog: true });
            targetTabId = (await browser.setupNewTargetPage()).tabId;
            headingsPage = await openHeadingsPage(browser, targetTabId);
            await enableHighContrast(headingsPage);
        });

        afterAll(async () => {
            if (browser) {
                await browser.close();
                browser = undefined;
            }
        });

        it('should pass accessibility validation', async () => {
            const results = await scanForAccessibilityIssues(headingsPage, GuidanceContentSelectors.detailsContent);
            expect(results).toHaveLength(0);
        });
    });

    async function openHeadingsPage(browser: Browser, targetTabId: number): Promise<Page> {
        const detailsViewPage: Page = await browser.newExtensionAssessmentDetailsViewPage(targetTabId);

        await detailsViewPage.waitForSelector(detailsViewSelectors.testNavArea);

        await detailsViewPage.clickSelector(GuidanceContentSelectors.headingsNav);
        await detailsViewPage.waitForSelector(GuidanceContentSelectors.assessmentInstanceText);

        return detailsViewPage;
    }
});
