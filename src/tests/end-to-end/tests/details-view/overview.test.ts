// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
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
    let loadAssessmentCount: number = 0;

    beforeAll(async () => {
        browser = await launchBrowser({ suppressFirstTimeDialog: true });
        targetPage = await browser.newTargetPage();
        await browser.newPopupPage(targetPage); // Required for the details view to register as having permissions/being open
        overviewPage = await openOverviewPage(browser, targetPage);
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
        file
        ${'web@2.25.0-valid-mixed-results.a11ywebassessment'}
        ${'web@2.26.0-valid-mixed-results.a11ywebassessment'}
    `('should display pinned results when loading $file', async ({ file }) => {
        await overviewPage.setFileForUpload(
            `${__dirname}/../../test-resources/saved-assessment-files/${file}`,
        );
        await overviewPage.clickSelector(overviewSelectors.loadAssessmentButton);

        if (loadAssessmentCount > 0) {
            await overviewPage.clickSelector(overviewSelectors.loadAssessmentDialogLoadButton);
        }

        // Verify the summary bar counts
        const expectedSummaryBarSelector =
            overviewSelectors.outcomeSummaryBar +
            `:not([aria-label="0% Passed, 100% Incomplete, 0% Failed"])`;
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

        const elementHandle = await overviewPage.getSelectorElement(
            overviewSelectors.outcomeSummaryBar,
        );

        //reset aria label for next pass
        await elementHandle.evaluate(element => {
            element.setAttribute('aria-label', '0% Passed, 100% Incomplete, 0% Failed');
        });
        loadAssessmentCount++;
    });

    it.each`
        file
        ${'web@2.26.0-invalid-extra-property-mixed-results.a11ywebassessment'}
        ${'web@2.26.0-invalid-json-mixed-results.a11ywebassessment'}
    `(
        'should display invalid data dialog and not load assessment when loading $file',
        async ({ file }) => {
            const elementHandle = await overviewPage.getSelectorElement(
                overviewSelectors.outcomeSummaryBar,
            );

            let originalOutcomeSummaryAriaLabel: string;

            await elementHandle.evaluate(element => {
                originalOutcomeSummaryAriaLabel = element.getAttribute('aria-label');
            });

            await overviewPage.setFileForUpload(
                `${__dirname}/../../test-resources/saved-assessment-files/${file}`,
            );

            await overviewPage.clickSelector(overviewSelectors.loadAssessmentButton);

            await overviewPage.clickSelector(overviewSelectors.invalidLoadAssessmentDialogOkButton);

            let currentOutcomeSummaryAriaLabel: string;

            await elementHandle.evaluate(element => {
                currentOutcomeSummaryAriaLabel = element.getAttribute('aria-label');
            });

            expect(originalOutcomeSummaryAriaLabel).toEqual(currentOutcomeSummaryAriaLabel);
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
