// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { popupPageElementIdentifiers } from '../../common/element-identifiers/popup-page-element-identifiers';
import { Page } from '../../common/page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';

describe('First time Dialog Tests', () => {
    let browser: Browser;
    let targetPage: Page;
    let targetPageTabId: number;

    beforeEach(async () => {
        browser = await launchBrowser({ suppressFirstTimeDialog: false });
        await setupTargetPage();
    });

    afterEach(async () => {
        await browser.close();
    });

    async function setupTargetPage(): Promise<void> {
        targetPage = await browser.newTestResourcePage('all.html');
        await targetPage.bringToFront();
        targetPageTabId = await browser.getActivePageTabId();
    }

    async function newPopupPage(): Promise<Page> {
        return await browser.newExtensionPopupPage(targetPageTabId);
    }

    it('should be dismissed by clicking the OK button', async () => {
        const firstPopupPage = await newPopupPage();
        await firstPopupPage.bringToFront();

        await firstPopupPage.clickSelector(popupPageElementIdentifiers.startUsingProductButton);
        await firstPopupPage.waitForSelectorToDisappear(popupPageElementIdentifiers.telemetryDialog);
        await firstPopupPage.close();

        const secondPopupPage = await newPopupPage();
        await secondPopupPage.waitForSelector(popupPageElementIdentifiers.launchPad);
        await secondPopupPage.waitForSelectorToDisappear(popupPageElementIdentifiers.telemetryDialog);
    });

    it('verify first time dialog snapshot', async () => {
        const popupPage = await newPopupPage();
        await popupPage.waitForSelector(popupPageElementIdentifiers.telemetryDialog);

        const element = await popupPage.getPrintableHtmlElement(popupPageElementIdentifiers.telemetryDialog);
        expect(element).toMatchSnapshot();
    });

    it('should pass accessibility validation', async () => {
        const popupPage = await newPopupPage();
        await popupPage.waitForSelector(popupPageElementIdentifiers.telemetryDialog);

        const results = await scanForAccessibilityIssues(popupPage, popupPageElementIdentifiers.telemetryDialog);
        expect(results).toHaveLength(0);
    });
});
