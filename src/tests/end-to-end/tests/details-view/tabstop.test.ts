// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { launchBrowser } from '../../common/browser-factory';
import { fastPassSelectors } from '../../common/element-identifiers/common-selectors';
import { popupPageElementIdentifiers } from '../../common/element-identifiers/popup-page-element-identifiers';
import { Page } from '../../common/page-controllers/page';
import { TargetPage } from '../../common/page-controllers/target-page';
import { Browser } from './../../common/browser';
import { DEFAULT_PAGE_ELEMENT_WAIT_TIMEOUT_MS } from './../../common/timeouts';

describe('Tabstop tests', () => {
    describe('tabstop from fastpass', () => {
        let browser: Browser;
        let targetPage: TargetPage;
        let fastPassPage: Page;

        beforeAll(async () => {
            browser = await launchBrowser({ suppressFirstTimeDialog: true });
            targetPage = await browser.newTargetPage();
            fastPassPage = await gotoFastPass(browser, targetPage.tabId);
        });

        afterAll(async () => {
            if (browser) {
                await browser.close();
            }
        });

        test('if visualHelper is turned on after starting tabstop and pressing tabs on target page', async () => {
            const toggleAriaLabel = 'Tab stops';

            await goToTabStopTest();
            await enableToggleByAriaLabel(toggleAriaLabel);

            await targetPage.bringToFront();

            // press tabs 3 times. todo: DRY this code
            await targetPage.keyPress('Tab');
            await targetPage.keyPress('Tab');
            await targetPage.keyPress('Tab');

            expect(await targetPage.getShadowRootHtmlSnapshot()).toMatchSnapshot();
        });

        async function gotoFastPass(browserLocal: Browser, targetTabId: number): Promise<Page> {
            const popupPage = await browserLocal.newPopupPage(targetPage);
            let fastPass: Page;
            await Promise.all([
                browserLocal.waitForDetailsViewPage(targetPage).then(page => (fastPass = page)),
                popupPage.clickSelector(popupPageElementIdentifiers.fastPass),
            ]);

            return fastPass;
        }

        async function goToTabStopTest(): Promise<void> {
            await fastPassPage.clickSelector(fastPassSelectors.tabstopNavButtonSelector);
        }

        async function enableToggleByAriaLabel(ariaLabel: string): Promise<void> {
            const toggleSelector = `button[aria-label="${ariaLabel}"]`;
            const enabledToggleSelector = `${toggleSelector}[aria-checked=true]`;
            const disabledToggleSelector = `${toggleSelector}[aria-checked=false]`;
            const EXTRA_TOGGLE_OPERATION_TIMEOUT_MS = 5000;

            await fastPassPage.waitForDuration(EXTRA_TOGGLE_OPERATION_TIMEOUT_MS);
            await fastPassPage.clickSelector(disabledToggleSelector);

            await fastPassPage.waitForSelector(enabledToggleSelector, {
                timeout: DEFAULT_PAGE_ELEMENT_WAIT_TIMEOUT_MS + EXTRA_TOGGLE_OPERATION_TIMEOUT_MS,
            });
        }
    });
});
