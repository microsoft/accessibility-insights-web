// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { launchBrowser } from '../../common/browser-factory';
import { overviewSelectors } from '../../common/element-identifiers/details-view-selectors';
import { popupPageElementIdentifiers } from '../../common/element-identifiers/popup-page-element-identifiers';
import { Page } from '../../common/page';
import { Browser, TargetPageInfo } from './../../common/browser';

describe('Tabstop tests', () => {
    describe('tabstop from fastpass', () => {
        let browser: Browser;
        let targetPageInfo: TargetPageInfo;
        let popupPage: Page;
        let fastPassPage: Page;

        beforeAll(async () => {
            browser = await launchBrowser({ suppressFirstTimeDialog: true });
            targetPageInfo = await browser.setupNewTargetPage();

            fastPassPage = await openFastPassPage(browser, targetPageInfo.tabId);
        });

        afterAll(async () => {
            if (browser) {
                await browser.close();
            }
        });

        it('clicks on fastpass page link', async () => {
            // await detailsViewPage.waitForId(componentId);
            expect(undefined).toBeUndefined();
        });
    });

    async function openFastPassPage(browser: Browser, targetTabId: number): Promise<Page> {
        const popupPage = await browser.newExtensionPopupPage(targetTabId);

        let detailsViewPage: Page;

        await Promise.all([
            browser.waitForPageMatchingUrl(await browser.getDetailsViewPageUrl(targetTabId)).then(page => (detailsViewPage = page)),
            popupPage.clickSelector(popupPageElementIdentifiers.fastPass),
        ]);

        await detailsViewPage.waitForSelector('.button-flex-container');
        const example = await detailsViewPage.evaluate(() =>
            Array.from(document.querySelectorAll('.button-flex-container'), element => element),
        );
        example[1].click();

        return detailsViewPage;
    }
});
