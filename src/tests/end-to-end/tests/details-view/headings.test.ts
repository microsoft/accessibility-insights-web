// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Link } from '@fluentui/react-components';
import { mockReactComponents } from '../../../unit/mock-helpers/mock-module-helpers';
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { detailsViewSelectors } from '../../common/element-identifiers/details-view-selectors';
import { DetailsViewPage } from '../../common/page-controllers/details-view-page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';
import { DEFAULT_TARGET_PAGE_SCAN_TIMEOUT_MS } from '../../common/timeouts';
jest.mock('@fluentui/react-components');

describe('Details View -> Assessment -> Headings', () => {
    mockReactComponents([Link]);
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
                expect(results).toMatchSnapshot();
            },
        );
    });
});
