// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BackgroundContext } from 'tests/end-to-end/common/page-controllers/background-context';
import { Page } from 'tests/end-to-end/common/page-controllers/page';
import { scanForAccessibilityIssues } from 'tests/end-to-end/common/scan-for-accessibility-issues';
import { DEFAULT_TARGET_PAGE_SCAN_TIMEOUT_MS } from 'tests/end-to-end/common/timeouts';
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import {
    detailsViewSelectors,
    overviewSelectors,
    quickAssessSelectors,
} from '../../common/element-identifiers/details-view-selectors';
import { DetailsViewPage } from '../../common/page-controllers/details-view-page';
import { TargetPage } from '../../common/page-controllers/target-page';

describe('Quick Assess', () => {
    let browser: Browser;
    let targetPage: TargetPage;
    let detailsViewPage: DetailsViewPage;
    let backgroundPage: BackgroundContext;

    describe('transfer to assessment dialog', () => {
        beforeAll(async () => {
            browser = await launchBrowser({
                suppressFirstTimeDialog: true,
                addExtraPermissionsToManifest: 'all-origins',
            });
            targetPage = await browser.newTargetPage({
                testResourcePath: 'native-widgets/input-type-radio.html', // does not have any images, so will pass
            });
            await browser.newPopupPage(targetPage); // Required for the details view to register as having permissions/being open
            backgroundPage = await browser.background();
            await backgroundPage.enableFeatureFlag('quickAssess');
            detailsViewPage = await openOverviewPage(browser, targetPage);
            await detailsViewPage.navigateToRequirement('Image function');
            await detailsViewPage.waitForRequirementStatus('Image function', '4', 'Passed', {
                timeout: DEFAULT_TARGET_PAGE_SCAN_TIMEOUT_MS,
            });
            await detailsViewPage.clickSelector(quickAssessSelectors.transferToAssessmentButton);
        });

        afterAll(async () => {
            await browser?.close();
        });

        it.each([true, false])('With high contrast mode=%s', async highContrastMode => {
            await scanForA11yIssuesWithHighContrast(highContrastMode, detailsViewPage);
        });

        test('quick assess data is transfered appropriately', async () => {
            await detailsViewPage.clickSelector(
                quickAssessSelectors.continueToAssessmentDialogButton,
            );

            // Verify view is switched to assessment.
            await detailsViewPage.waitForSelector(
                detailsViewSelectors.selectedSwitcherOption('Assessment'),
            );
            // Verify summary bar in assessment is not same as new assessment
            const expectedSummaryBarSelector =
                overviewSelectors.outcomeSummaryBar +
                `:not([aria-label="0% Passed, 100% Incomplete, 0% Failed"])`;
            await detailsViewPage.waitForSelector(expectedSummaryBarSelector);
        });
    });

    describe('complete button', () => {
        beforeAll(async () => {
            browser = await launchBrowser({
                suppressFirstTimeDialog: true,
                addExtraPermissionsToManifest: 'all-origins',
            });
            targetPage = await browser.newTargetPage({
                testResourcePath: 'native-widgets/input-type-radio.html', // does not have any images, so will pass
            });
            await browser.newPopupPage(targetPage); // Required for the details view to register as having permissions/being open
            backgroundPage = await browser.background();
            await backgroundPage.enableFeatureFlag('quickAssess');
            detailsViewPage = await openOverviewPage(browser, targetPage);
            await detailsViewPage.navigateToRequirement('Image function');
            await detailsViewPage.waitForRequirementStatus('Image function', '4', 'Passed', {
                timeout: DEFAULT_TARGET_PAGE_SCAN_TIMEOUT_MS,
            });

            await detailsViewPage.switchToQuickAssess();
            await detailsViewPage.navigateToRequirement('Reflow');
        });

        afterAll(async () => {
            await browser?.close();
        });

        it.each([true, false])('With high contrast mode=%s', async highContrastMode => {
            await scanForA11yIssuesWithHighContrast(highContrastMode, detailsViewPage);
        });

        test('quick assess data is transfered appropriately', async () => {
            await detailsViewPage.clickSelector(quickAssessSelectors.completeButton);
            await detailsViewPage.clickSelector(
                quickAssessSelectors.continueToAssessmentDialogButton,
            );

            // Verify view is switched to assessment.
            await detailsViewPage.waitForSelector(
                detailsViewSelectors.selectedSwitcherOption('Assessment'),
            );
            // Verify summary bar in assessment is not same as new assessment
            const expectedSummaryBarSelector =
                overviewSelectors.outcomeSummaryBar +
                `:not([aria-label="0% Passed, 100% Incomplete, 0% Failed"])`;
            await detailsViewPage.waitForSelector(expectedSummaryBarSelector);
        });
    });

    async function scanForA11yIssuesWithHighContrast(
        highContrastMode: boolean,
        overviewPage: Page,
    ): Promise<void> {
        await browser.setHighContrastMode(highContrastMode);
        await overviewPage.waitForHighContrastMode(highContrastMode);

        const results = await scanForAccessibilityIssues(overviewPage, '*');
        expect(results).toHaveLength(0);
    }
});

async function openOverviewPage(
    browser: Browser,
    targetPage: TargetPage,
): Promise<DetailsViewPage> {
    const detailsViewPage = await browser.newDetailsViewPage(targetPage);
    await detailsViewPage.switchToQuickAssess();
    await detailsViewPage.waitForSelector(overviewSelectors.overviewHeading);

    return detailsViewPage;
}
