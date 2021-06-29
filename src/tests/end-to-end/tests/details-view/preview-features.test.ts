// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { previewFeaturesAutomationId } from 'DetailsView/components/details-view-overlay/preview-features-panel/preview-features-container';
import { formatPageElementForSnapshot } from 'tests/common/element-snapshot-formatter';
import { getAutomationIdSelector } from 'tests/common/get-automation-id-selector';
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { CommonSelectors } from '../../common/element-identifiers/common-selectors';
import { detailsViewSelectors } from '../../common/element-identifiers/details-view-selectors';
import { DetailsViewPage } from '../../common/page-controllers/details-view-page';
import { PopupPage } from '../../common/page-controllers/popup-page';
import { TargetPage } from '../../common/page-controllers/target-page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';

describe('Details View -> Preview Features Panel', () => {
    let browser: Browser;
    let targetPage: TargetPage;
    let detailsViewPage: DetailsViewPage;

    beforeAll(async () => {
        browser = await launchBrowser({ suppressFirstTimeDialog: true });
        targetPage = await browser.newTargetPage();
        detailsViewPage = await openPreviewFeaturesPanel(browser, targetPage);
    });

    afterAll(async () => {
        try {
            await browser?.close();
        } catch (e) {
            console.log(e);
        }
    });

    it('should match content in snapshot', async () => {
        const previewFeaturesPanel = await formatPageElementForSnapshot(
            detailsViewPage,
            detailsViewSelectors.previewFeaturesPanel,
        );
        expect(previewFeaturesPanel).toMatchSnapshot();
    });

    it.each([true, false])(
        'should pass accessibility validation with highContrastMode=%s',
        async highContrastMode => {
            await browser.setHighContrastMode(highContrastMode);
            await detailsViewPage.waitForHighContrastMode(highContrastMode);

            const results = await scanForAccessibilityIssues(
                detailsViewPage,
                detailsViewSelectors.previewFeaturesPanel,
            );
            expect(results).toHaveLength(0);
        },
    );
});

async function openPreviewFeaturesPanel(
    browser: Browser,
    targetPage: TargetPage,
): Promise<DetailsViewPage> {
    const popupPage = await browser.newPopupPage(targetPage);

    await popupPage.clickSelector(CommonSelectors.settingsGearButton);

    const detailsViewPage = await waitForDetailsViewWithPreviewFeaturesPanel(
        browser,
        popupPage,
        targetPage,
    );

    await detailsViewPage.waitForSelector(getAutomationIdSelector(previewFeaturesAutomationId));

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
