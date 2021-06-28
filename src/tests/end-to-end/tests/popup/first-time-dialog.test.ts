// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { formatPageElementForSnapshot } from 'tests/common/element-snapshot-formatter';
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { popupPageElementIdentifiers } from '../../common/element-identifiers/popup-page-element-identifiers';
import { PopupPage } from '../../common/page-controllers/popup-page';
import { TargetPage } from '../../common/page-controllers/target-page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';

describe('First time Dialog', () => {
    let browser: Browser;
    let targetPage: TargetPage;

    beforeEach(async () => {
        browser = await launchBrowser({ suppressFirstTimeDialog: false });
        targetPage = await browser.newTargetPage();
    });

    afterEach(async () => {
        await 
        try {
            await browser?.close();
        } catch (e) {
            console.log(e);
        }();
    });

    async function newPopupPage(): Promise<PopupPage> {
        return await browser.newPopupPage(targetPage);
    }

    it('should be dismissed by clicking the OK button', async () => {
        const firstPopupPage = await newPopupPage();

        await firstPopupPage.clickSelector(popupPageElementIdentifiers.startUsingProductButton);
        await firstPopupPage.waitForSelectorToDisappear(
            popupPageElementIdentifiers.telemetryDialog,
        );
        await firstPopupPage.close();

        const secondPopupPage = await newPopupPage();
        await secondPopupPage.waitForSelector(popupPageElementIdentifiers.launchPad);
        await secondPopupPage.waitForSelectorToDisappear(
            popupPageElementIdentifiers.telemetryDialog,
        );
    });

    it('content should match snapshot', async () => {
        const popupPage = await newPopupPage();
        await popupPage.waitForSelector(popupPageElementIdentifiers.telemetryDialog);

        const element = await formatPageElementForSnapshot(
            popupPage,
            popupPageElementIdentifiers.telemetryDialog,
        );
        expect(element).toMatchSnapshot();
    });

    it('should pass accessibility validation', async () => {
        const popupPage = await newPopupPage();
        await popupPage.waitForSelector(popupPageElementIdentifiers.telemetryDialog);

        const results = await scanForAccessibilityIssues(
            popupPage,
            popupPageElementIdentifiers.telemetryDialog,
        );
        expect(results).toHaveLength(0);
    });
});
