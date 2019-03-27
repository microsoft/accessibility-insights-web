// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { CommonSelectors } from '../../common/element-identifiers/common-selectors';
import { popupPageElementIdentifiers } from '../../common/element-identifiers/popup-page-element-identifiers';
import { enableHighContrast } from '../../common/enable-high-contrast';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';
import { setupNewTargetPage, TargetPageInfo } from '../../common/setup-new-target-page';
import { Page } from '../../common/page';

describe('Hamburger menu', () => {
    describe('Normal mode', () => {
        let browser: Browser;
        let targetPageInfo: TargetPageInfo;
        let popupPage: Page;

        beforeAll(async () => {
            browser = await launchBrowser({ suppressFirstTimeDialog: true });
            targetPageInfo = await setupNewTargetPage(browser);
            popupPage = await browser.newExtensionPopupPage(targetPageInfo.tabId);
            await popupPage.clickSelector(popupPageElementIdentifiers.hamburgerMenuButton);
        });

        afterAll(async () => {
            if (browser) {
                await browser.close();
                browser = undefined;
            }
        });

        it('should have content matching snapshot', async () => {
            const hamburgerMenu = await popupPage.getPrintableHtmlElement(popupPageElementIdentifiers.hamburgerMenu);

            expect(hamburgerMenu).toMatchSnapshot();
        });

        it('should pass accessibility validation', async () => {
            const results = await scanForAccessibilityIssues(popupPage, popupPageElementIdentifiers.hamburgerMenu);
            expect(results).toHaveLength(0);
        });
    });

    describe('high contrast mode', () => {
        let browser: Browser;
        let targetPageInfo: TargetPageInfo;
        let popupPage: Page;

        beforeAll(async () => {
            browser = await launchBrowser({ suppressFirstTimeDialog: true });
            targetPageInfo = await setupNewTargetPage(browser);
            const detailsViewPage = await browser.newExtensionDetailsViewPage(targetPageInfo.tabId);

            await enableHighContrast(detailsViewPage);

            popupPage = await browser.newExtensionPopupPage(targetPageInfo.tabId);
            await popupPage.waitForSelector(CommonSelectors.highContrastThemeSelector);

            await popupPage.clickSelector(popupPageElementIdentifiers.hamburgerMenuButton);
        });

        afterAll(async () => {
            if (browser) {
                await browser.close();
            }
        });

        it('should pass accessibility validation', async () => {
            const results = await scanForAccessibilityIssues(popupPage, popupPageElementIdentifiers.hamburgerMenu);
            expect(results).toHaveLength(0);
        });
    });
});
