// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { CommonSelectors } from '../../common/element-identifiers/common-selectors';
import { Page } from '../../common/page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';

describe('SettingsDropDownTest', () => {
    let browser: Browser;
    let targetTabId: number;

    beforeAll(async () => {
        browser = await launchBrowser({ suppressFirstTimeDialog: true });
    });

    beforeEach(async () => {
        const targetPage = await browser.newTestResourcePage('all.html');
        await targetPage.bringToFront();
        targetTabId = await browser.getActivePageTabId();
    });

    afterEach(async () => {
        await browser.closeAllPages();
    });

    afterAll(async () => {
        await browser.close();
    });

    it('settings drop down content', async () => {
        const popupPage = await browser.newExtensionPopupPage(targetTabId);
        const popupDropdownElement = await getDropdownPanelElement(popupPage);

        const detailsViewPage = await browser.newExtensionDetailsViewPage(targetTabId);
        const detailsViewDropdownElement = await getDropdownPanelElement(detailsViewPage);

        expect(popupDropdownElement).toEqual(detailsViewDropdownElement);
        expect(popupDropdownElement).toMatchSnapshot();
    });

    it('should pass accessibility validation', async () => {
        const popupPage = await browser.newExtensionPopupPage(targetTabId);
        await popupPage.clickSelector(CommonSelectors.settingsGearButton);

        const results = await scanForAccessibilityIssues(popupPage, CommonSelectors.settingsDropdownMenu);
        // we are using snapshot comparison since we have some known issues in this dropdown
        // & we don't want to add new issues
        expect(results).toMatchSnapshot();
    });

    async function getDropdownPanelElement(page: Page) {
        await page.clickSelector(CommonSelectors.settingsGearButton);

        return await page.getPrintableHtmlElement(CommonSelectors.settingsDropdownMenu);
    }
});
