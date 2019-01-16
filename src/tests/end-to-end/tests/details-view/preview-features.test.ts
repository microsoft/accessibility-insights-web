// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { Page } from '../../common/page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';
import { CommonSelectors } from '../../common/selectors/common-selectors';
import { detailsViewSelectors } from '../../common/selectors/details-view-selectors';

describe('PreviewFeaturesTest', () => {
    let browser: Browser;
    let targetTabId: number;

    beforeAll(async () => {
        browser = await launchBrowser({ suppressFirstTimeDialog: true });
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
        const detailsViewPage = await openPreviewFeaturesPanel();

        const previewFeaturesPanel = await detailsViewPage.getPrintableHtmlElement(detailsViewSelectors.previewFeaturesPanel);
        expect(previewFeaturesPanel).toMatchSnapshot();
    });

    it('a11y validation', async () => {
        const detailsViewPage = await openPreviewFeaturesPanel();

        const results = await scanForAccessibilityIssues(detailsViewPage, detailsViewSelectors.previewFeaturesPanel);
        expect(results).toMatchSnapshot();
    });

    async function openPreviewFeaturesPanel(): Promise<Page> {
        const popupPage = await browser.newExtensionPopupPage(targetTabId);

        await popupPage.clickSelector(CommonSelectors.settingsGearButton);

        const detailsViewPage = await waitForDetailsViewWithPreviewFeaturesPanel(popupPage);

        await detailsViewPage.waitForSelector(detailsViewSelectors.previewFeaturesPanelToggleList);

        return detailsViewPage;
    }

    async function waitForDetailsViewWithPreviewFeaturesPanel(popupPage: Page) {
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
