// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { CommonSelectors } from '../../common/element-identifiers/common-selectors';
import { detailsViewSelectors } from '../../common/element-identifiers/details-view-selectors';
import { Page } from '../../common/page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';

describe('Preview Features Panel', () => {
    let browser: Browser;
    let targetTabId: number;

    beforeAll(async () => {
        browser = await launchBrowser({ suppressFirstTimeDialog: true });
    });

    beforeEach(async () => {
        targetTabId = await generateTargetTabId();
    });

    afterEach(async () => {
        if (browser) { await browser.closeAllPages(); }
    });

    afterAll(async () => {
        if (browser) { await browser.close(); browser = undefined; }
    });

    it('should match content in snapshot', async () => {
        const detailsViewPage = await openPreviewFeaturesPanel();

        const previewFeaturesPanel = await detailsViewPage.getPrintableHtmlElement(detailsViewSelectors.previewFeaturesPanel);
        expect(previewFeaturesPanel).toMatchSnapshot();
    });

    it('should pass accessibility validation', async () => {
        const detailsViewPage = await openPreviewFeaturesPanel();

        const results = await scanForAccessibilityIssues(detailsViewPage, detailsViewSelectors.previewFeaturesPanel);
        expect(results).toHaveLength(0);
    });

    async function openPreviewFeaturesPanel(): Promise<Page> {
        const popupPage = await browser.newExtensionPopupPage(targetTabId);

        await popupPage.clickSelector(CommonSelectors.settingsGearButton);

        const detailsViewPage = await waitForDetailsViewWithPreviewFeaturesPanel(popupPage);

        await detailsViewPage.waitForSelector(detailsViewSelectors.previewFeaturesPanelToggleList);

        return detailsViewPage;
    }

    async function waitForDetailsViewWithPreviewFeaturesPanel(popupPage: Page): Promise<Page> {
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
