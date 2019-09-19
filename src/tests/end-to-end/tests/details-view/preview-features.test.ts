// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { componentId } from '../../../../DetailsView/components/no-displayable-preview-features-message';
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { CommonSelectors } from '../../common/element-identifiers/common-selectors';
import { detailsViewSelectors } from '../../common/element-identifiers/details-view-selectors';
import { formatPageElementForSnapshot } from '../../common/element-snapshot-formatter';
import { DetailsViewPage } from '../../common/page-controllers/details-view-page';
import { PopupPage } from '../../common/page-controllers/popup-page';
import { TargetPage } from '../../common/page-controllers/target-page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';

describe('Preview Features Panel', () => {
    describe('Normal mode', () => {
        let browser: Browser;
        let targetPage: TargetPage;
        let detailsViewPage: DetailsViewPage;

        beforeAll(async () => {
            browser = await launchBrowser({ suppressFirstTimeDialog: true });
            targetPage = await browser.newTargetPage();
            detailsViewPage = await openPreviewFeaturesPanel(browser, targetPage);
        });

        afterAll(async () => {
            if (browser) {
                await browser.close();
                browser = undefined;
            }
        });

        it('should match content in snapshot', async () => {
            const previewFeaturesPanel = await formatPageElementForSnapshot(detailsViewPage, detailsViewSelectors.previewFeaturesPanel);
            expect(previewFeaturesPanel).toMatchSnapshot();
        });

        it('should pass accessibility validation', async () => {
            const results = await scanForAccessibilityIssues(detailsViewPage, detailsViewSelectors.previewFeaturesPanel);
            expect(results).toHaveLength(0);
        });
    });
    describe('High contrast mode', () => {
        let browser: Browser;
        let targetPage: TargetPage;
        let detailsViewPage: DetailsViewPage;

        beforeAll(async () => {
            browser = await launchBrowser({ suppressFirstTimeDialog: true });
            targetPage = await browser.newTargetPage();

            await setupHighContrastMode();

            detailsViewPage = await openPreviewFeaturesPanel(browser, targetPage);
        });

        afterAll(async () => {
            if (browser) {
                await browser.close();
                browser = undefined;
            }
        });

        it('should pass accessibility validation', async () => {
            const results = await scanForAccessibilityIssues(detailsViewPage, detailsViewSelectors.previewFeaturesPanel);
            expect(results).toHaveLength(0);
        });

        async function setupHighContrastMode(): Promise<void> {
            const tempDetailsViewPage = await browser.newDetailsViewPage(targetPage);
            await tempDetailsViewPage.enableHighContrast();
            await tempDetailsViewPage.close();
        }
    });

    async function openPreviewFeaturesPanel(browser: Browser, targetPage: TargetPage): Promise<DetailsViewPage> {
        const popupPage = await browser.newPopupPage(targetPage);

        await popupPage.clickSelector(CommonSelectors.settingsGearButton);

        const detailsViewPage = await waitForDetailsViewWithPreviewFeaturesPanel(browser, popupPage, targetPage);

        await detailsViewPage.waitForId(componentId);

        return detailsViewPage;
    }

    async function waitForDetailsViewWithPreviewFeaturesPanel(
        browser: Browser,
        popupPage: PopupPage,
        targetPage: TargetPage,
    ): Promise<DetailsViewPage> {
        let detailsViewPage: DetailsViewPage;

        await Promise.all([
            browser.waitForDetailsViewPage(targetPage).then(page => (detailsViewPage = page)),
            popupPage.clickSelector(CommonSelectors.previewFeaturesDropdownButton),
        ]);

        return detailsViewPage;
    }
});
