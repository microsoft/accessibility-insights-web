// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BackgroundContext } from 'tests/end-to-end/common/page-controllers/background-context';
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { detailsViewSelectors } from '../../common/element-identifiers/details-view-selectors';
import { DetailsViewPage } from '../../common/page-controllers/details-view-page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';
import { DEFAULT_TARGET_PAGE_SCAN_TIMEOUT_MS } from '../../common/timeouts';

describe('Details View -> Quick Assess -> Instructions', () => {
    let browser: Browser;
    let instructionsPage: DetailsViewPage;
    let backgroundPage: BackgroundContext;

    beforeAll(async () => {
        browser = await launchBrowser({
            suppressFirstTimeDialog: true,
            addExtraPermissionsToManifest: 'fake-activeTab',
        });

        backgroundPage = await browser.background();
        await backgroundPage.enableFeatureFlag('quickAssess');
        instructionsPage = (await browser.newQuickAssess()).detailsViewPage;
    });

    afterAll(async () => {
        await browser?.close();
    });

    describe('Requirement page', () => {
        beforeAll(async () => {
            await instructionsPage.navigateToRequirement('Instructions');
            await instructionsPage.waitForVisualHelperState('Off', {
                timeout: DEFAULT_TARGET_PAGE_SCAN_TIMEOUT_MS,
            });
        });

        it.each([true, false])(
            'should pass accessibility validation with highContrastMode=%s',
            async highContrastMode => {
                await browser.setHighContrastMode(highContrastMode);
                await instructionsPage.waitForHighContrastMode(highContrastMode);

                const results = await scanForAccessibilityIssues(
                    instructionsPage,
                    detailsViewSelectors.mainContent,
                );
                // this results object has a failure for label-content-name-misatch
                // where the "show all visualizations" label does not match the content (a checkbox)
                // this is a false positive because the checkbox is symbolic, so this criteria
                // does not apply
                expect(results).toMatchSnapshot();
            },
        );
    });
});
