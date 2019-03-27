// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { CommonSelectors } from '../../common/element-identifiers/common-selectors';
import { popupPageElementIdentifiers } from '../../common/element-identifiers/popup-page-element-identifiers';
import { enableHighContrast } from '../../common/enable-high-contrast';
import { Page } from '../../common/page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';
import { setupNewTargetPage, TargetPageInfo } from '../../common/setup-new-target-page';

describe('Launch Pad', () => {
    describe('Normal mode', () => {
        let browser: Browser;
        let targetPageInfo: TargetPageInfo;
        let popupPage: Page;

        beforeAll(async () => {
            browser = await launchBrowser({ suppressFirstTimeDialog: true });
            targetPageInfo = await setupNewTargetPage(browser);
            popupPage = await browser.newExtensionPopupPage(targetPageInfo.tabId);
            await popupPage.bringToFront();
            await popupPage.waitForSelector(popupPageElementIdentifiers.launchPad);
        });

        afterAll(async () => {
            if (browser) {
                await browser.close();
            }
        });

        it('content should match snapshot', async () => {
            const element = await popupPage.getPrintableHtmlElement(popupPageElementIdentifiers.launchPad);
            expect(element).toMatchSnapshot();
        });

        it('should pass accessibility validation', async () => {
            const results = await scanForAccessibilityIssues(popupPage, '*');
            expect(results).toHaveLength(0);
        });
    });
    describe('High contrast mode', () => {
        let browser: Browser;
        let targetPageInfo: TargetPageInfo;
        let popupPage: Page;

        beforeAll(async () => {
            browser = await launchBrowser({ suppressFirstTimeDialog: true });
            targetPageInfo = await setupNewTargetPage(browser);
            const detailsViewPage = await browser.newExtensionDetailsViewPage(targetPageInfo.tabId);
            await enableHighContrast(detailsViewPage);

            popupPage = await browser.newExtensionPopupPage(targetPageInfo.tabId);
            await popupPage.bringToFront();

            await popupPage.waitForSelector(CommonSelectors.highContrastThemeSelector);
            await popupPage.waitForSelector(popupPageElementIdentifiers.launchPad);
        });

        afterAll(async () => {
            if (browser) {
                await browser.close();
            }
        });

        it('should pass accessibility validation', async () => {
            const results = await scanForAccessibilityIssues(popupPage, '*');
            expect(results).toMatchSnapshot();
        });
    });
});
