// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { detailsViewSelectors } from '../../common/element-identifiers/details-view-selectors';
import { DetailsViewPage } from '../../common/page-controllers/details-view-page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';
import { DEFAULT_TARGET_PAGE_SCAN_TIMEOUT_MS } from '../../common/timeouts';

describe('Details View -> Assessment -> Headings', () => {
    let browser: Browser;
    let headingsPage: DetailsViewPage;

    beforeAll(async () => {
        browser = await launchBrowser({
            suppressFirstTimeDialog: true,
            addExtraPermissionsToManifest: 'fake-activeTab',
        });

        headingsPage = (await browser.newAssessment()).detailsViewPage;
    });

    afterAll(async () => {
        await browser?.close();
    });

    describe('Requirement page', () => {
        beforeAll(async () => {
            await headingsPage.navigateToAssessmentRequirement('Headings', 'Heading function');
            await headingsPage.waitForVisualHelperState('Off', {
                timeout: DEFAULT_TARGET_PAGE_SCAN_TIMEOUT_MS,
            });
        });

        afterAll(async () => {
            await headingsPage.closeNavTestLink('Headings');
        });

        it.each([true, false])(
            'should pass accessibility validation with highContrastMode=%s',
            async highContrastMode => {
                await browser.setHighContrastMode(highContrastMode);
                await headingsPage.waitForHighContrastMode(highContrastMode);

                // Workaround for axe-core #3883 to ensure the label-content-name-mismatch false
                // positive below is detected consistently
                await headingsPage.scrollToInstanceTable();

                const results = await scanForAccessibilityIssues(
                    headingsPage,
                    detailsViewSelectors.mainContent,
                );

                // this results object has a failure for label-content-name-mismatch
                // where the "show all visualizations" label does not match the content (a checkbox)
                // this is a false positive because the checkbox is symbolic, so this criteria
                // does not apply
                //
                // additionally, it has several failures for aria-required-children
                // this is a known issue with axe-core that has been filed here:
                // https://github.com/dequelabs/axe-core/issues/3850
                // the axe-core bug causes a failure for the FluentUI v8 DetailsList component
                // The FluentUI tracking issue can be found here:
                // https://github.com/microsoft/fluentui/issues/26330
                expect(results).toMatchSnapshot();
            },
        );
    });

    describe('Getting started page', () => {
        beforeAll(async () => {
            await headingsPage.navigateToGettingStarted('Headings');
        });

        afterAll(async () => {
            await headingsPage.closeNavTestLink('Headings');
        });

        it.each([true, false])(
            'Getting started page should pass accessibility validation with highContrastMode=%s',
            async highContrastMode => {
                await browser.setHighContrastMode(highContrastMode);
                await headingsPage.waitForHighContrastMode(highContrastMode);

                const results = await scanForAccessibilityIssues(
                    headingsPage,
                    detailsViewSelectors.mainContent,
                );
                expect(results).toStrictEqual([]);
            },
        );
    });
});
