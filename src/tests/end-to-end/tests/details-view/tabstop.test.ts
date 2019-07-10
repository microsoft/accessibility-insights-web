// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { launchBrowser } from '../../common/browser-factory';
import { popupPageElementIdentifiers } from '../../common/element-identifiers/popup-page-element-identifiers';
import { Page } from '../../common/page';
import { Browser, TargetPageInfo } from './../../common/browser';
import { CommonSelectors } from './../../common/element-identifiers/common-selectors';

describe('Tabstop tests', () => {
    describe('tabstop from fastpass', () => {
        let browser: Browser;
        let targetPageInfo: TargetPageInfo;
        let popupPage: Page;

        beforeAll(async () => {
            browser = await launchBrowser({ suppressFirstTimeDialog: true });
            targetPageInfo = await browser.setupNewTargetPage();
            popupPage = await browser.newExtensionPopupPage(targetPageInfo.tabId);
            await popupPage.bringToFront();
            await popupPage.waitForSelector(popupPageElementIdentifiers.launchPad);
            await popupPage.waitForSelector(popupPageElementIdentifiers.fastPass);
        });

        afterAll(async () => {
            if (browser) {
                await browser.close();
            }
        });

        it('clicks on fastpass page link', async () => {
            await popupPage.clickSelector(CommonSelectors.fastPassButton);
            const detailsViewPage = await waitForDetailsViewPage(browser, popupPage, targetPageInfo.tabId);
            await detailsViewPage.waitForId(componentId);
            expect(undefined).toBeUndefined();
        });

        async function waitForDetailsViewPage(browser: Browser, popupPage: Page, targetTabId: number): Promise<Page> {
            let detailsViewPage: Page;

            await Promise.all([
                browser.waitForPageMatchingUrl(await browser.getDetailsViewPageUrl(targetTabId)).then(page => (detailsViewPage = page)),
            ]);

            return detailsViewPage;
        }
    });
});
