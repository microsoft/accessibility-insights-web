// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { overviewSelectors } from '../../common/element-identifiers/details-view-selectors';
import { DetailsViewPage } from '../../common/page-controllers/details-view-page';
import { TargetPage } from '../../common/page-controllers/target-page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';

describe('Overview Page', () => {
    describe('Normal mode', () => {
        let browser: Browser;
        let targetPage: TargetPage;
        let overviewPage: DetailsViewPage;

        beforeAll(async () => {
            browser = await launchBrowser({ suppressFirstTimeDialog: true });
            targetPage = await browser.newTargetPage();
            overviewPage = await openOverviewPage(browser, targetPage);
        });

        afterAll(async () => {
            if (browser) {
                await browser.close();
                browser = undefined;
            }
        });

        it('should pass accessibility validation', async () => {
            const results = await scanForAccessibilityIssues(
                overviewPage,
                overviewSelectors.overview,
            );
            expect(results).toHaveLength(0);
        });
    });

    describe('High contrast mode', () => {
        let browser: Browser;
        let targetPage: TargetPage;
        let overviewPage: DetailsViewPage;

        beforeAll(async () => {
            browser = await launchBrowser({ suppressFirstTimeDialog: true });
            targetPage = await browser.newTargetPage();
            overviewPage = await openOverviewPage(browser, targetPage);
            await overviewPage.enableHighContrast();
        });

        afterAll(async () => {
            if (browser) {
                await browser.close();
                browser = undefined;
            }
        });

        it('should pass accessibility validation', async () => {
            const results = await scanForAccessibilityIssues(
                overviewPage,
                overviewSelectors.overview,
            );
            expect(results).toHaveLength(0);
        });
    });

    async function openOverviewPage(
        browser: Browser,
        targetPage: TargetPage,
    ): Promise<DetailsViewPage> {
        const detailsViewPage = await browser.newDetailsViewPage(targetPage);
        await detailsViewPage.switchToAssessment();
        await detailsViewPage.waitForSelector(
            overviewSelectors.overviewHeading,
        );

        return detailsViewPage;
    }
});
