// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { componentId } from '../../../../DetailsView/components/no-displayable-preview-features-message';
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { CommonSelectors } from '../../common/element-identifiers/common-selectors';
import { detailsViewSelectors } from '../../common/element-identifiers/details-view-selectors';
import { enableHighContrast } from '../../common/enable-high-contrast';
import { Page } from '../../common/page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';

describe('Preview Features Panel', () => {
    describe('Normal mode', () => {
        let browser: Browser;
        let targetTabId: number;
        let detailsViewPage: Page;

        beforeAll(async () => {
            browser = await launchBrowser({ suppressFirstTimeDialog: true });
            targetTabId = (await browser.setupNewTargetPage()).tabId;
            detailsViewPage = await openPreviewFeaturesPanel(browser, targetTabId);
        });

        afterAll(async () => {
            if (browser) {
                await browser.close();
                browser = undefined;
            }
        });

        it('should match content in snapshot', async () => {
            const previewFeaturesPanel = await detailsViewPage.getPrintableHtmlElement(detailsViewSelectors.previewFeaturesPanel);
            expect(previewFeaturesPanel).toMatchSnapshot();
        });

        it('should pass accessibility validation', async () => {
            const results = await scanForAccessibilityIssues(detailsViewPage, detailsViewSelectors.previewFeaturesPanel);
            expect(results).toHaveLength(0);
        });
    });
    describe('High contrast mode', () => {
        let browser: Browser;
        let targetTabId: number;
        let detailsViewPage: Page;

        beforeAll(async () => {
            browser = await launchBrowser({ suppressFirstTimeDialog: true });

            targetTabId = (await browser.setupNewTargetPage()).tabId;
            await setupHighContrastMode();

            detailsViewPage = await openPreviewFeaturesPanel(browser, targetTabId);
        });

        afterAll(async () => {
            if (browser) {
                await browser.close();
            }
        });

        it('should pass accessibility validation', async () => {
            const results = await scanForAccessibilityIssues(detailsViewPage, detailsViewSelectors.previewFeaturesPanel);
            expect(results).toHaveLength(0);
        });

        async function setupHighContrastMode(): Promise<void> {
            const tempDetailsViewPage = await browser.newExtensionDetailsViewPage(targetTabId);
            await enableHighContrast(tempDetailsViewPage);
            await tempDetailsViewPage.close();
        }
    });

    async function openPreviewFeaturesPanel(browser: Browser, targetTabId: number): Promise<Page> {
        const popupPage = await browser.newExtensionPopupPage(targetTabId);

        await popupPage.clickSelector(CommonSelectors.settingsGearButton);

        const detailsViewPage = await waitForDetailsViewWithPreviewFeaturesPanel(browser, popupPage, targetTabId);

        await detailsViewPage.waitForId(componentId);

        return detailsViewPage;
    }

    async function waitForDetailsViewWithPreviewFeaturesPanel(browser: Browser, popupPage: Page, targetTabId: number): Promise<Page> {
        let detailsViewPage: Page;

        await Promise.all([
            browser.waitForPageMatchingUrl(await browser.getDetailsViewPageUrl(targetTabId)).then(page => (detailsViewPage = page)),
            popupPage.clickSelector(CommonSelectors.previewFeaturesDropdownButton),
        ]);

        return detailsViewPage;
    }
});
