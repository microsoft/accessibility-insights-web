// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { tabstops } from '../../../../content/adhoc/tabstops';
import { launchBrowser } from '../../common/browser-factory';
import { fastPassSelectors } from '../../common/element-identifiers/common-selectors';
import { popupPageElementIdentifiers } from '../../common/element-identifiers/popup-page-element-identifiers';
import { Page } from '../../common/page';
import { TargetPageController } from '../../common/target-page-controller';
import { DEFAULT_PAGE_ELEMENT_WAIT_TIMEOUT_MS } from '../../common/timeouts';
import { Browser } from './../../common/browser';

describe('Tabstop tests', () => {
    describe('tabstop from fastpass', () => {
        let browser: Browser;
        let targetPage: TargetPageController;
        let tabStopPage: Page;

        beforeAll(async () => {
            browser = await launchBrowser({ suppressFirstTimeDialog: true });
            targetPage = await browser.setupNewTargetPage();

            tabStopPage = await getTabStopPage(browser, targetPage.tabId);
        });

        afterAll(async () => {
            if (browser) {
                await browser.close();
            }
        });

        test('if visualHelper is turned on after starting tabstop and pressing tabs on target page', async () => {
            const { page: activeTargetPage } = targetPage;
            await activeTargetPage.bringToFront();

            // press tabs 3 times. todo: DRY this code
            await activeTargetPage.keyPress('Tab');
            await activeTargetPage.keyPress('Tab');
            await activeTargetPage.keyPress('Tab');

            expect(await targetPage.getShadowRootHtmlSnapshot()).toMatchSnapshot();
        });
    });

    async function getTabStopPage(browser: Browser, targetTabId: number): Promise<Page> {
        const popupPage = await browser.newExtensionPopupPage(targetTabId);

        let tabStopPage: Page;

        await Promise.all([
            browser.waitForPageMatchingUrl(await browser.getDetailsViewPageUrl(targetTabId)).then(page => (tabStopPage = page)),
            popupPage.clickSelector(popupPageElementIdentifiers.fastPass),
        ]);

        await tabStopPage.clickSelector(fastPassSelectors.tabstopNavButtonSelector);

        const EXTRA_TOGGLE_OPERATION_TIMEOUT_MS = 5000;
        await tabStopPage.waitForSelector(fastPassSelectors.tabStopToggleAlternativeSelector, {
            visible: true,
            timeout: DEFAULT_PAGE_ELEMENT_WAIT_TIMEOUT_MS + EXTRA_TOGGLE_OPERATION_TIMEOUT_MS,
        });

        const button = await tabStopPage.$(fastPassSelectors.tabStopToggleAlternativeSelector);
        if (button) {
            await button.click();
        }
        return tabStopPage;
    }
});
