// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { Page } from '../../common/page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';
import { popupPageSelectors } from '../../common/selectors/popup-page-selectors';
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

    it('adhoc launchpad link takes us to adhoc panel & is sticky', async () => {
        await popupPage.clickSelectorXPath(popupPageSelectors.adhocLaunchPadLinkXPath);

        await verifyAdhocPanelLoaded();

        // verify adhoc panel state is sticky
        setupNewTargetPage();
        popupPage = await browser.newExtensionPopupPage(targetPageTabId);
        await verifyAdhocPanelLoaded();
    });

    it('Back to Launch pad link takes us to launch pad & is sticky', async () => {
        await popupPage.clickSelectorXPath(popupPageSelectors.adhocLaunchPadLinkXPath);
        await popupPage.clickSelector(popupPageSelectors.backToLaunchPadLink);

        await verifyLaunchPadLoaded();

        // verify adhoc panel state is sticky
        setupNewTargetPage();
        popupPage = await browser.newExtensionPopupPage(targetPageTabId);
        await verifyLaunchPadLoaded();
    });

    it('a11y validation', async () => {
        await popupPage.clickSelectorXPath(popupPageSelectors.adhocLaunchPadLinkXPath);

        const results = await scanForAccessibilityIssues(popupPage, '*');
        expect(results).toHaveLength(0);
    });

    async function verifyAdhocPanelLoaded() {
        await popupPage.waitForSelector(popupPageSelectors.adhocPanel);
    }

    async function verifyLaunchPadLoaded() {
        await popupPage.waitForSelector(popupPageSelectors.launchPad);
    }
});
