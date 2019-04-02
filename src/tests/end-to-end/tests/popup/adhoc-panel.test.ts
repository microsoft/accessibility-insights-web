// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Browser, TargetPageInfo } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { popupPageElementIdentifiers } from '../../common/element-identifiers/popup-page-element-identifiers';
import { enableHighContrast } from '../../common/enable-high-contrast';
import { Page } from '../../common/page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';

describe('Ad hoc tools', () => {
    let browser: Browser;
    let targetPageInfo: TargetPageInfo;
    let popupPage: Page;

    beforeEach(async () => {
        browser = await launchBrowser({ suppressFirstTimeDialog: true });
        targetPageInfo = await browser.setupNewTargetPage();
        popupPage = await browser.newExtensionPopupPage(targetPageInfo.tabId);
        await popupPage.bringToFront();
    });

    afterEach(async () => {
        if (browser) {
            await browser.close();
            browser = undefined;
        }
    });

    it('should have launchpad link that takes us to adhoc panel & is sticky', async () => {
        await gotoAdhocPanel();

        // verify adhoc panel state is sticky
        targetPageInfo = await browser.setupNewTargetPage();
        popupPage = await browser.newExtensionPopupPage(targetPageInfo.tabId);
        await verifyAdhocPanelLoaded();
    });

    it('should take back to Launch pad on clicking "Back to Launch pad" link & is sticky', async () => {
        await popupPage.clickSelectorXPath(popupPageElementIdentifiers.adhocLaunchPadLinkXPath);
        await popupPage.clickSelector(popupPageElementIdentifiers.backToLaunchPadLink);

        await verifyLaunchPadLoaded();

        // verify adhoc panel state is sticky
        targetPageInfo = await browser.setupNewTargetPage();
        popupPage = await browser.newExtensionPopupPage(targetPageInfo.tabId);
        await verifyLaunchPadLoaded();
    });

    it('should pass accessibility validation', async () => {
        await gotoAdhocPanel();

        const results = await scanForAccessibilityIssues(popupPage, '*');
        expect(results).toHaveLength(0);
    });

    it('should pass accessibility validation in high contrast', async () => {
        const detailsViewPage = await browser.newExtensionDetailsViewPage(targetPageInfo.tabId);
        await enableHighContrast(detailsViewPage);

        await popupPage.bringToFront();
        await gotoAdhocPanel();

        const results = await scanForAccessibilityIssues(popupPage, '*');
        expect(results).toMatchSnapshot();
    });

    async function gotoAdhocPanel(): Promise<void> {
        await popupPage.clickSelectorXPath(popupPageElementIdentifiers.adhocLaunchPadLinkXPath);
        await verifyAdhocPanelLoaded();
    }

    async function verifyAdhocPanelLoaded(): Promise<void> {
        await popupPage.waitForSelector(popupPageElementIdentifiers.adhocPanel);
    }

    async function verifyLaunchPadLoaded(): Promise<void> {
        await popupPage.waitForSelector(popupPageElementIdentifiers.launchPad);
    }
});
