// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { CommonSelectors } from '../../common/element-identifiers/common-selectors';
import { popupPageElementIdentifiers } from '../../common/element-identifiers/popup-page-element-identifiers';
import { formatPageElementForSnapshot } from '../../common/element-snapshot-formatter';
import { enableHighContrast } from '../../common/enable-high-contrast';
import { Page } from '../../common/page';
import { TargetPage } from '../../common/page-controllers/target-page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';

describe('Launch Pad', () => {
    describe('Normal mode', () => {
        let browser: Browser;
        let targetPage: TargetPage;
        let popupPage: Page;

        beforeAll(async () => {
            browser = await launchBrowser({ suppressFirstTimeDialog: true });
            targetPage = await browser.setupNewTargetPage();
            popupPage = await browser.newExtensionPopupPage(targetPage.tabId);
            await popupPage.bringToFront();
            await popupPage.waitForSelector(popupPageElementIdentifiers.launchPad);
        });

        afterAll(async () => {
            if (browser) {
                await browser.close();
            }
        });

        it('content should match snapshot', async () => {
            const element = await formatPageElementForSnapshot(popupPage, popupPageElementIdentifiers.launchPad);
            expect(element).toMatchSnapshot();
        });

        it('should pass accessibility validation', async () => {
            const results = await scanForAccessibilityIssues(popupPage, '*');
            expect(results).toHaveLength(0);
        });
    });
    describe('High contrast mode', () => {
        let browser: Browser;
        let targetPage: TargetPage;
        let popupPage: Page;

        beforeAll(async () => {
            browser = await launchBrowser({ suppressFirstTimeDialog: true });
            targetPage = await browser.setupNewTargetPage();
            const detailsViewPage = await browser.newExtensionDetailsViewPage(targetPage.tabId);
            await enableHighContrast(detailsViewPage);

            popupPage = await browser.newExtensionPopupPage(targetPage.tabId);
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
