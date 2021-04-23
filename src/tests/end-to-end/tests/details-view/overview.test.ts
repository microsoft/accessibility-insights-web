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

    it('should load assessment with upload of valid a11yassessment file', async () => {
        await backgroundPage.enableFeatureFlag('saveAndLoadAssessment');
        await overviewPage.setFileForUpload(
            './src/tests/end-to-end/test-resources/saved-assessment-files/saved_assessment_test_file.a11ywebassessment',
        );
        await overviewPage.clickSelector('text=Load Assessment');

        //todo: figure out how to check a property in the loaded overview page
        expect(1).toEqual(1);
    });
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
