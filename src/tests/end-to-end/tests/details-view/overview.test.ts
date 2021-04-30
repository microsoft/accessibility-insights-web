// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BackgroundPage } from 'tests/end-to-end/common/page-controllers/background-page';
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { overviewSelectors } from '../../common/element-identifiers/details-view-selectors';
import { DetailsViewPage } from '../../common/page-controllers/details-view-page';
import { TargetPage } from '../../common/page-controllers/target-page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';

describe('Details View -> Overview Page', () => {
    let browser: Browser;
    let targetPage: TargetPage;
    let overviewPage: DetailsViewPage;
    let backgroundPage: BackgroundPage;

    beforeAll(async () => {
        browser = await launchBrowser({ suppressFirstTimeDialog: true });
        targetPage = await browser.newTargetPage();
        await browser.newPopupPage(targetPage); // Required for the details view to register as having permissions/being open
        overviewPage = await openOverviewPage(browser, targetPage);
        backgroundPage = await browser.backgroundPage();
    });

    afterAll(async () => {
        await browser?.close();
    });

    it.each([true, false])(
        'should pass accessibility validation with highContrastMode=%s',
        async highContrastMode => {
            await browser.setHighContrastMode(highContrastMode);
            await overviewPage.waitForHighContrastMode(highContrastMode);

            const results = await scanForAccessibilityIssues(
                overviewPage,
                overviewSelectors.overview,
            );
            expect(results).toHaveLength(0);
        },
    );

    it.each`
        file                                                  | expectedSummaryLabel
        ${'web@2.25.0-valid-mixed-results.a11ywebassessment'} | ${'7% Passed, 93% Incomplete, 0% Failed'}
        ${'web@2.26.0-valid-mixed-results.a11ywebassessment'} | ${'6% Passed, 93% Incomplete, 1% Failed'}
    `(
        'should display pinned results when loading $file',
        async ({ file, expectedSummaryLabel }) => {
            await backgroundPage.enableFeatureFlag('saveAndLoadAssessment');
            await overviewPage.setFileForUpload(
                `${__dirname}/../../test-resources/saved-assessment-files/${file}`,
            );
            await overviewPage.clickSelector(overviewSelectors.loadAssessmentButton);

            // Verify the summary bar counts
            const expectedSummaryBarSelector =
                overviewSelectors.outcomeSummaryBar + `[aria-label="${expectedSummaryLabel}"]`;
            await overviewPage.waitForSelector(expectedSummaryBarSelector);

            // Verify the "Automated checks" counts
            const automatedChecksOutcomeChips = await overviewPage.getSelectorElements(
                overviewSelectors.testOutcomeChips('Automated checks'),
            );
            const automatedChecksOutcomeTitles = await Promise.all(
                automatedChecksOutcomeChips.map(async chip => await chip.getAttribute('title')),
            );

            automatedChecksOutcomeTitles.map(title =>
                expect(parseInt(title.charAt(0))).toBeGreaterThan(0),
            );
        },
    );
});

async function openOverviewPage(
    browser: Browser,
    targetPage: TargetPage,
): Promise<DetailsViewPage> {
    const detailsViewPage = await browser.newDetailsViewPage(targetPage);
    await detailsViewPage.switchToAssessment();
    await detailsViewPage.waitForSelector(overviewSelectors.overviewHeading);

    return detailsViewPage;
}
