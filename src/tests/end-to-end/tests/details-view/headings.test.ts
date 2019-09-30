// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { detailsViewSelectors } from '../../common/element-identifiers/details-view-selectors';
import { DetailsViewPage } from '../../common/page-controllers/details-view-page';
import { TargetPage } from '../../common/page-controllers/target-page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';
import { DEFAULT_TARGET_PAGE_SCAN_TIMEOUT_MS } from '../../common/timeouts';

describe('Headings Page', () => {
    describe('Normal mode', () => {
        let browser: Browser;
        let targetPage: TargetPage;
        let headingsPage: DetailsViewPage;

        beforeAll(async () => {
            browser = await launchBrowser({ suppressFirstTimeDialog: true });
            targetPage = await browser.newTargetPage();
            headingsPage = await openHeadingsPage(browser, targetPage);
        });

        afterAll(async () => {
            if (browser) {
                await browser.close();
                browser = undefined;
            }
        });

        it('should pass accessibility validation', async () => {
            const results = await scanForAccessibilityIssues(headingsPage, detailsViewSelectors.mainContent);
            expect(results).toHaveLength(0);
        });
    });

    describe('High contrast mode', () => {
        let browser: Browser;
        let targetPage: TargetPage;
        let headingsPage: DetailsViewPage;

        beforeAll(async () => {
            browser = await launchBrowser({ suppressFirstTimeDialog: true });
            targetPage = await browser.newTargetPage();
            headingsPage = await openHeadingsPage(browser, targetPage);
            await headingsPage.enableHighContrast();
        });

        afterAll(async () => {
            if (browser) {
                await browser.close();
                browser = undefined;
            }
        });

        it('should pass accessibility validation', async () => {
            const results = await scanForAccessibilityIssues(headingsPage, detailsViewSelectors.mainContent);
            expect(results).toHaveLength(0);
        });
    });

    async function openHeadingsPage(browser: Browser, targetPage: TargetPage): Promise<DetailsViewPage> {
        const detailsViewPage = await browser.newDetailsViewPage(targetPage);
        await detailsViewPage.switchToAssessment();

        await detailsViewPage.clickSelector(detailsViewSelectors.testNavLink('Headings'));

        // Populating the instance table requires scanning the target page
        await detailsViewPage.waitForSelector(detailsViewSelectors.instanceTableTextContent, {
            timeout: DEFAULT_TARGET_PAGE_SCAN_TIMEOUT_MS,
        });

        return detailsViewPage;
    }
});
