// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { CommonSelectors } from '../../common/element-identifiers/common-selectors';
import { popupPageElementIdentifiers } from '../../common/element-identifiers/popup-page-element-identifiers';
import { formatPageElementForSnapshot } from '../../common/element-snapshot-formatter';
import { PopupPage } from '../../common/page-controllers/popup-page';
import { TargetPage } from '../../common/page-controllers/target-page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';

describe('Launch Pad', () => {
    describe('Normal mode', () => {
        let browser: Browser;
        let targetPage: TargetPage;
        let popupPage: PopupPage;

        beforeAll(async () => {
            browser = await launchBrowser({ suppressFirstTimeDialog: true });
            targetPage = await browser.newTargetPage();
            popupPage = await browser.newPopupPage(targetPage);
            await popupPage.bringToFront();
            await popupPage.waitForSelector(popupPageElementIdentifiers.launchPad);
        });

        afterAll(async () => {
            if (browser) {
                await browser.close();
                browser = undefined;
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
        let popupPage: PopupPage;

        beforeAll(async () => {
            browser = await launchBrowser({ suppressFirstTimeDialog: true });
            targetPage = await browser.newTargetPage();
            const detailsViewPage = await browser.newDetailsViewPage(targetPage);
            await detailsViewPage.enableHighContrast();

            popupPage = await browser.newPopupPage(targetPage);
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
            expect(results).toHaveLength(0);
        });
    });
});
