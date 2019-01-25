// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { popupPageElementIdentifiers } from '../../common/element-identifiers/popup-page-element-identifiers';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';

describe('Hamburger menu', () => {
    let browser: Browser;

    beforeAll(async () => {
        browser = await launchBrowser({ suppressFirstTimeDialog: true });
    });

    afterEach(async () => {
        if (browser) {
            await browser.closeAllPages();
        }
    });

    afterAll(async () => {
        if (browser) {
            await browser.close();
            browser = undefined;
        }
    });

    it('should have content matching snapshot', async () => {
        const popupPage = await createPopupPage();

        await popupPage.clickSelector(popupPageElementIdentifiers.hamburgerMenuButton);

        const hamburgerMenu = await popupPage.getPrintableHtmlElement(popupPageElementIdentifiers.hamburgerMenu);

        expect(hamburgerMenu).toMatchSnapshot();
    });

    it('should pass accessibility validation', async () => {
        const popupPage = await createPopupPage();

        await popupPage.clickSelector(popupPageElementIdentifiers.hamburgerMenuButton);

        const results = await scanForAccessibilityIssues(popupPage, popupPageElementIdentifiers.hamburgerMenu);
        expect(results).toHaveLength(0);
    });

    async function createPopupPage() {
        const targetPage = await browser.newTestResourcePage('all.html');

        await targetPage.bringToFront();
        const targetPageTabId = await browser.getActivePageTabId();

        return await browser.newExtensionPopupPage(targetPageTabId);
    }
});
