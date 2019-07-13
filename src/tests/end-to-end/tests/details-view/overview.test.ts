// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { overviewSelectors } from '../../common/element-identifiers/details-view-selectors';
import { popupPageElementIdentifiers } from '../../common/element-identifiers/popup-page-element-identifiers';
import { enableHighContrast } from '../../common/enable-high-contrast';
import { Page } from '../../common/page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';

describe('Overview Page', () => {
    describe('Normal mode', () => {
        let browser: Browser;
        let targetTabId: number;
        let overviewPage: Page;

        beforeAll(async () => {
            browser = await launchBrowser({ suppressFirstTimeDialog: true });
            targetTabId = (await browser.setupNewTargetPage()).tabId;
            overviewPage = await openOverviewPage(browser, targetTabId);
        });

        afterAll(async () => {
            if (browser) {
                await browser.close();
                browser = undefined;
            }
        });

        it('should pass accessibility validation', async () => {
            const results = await scanForAccessibilityIssues(overviewPage, overviewSelectors.overview);
            expect(results).toHaveLength(0);
        });
    });

    describe('High contrast mode', () => {
        let browser: Browser;
        let targetTabId: number;
        let overviewPage: Page;

        beforeAll(async () => {
            browser = await launchBrowser({ suppressFirstTimeDialog: true });
            targetTabId = (await browser.setupNewTargetPage()).tabId;
            overviewPage = await openOverviewPage(browser, targetTabId);
            await enableHighContrast(overviewPage);
        });

        afterAll(async () => {
            if (browser) {
                await browser.close();
                browser = undefined;
            }
        });

        it('should pass accessibility validation', async () => {
            const results = await scanForAccessibilityIssues(overviewPage, overviewSelectors.overview);
            expect(results).toHaveLength(0);
        });
    });

    async function openOverviewPage(browser: Browser, targetTabId: number): Promise<Page> {
        const popupPage = await browser.newExtensionPopupPage(targetTabId);

        let overviewPage: Page;

        await Promise.all([
            browser.waitForPageMatchingUrl(await browser.getDetailsViewPageUrl(targetTabId)).then(page => (overviewPage = page)),
            popupPage.clickSelector(popupPageElementIdentifiers.launchPadAssessmentButton),
        ]);

        await overviewPage.waitForSelector(overviewSelectors.overviewHeading);

        return overviewPage;
    }
});
