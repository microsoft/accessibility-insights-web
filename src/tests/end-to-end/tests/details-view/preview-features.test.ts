// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { Page } from '../../common/page';
import { CommonSelectors } from '../../common/selectors/common-selectors';
import { detailsViewSelectors } from '../../common/selectors/details-view-selectors';

describe('PreviewFeaturesTest', () => {
    let browser: Browser;
    let targetTabId: number;

    beforeAll(async () => {
        browser =  await launchBrowser({dismissFirstTimeDialog: true});
    });

    beforeEach(async () => {
        targetTabId = await generateTargetTabId();
    });

    afterEach(async () => {
        await browser.closeAllPages();
    });

    afterAll(async () => {
        await browser.close();
    });

    it('preview features content in details view', async () => {
        const popupPage = await browser.newExtensionPopupPage(targetTabId);


        await popupPage.clickSelector(CommonSelectors.settingsGearButton);

        const detailsViewPage = await openDetailsViewWithSettingsPanel(popupPage);

        await detailsViewPage.waitForSelector(detailsViewSelectors.previewFeaturesPanelToggleList);

        const previewFeaturesPanel = await detailsViewPage.getPrintableHtmlElement(detailsViewSelectors.previewFeaturesPanel);
        expect(previewFeaturesPanel).toMatchSnapshot();
    });

    async function openDetailsViewWithSettingsPanel(popupPage: Page) {
        let detailsViewPage: Page;

        await Promise.all(
            [
                browser.waitForPageMatchingUrl(await browser.getDetailsViewPageUrl(targetTabId))
                    .then(page => detailsViewPage = page),
                popupPage.clickSelector(CommonSelectors.previewFeaturesDropdownButton),
            ],
        );

        return detailsViewPage;
    }

    async function generateTargetTabId(): Promise<number> {
        const targetPage = await browser.newTestResourcePage('all.html');
        await targetPage.bringToFront();
        return await browser.getActivePageTabId();
    }
});
