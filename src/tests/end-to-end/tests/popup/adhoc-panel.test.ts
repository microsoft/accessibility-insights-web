// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { popupPageElementIdentifiers } from '../../common/element-identifiers/popup-page-element-identifiers';
import { Page } from '../../common/page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';
import { getTestResourceUrl } from '../../common/test-resources';

describe('Ad hoc tools', () => {
    let browser: Browser;
    let targetPage: Page;
    let targetPageTabId: number;
    let popupPage: Page;

    beforeEach(async () => {
        browser = await launchBrowser({ suppressFirstTimeDialog: true });
        await setupNewTargetPage();
        popupPage = await browser.newExtensionPopupPage(targetPageTabId);
        await popupPage.bringToFront();
    });

    afterEach(async () => {
        await browser.close();
    });

    async function setupNewTargetPage() {
        targetPage = await browser.newPage(getTestResourceUrl('all.html'));

        await targetPage.bringToFront();
        targetPageTabId = await browser.getActivePageTabId();
    }

    it('should have launchpad link that takes us to adhoc panel & is sticky', async () => {
        await popupPage.clickSelectorXPath(popupPageElementIdentifiers.adhocLaunchPadLinkXPath);

        await verifyAdhocPanelLoaded();

        // verify adhoc panel state is sticky
        await setupNewTargetPage();
        popupPage = await browser.newExtensionPopupPage(targetPageTabId);
        await verifyAdhocPanelLoaded();
    });

    it('should take back to Launch pad on clicking "Back to Launch pad" link & is sticky', async () => {
        await popupPage.clickSelectorXPath(popupPageElementIdentifiers.adhocLaunchPadLinkXPath);
        await popupPage.clickSelector(popupPageElementIdentifiers.backToLaunchPadLink);

        await verifyLaunchPadLoaded();

        // verify adhoc panel state is sticky
        await setupNewTargetPage();
        popupPage = await browser.newExtensionPopupPage(targetPageTabId);
        await verifyLaunchPadLoaded();
    });

    it('should pass accessibility validation', async () => {
        await popupPage.clickSelectorXPath(popupPageElementIdentifiers.adhocLaunchPadLinkXPath);

        const results = await scanForAccessibilityIssues(popupPage, '*');
        expect(results).toHaveLength(0);
    });

    async function verifyAdhocPanelLoaded() {
        await popupPage.waitForSelector(popupPageElementIdentifiers.adhocPanel);
    }

    async function verifyLaunchPadLoaded() {
        await popupPage.waitForSelector(popupPageElementIdentifiers.launchPad);
    }
});
