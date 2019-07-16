// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { launchBrowser } from '../../common/browser-factory';
import { fastPassSelectors } from '../../common/element-identifiers/common-selectors';
import { popupPageElementIdentifiers } from '../../common/element-identifiers/popup-page-element-identifiers';
import { Page } from '../../common/page';
import { Browser, TargetPageInfo } from './../../common/browser';

describe('Tabstop tests', () => {
    describe('tabstop from fastpass', () => {
        let browser: Browser;
        let targetPageInfo: TargetPageInfo;

        beforeAll(async () => {
            browser = await launchBrowser({ suppressFirstTimeDialog: true });
            targetPageInfo = await browser.setupNewTargetPage();

            await startTabStopTest(browser, targetPageInfo.tabId);
        });

        afterAll(async () => {
            if (browser) {
                await browser.close();
            }
        });

        test('if visualHelper is turned on after starting tabstop and pressing tabs on target page', async () => {
            const { page: targetPage, tabId: activeTabId } = targetPageInfo;

            await targetPage.bringToFront();

            // press tabs 3 times. todo: DRY this code
            await targetPage.keyPress('Tab');
            await targetPage.keyPress('Tab');
            await targetPage.keyPress('Tab');

            // todo: add targetpage snapshot assertion
            expect(undefined).toBeUndefined();
        });
    });

    async function startTabStopTest(browser: Browser, targetTabId: number): Promise<void> {
        const popupPage = await browser.newExtensionPopupPage(targetTabId);

        let tabStopPage: Page;

        await Promise.all([
            browser.waitForPageMatchingUrl(await browser.getDetailsViewPageUrl(targetTabId)).then(page => (tabStopPage = page)),
            popupPage.clickSelector(popupPageElementIdentifiers.fastPass),
        ]);

        await tabStopPage.clickSelector(fastPassSelectors.tabstopNavButtonSelector);

        // waiting for an alternate selector just to make sure that the fastpass toggle is present before clicking it
        await tabStopPage.waitForSelector(fastPassSelectors.tabStopToggleAlternativeSelector);
        await tabStopPage.clickSelector(fastPassSelectors.tabStopToggle);
    }
});
