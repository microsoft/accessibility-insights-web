// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { getDefaultRules } from 'scanner/exposed-apis';
import { Browser } from 'tests/end-to-end/common/browser';
import { launchBrowser } from 'tests/end-to-end/common/browser-factory';
import {
    DEFAULT_E2E_TEST_TIMEOUT_MS,
    DEFAULT_TARGET_PAGE_SCAN_TIMEOUT_MS,
} from 'tests/end-to-end/common/timeouts';

describe('Details View -> Assessment -> Automated Checks', () => {
    let browser: Browser;

    beforeEach(async () => {
        browser = await launchBrowser({
            suppressFirstTimeDialog: true,
            addExtraPermissionsToManifest: 'fake-activeTab',
        });
    });

    afterEach(async () => {
        if (browser) {
            await browser.close();
            browser = undefined;
        }
    });

    it(
        'should scan and show all passing results against a target page with no violations',
        async () => {
            const { detailsViewPage } = await browser.newAssessment({
                testResourcePath: 'clean.html',
            });

            await detailsViewPage.navigateToTest('Automated checks', {
                timeout: DEFAULT_TARGET_PAGE_SCAN_TIMEOUT_MS,
            });
            await detailsViewPage.waitForScanCompleteAlert();

            for (const rule of getDefaultRules()) {
                await detailsViewPage.waitForRequirementStatus(rule.id, 'Passed');
            }
        },
        DEFAULT_E2E_TEST_TIMEOUT_MS + 30000,
    );

    it(
        'should scan and show mixed results against a target page with violations',
        async () => {
            const ruleThatFailsInIframe = 'duplicate-id';
            const ruleThatFailsInOuterPage = 'html-has-lang';
            const ruleThatPasses = 'area-alt';

            const { detailsViewPage } = await browser.newAssessment({
                testResourcePath: 'all.html',
            });

            await detailsViewPage.navigateToTest('Automated checks', {
                timeout: DEFAULT_TARGET_PAGE_SCAN_TIMEOUT_MS,
            });
            await detailsViewPage.waitForScanCompleteAlert();

            await detailsViewPage.waitForRequirementStatus(ruleThatFailsInOuterPage, 'Failed');
            await detailsViewPage.waitForRequirementStatus(ruleThatFailsInIframe, 'Failed');
            await detailsViewPage.waitForRequirementStatus(ruleThatPasses, 'Passed');

            // Failed requirements should have visual helpers available but off by default
            await detailsViewPage.navigateToRequirement(ruleThatFailsInOuterPage);
            await detailsViewPage.waitForVisualHelperState('Off');

            // Passed requirements should have disabled visual helpers
            await detailsViewPage.navigateToRequirement(ruleThatPasses);
            await detailsViewPage.waitForVisualHelperState('disabled');
        },
        DEFAULT_E2E_TEST_TIMEOUT_MS + 30000,
    );
});
