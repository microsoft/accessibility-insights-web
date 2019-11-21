// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { popupPageElementIdentifiers } from '../../common/element-identifiers/popup-page-element-identifiers';
import { formatPageElementForSnapshot } from '../../common/element-snapshot-formatter';
import { PopupPage } from '../../common/page-controllers/popup-page';
import { TargetPage } from '../../common/page-controllers/target-page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';

describe('Popup -> Launch Pad', () => {
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

    it.each([true, false])('should pass accessibility validation with highContrastMode=%s', async highContrastMode => {
        await browser.setHighContrastMode(highContrastMode);

        const results = await scanForAccessibilityIssues(popupPage, '*');
        expect(results).toHaveLength(0);
    });
});
