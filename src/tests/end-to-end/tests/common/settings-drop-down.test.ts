// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { dismissFirstTimeUsagePrompt } from '../../common/dismiss-first-time-usage-prompt';
import { Page } from '../../common/page';
import { CommonSelectors } from '../../common/selectors/common-selectors';
import { DEFAULT_E2E_TEST_TIMEOUT_MS } from '../../common/timeouts';

describe('SettingsDropDownTest', () => {
    let browser: Browser;
    let targetTabId: number;

    beforeAll(async () => {
        browser = await launchBrowser();
        await dismissFirstTimeUsagePrompt(browser);
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
    }, DEFAULT_E2E_TEST_TIMEOUT_MS);

    async function getDropdownPanelElement(page: Page) {
        await page.clickSelector(CommonSelectors.settingsGearButton);

        return await page.getPrintableHtmlElement(CommonSelectors.settingsDropdownMenu);
    }
});
