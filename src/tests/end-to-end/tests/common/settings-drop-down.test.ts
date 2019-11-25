// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { CommonSelectors } from '../../common/element-identifiers/common-selectors';
import { formatPageElementForSnapshot } from '../../common/element-snapshot-formatter';
import { Page } from '../../common/page-controllers/page';
import { TargetPage } from '../../common/page-controllers/target-page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';

describe('Settings Dropdown', () => {
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

    it.each([true, false])('should pass accessibility validation in popup with highContrastMode=%s', async highContrastMode => {
        await browser.setHighContrastMode(highContrastMode);
        const popupPage = await browser.newPopupPage(targetPage);
        await popupPage.waitForHighContrastMode(highContrastMode);

        await popupPage.clickSelector(CommonSelectors.settingsGearButton);

        const results = await scanForAccessibilityIssues(popupPage, CommonSelectors.settingsDropdownMenu);
        expect(results).toHaveLength(0);
    });

    it.each([true, false])('should pass accessibility validation in details view with highContrastMode=%s', async highContrastMode => {
        await browser.setHighContrastMode(highContrastMode);
        await browser.newPopupPage(targetPage); // Required for the details view to register as having permissions/being open

        const detailsViewPage = await browser.newDetailsViewPage(targetPage);
        await detailsViewPage.waitForHighContrastMode(highContrastMode);

        await detailsViewPage.clickSelector(CommonSelectors.settingsGearButton);

        const results = await scanForAccessibilityIssues(detailsViewPage, CommonSelectors.settingsDropdownMenu);
        expect(results).toHaveLength(0);
    });

    async function getDropdownPanelElement(page: Page): Promise<Node> {
        await page.clickSelector(CommonSelectors.settingsGearButton);
        return await formatPageElementForSnapshot(page, CommonSelectors.settingsDropdownMenu);
    }
});
