// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { CommonSelectors } from '../../common/element-identifiers/common-selectors';
import { formatPageElementForSnapshot } from '../../common/element-snapshot-formatter';
import { DetailsViewPage } from '../../common/page-controllers/details-view-page';
import { Page } from '../../common/page-controllers/page';
import { TargetPage } from '../../common/page-controllers/target-page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';

describe('Settings Dropdown', () => {
    describe('Normal mode', () => {
        let browser: Browser;
        let targetPage: TargetPage;

        beforeAll(async () => {
            browser = await launchBrowser({ suppressFirstTimeDialog: true });
        });

        beforeEach(async () => {
            targetPage = await browser.newTargetPage();
        });

        afterEach(async () => {
            if (browser) {
                await browser.closeAllPages();
            }
        });

        afterAll(async () => {
            if (browser) {
                await browser.close();
                browser = undefined;
            }
        });

        it('content should match snapshot', async () => {
            const popupPage = await browser.newPopupPage(targetPage);
            const popupDropdownElement = await getDropdownPanelElement(popupPage);

            const detailsViewPage = await browser.newDetailsViewPage(targetPage);
            const detailsViewDropdownElement = await getDropdownPanelElement(detailsViewPage);

            expect(popupDropdownElement).toEqual(detailsViewDropdownElement);
            expect(popupDropdownElement).toMatchSnapshot();
        });

        it('should pass accessibility validation', async () => {
            const popupPage = await browser.newPopupPage(targetPage);
            await popupPage.clickSelector(CommonSelectors.settingsGearButton);

            const results = await scanForAccessibilityIssues(popupPage, CommonSelectors.settingsDropdownMenu);
            expect(results).toHaveLength(0);
        });

        async function getDropdownPanelElement(page: Page): Promise<Node> {
            await page.clickSelector(CommonSelectors.settingsGearButton);
            return await formatPageElementForSnapshot(page, CommonSelectors.settingsDropdownMenu);
        }
    });
    describe('High contrast mode', () => {
        let browser: Browser;
        let targetPage: TargetPage;
        let detailsViewPage: DetailsViewPage;

        beforeAll(async () => {
            browser = await launchBrowser({ suppressFirstTimeDialog: true });
            targetPage = await browser.newTargetPage();
            detailsViewPage = await browser.newDetailsViewPage(targetPage);
            await detailsViewPage.enableHighContrast();
        });

        afterAll(async () => {
            if (browser) {
                await browser.close();
                browser = undefined;
            }
        });

        it('should pass accessibility validation in popup dropdown', async () => {
            const popupPage = await browser.newPopupPage(targetPage);
            await popupPage.clickSelector(CommonSelectors.settingsGearButton);

            const results = await scanForAccessibilityIssues(popupPage, CommonSelectors.settingsDropdownMenu);
            expect(results).toHaveLength(0);
        });

        it('should pass accessibility validation in details view page dropdown', async () => {
            await detailsViewPage.bringToFront();
            await detailsViewPage.clickSelector(CommonSelectors.settingsGearButton);
            const results = await scanForAccessibilityIssues(detailsViewPage, CommonSelectors.settingsDropdownMenu);
            expect(results).toHaveLength(0);
        });
    });
});
