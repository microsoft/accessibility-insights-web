// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { popupPageElementIdentifiers } from '../../common/element-identifiers/popup-page-element-identifiers';
import { enableHighContrast } from '../../common/enable-high-contrast';
import { Page } from '../../common/page';
import { TargetPage } from '../../common/page-controllers/target-page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';
import { DEFAULT_PAGE_ELEMENT_WAIT_TIMEOUT_MS } from '../../common/timeouts';

describe('Ad hoc tools', () => {
    let browser: Browser;
    let targetPage: TargetPage;
    let popupPage: Page;

    beforeEach(async () => {
        browser = await launchBrowser({ suppressFirstTimeDialog: true });
        targetPage = await browser.setupNewTargetPage();
        popupPage = await browser.newExtensionPopupPage(targetPage.tabId);
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
        targetPage = await browser.setupNewTargetPage();
        popupPage = await browser.newExtensionPopupPage(targetPage.tabId);
        await verifyAdhocPanelLoaded();
    });

    it('should take back to Launch pad on clicking "Back to Launch pad" link & is sticky', async () => {
        await popupPage.clickSelectorXPath(popupPageElementIdentifiers.adhocLaunchPadLinkXPath);
        await popupPage.clickSelector(popupPageElementIdentifiers.backToLaunchPadLink);

        await verifyLaunchPadLoaded();

        // verify adhoc panel state is sticky
        targetPage = await browser.setupNewTargetPage();
        popupPage = await browser.newExtensionPopupPage(targetPage.tabId);
        await verifyLaunchPadLoaded();
    });

    it('should pass accessibility validation', async () => {
        await gotoAdhocPanel();

        const results = await scanForAccessibilityIssues(popupPage, '*');
        expect(results).toHaveLength(0);
    });

    it('should pass accessibility validation in high contrast', async () => {
        const detailsViewPage = await browser.newExtensionDetailsViewPage(targetPage.tabId);
        await enableHighContrast(detailsViewPage);

        await popupPage.bringToFront();
        await gotoAdhocPanel();

        const results = await scanForAccessibilityIssues(popupPage, '*');
        expect(results).toMatchSnapshot();
    });

    it.each(['Automated checks', 'Landmarks', 'Headings', 'Color'])(
        'should display the pinned target page visualizations when enabling the "%s" toggle',
        async (toggleAriaLabel: string) => {
            await gotoAdhocPanel();

            await enableToggleByAriaLabel(toggleAriaLabel);

            expect(await targetPage.getShadowRootHtmlSnapshot()).toMatchSnapshot();
        },
    );

    async function enableToggleByAriaLabel(ariaLabel: string): Promise<void> {
        const toggleSelector = `button[aria-label="${ariaLabel}"]`;
        const enabledToggleSelector = `${toggleSelector}[aria-checked=true]`;
        const disabledToggleSelector = `${toggleSelector}[aria-checked=false]`;

        await popupPage.clickSelector(disabledToggleSelector);

        // The toggles will go through a state where they are removed and replaced with a spinner, then re-added to the page
        // We intentionally omit looking for the loading spinner because it can be fast enough to not be seen by Puppeteer

        const EXTRA_TOGGLE_OPERATION_TIMEOUT_MS = 5000;

        await popupPage.waitForSelector(enabledToggleSelector, {
            timeout: DEFAULT_PAGE_ELEMENT_WAIT_TIMEOUT_MS + EXTRA_TOGGLE_OPERATION_TIMEOUT_MS,
        });
    }

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
