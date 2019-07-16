// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { CommonSelectors } from '../../common/element-identifiers/common-selectors';
import { popupPageElementIdentifiers } from '../../common/element-identifiers/popup-page-element-identifiers';
import { formatPageElementForSnapshot } from '../../common/element-snapshot-formatter';
import { enableHighContrast } from '../../common/enable-high-contrast';
import { Page } from '../../common/page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';
import { TargetPageController } from '../../common/target-page-controller';

describe('Hamburger menu', () => {
    describe('Normal mode', () => {
        let browser: Browser;
        let targetPage: TargetPageController;
        let popupPage: Page;

        beforeAll(async () => {
            browser = await launchBrowser({ suppressFirstTimeDialog: true });
            targetPage = await browser.setupNewTargetPage();
            popupPage = await browser.newExtensionPopupPage(targetPage.tabId);
            await popupPage.clickSelector(popupPageElementIdentifiers.hamburgerMenuButton);
        });

        afterAll(async () => {
            if (browser) {
                await browser.close();
                browser = undefined;
            }
        });

        it('should have content matching snapshot', async () => {
            const hamburgerMenu = await formatPageElementForSnapshot(popupPage, popupPageElementIdentifiers.hamburgerMenu);
            expect(hamburgerMenu).toMatchSnapshot();
        });

        it('should pass accessibility validation', async () => {
            const results = await scanForAccessibilityIssues(popupPage, popupPageElementIdentifiers.hamburgerMenu);
            expect(results).toHaveLength(0);
        });
    });

    describe('high contrast mode', () => {
        let browser: Browser;
        let targetPage: TargetPageController;
        let popupPage: Page;

        beforeAll(async () => {
            browser = await launchBrowser({ suppressFirstTimeDialog: true });
            targetPage = await browser.setupNewTargetPage();
            const detailsViewPage = await browser.newExtensionDetailsViewPage(targetPage.tabId);

            await enableHighContrast(detailsViewPage);

            popupPage = await browser.newExtensionPopupPage(targetPage.tabId);
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
