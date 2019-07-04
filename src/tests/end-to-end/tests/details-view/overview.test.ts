// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { Page } from '../../common/page';

describe('Overview Page', () => {
    describe('Normal mode', () => {
        let browser: Browser;
        let targetTabId: number;
        let detailsViewPage: Page;

        beforeAll(async () => {
            browser = await launchBrowser({ suppressFirstTimeDialog: true });
            targetTabId = (await browser.setupNewTargetPage()).tabId;
            // detailsViewPage = await openOverviewPage(browser, targetTabId);
        });
    });

    // async function openOverviewPage(browser: Browser, targetTabId: number): Promise<Page> {
    //     const popupPage = await browser.newExtensionPopupPage(targetTabId);

    //     await popupPage.clickSelector(CommonSelectors.settingsGearButton);

    //     const detailsViewPage = await waitForDetailsViewWithPreviewFeaturesPanel(browser, popupPage, targetTabId);

    //     await detailsViewPage.waitForId(componentId);

    //     return detailsViewPage;
    // }
});
