// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { getDefaultRules } from 'scanner/exposed-apis';
import { Browser } from 'tests/end-to-end/common/browser';
import { launchBrowser } from 'tests/end-to-end/common/browser-factory';

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

    it('should scan and show all passing results against a target page with no violations', async () => {
        const { detailsViewPage } = await browser.newAssessment({
            testResourcePath: 'clean.html',
        });
        await detailsViewPage.navigateToTest('Automated checks');

        // Navigating to the test should automatically scan all rules
        await detailsViewPage.waitForScanCompleteAlert();
        await detailsViewPage.waitForVisualHelperState('disabled');

        for (const rule of getDefaultRules()) {
            await detailsViewPage.waitForRequirementStatus(rule.id, 'Passed');
        }
    });

    it('should scan and show mixed results against a target page with violations', async () => {
        const { detailsViewPage } = await browser.newAssessment({
            testResourcePath: 'all.html',
        });
        await detailsViewPage.navigateToTest('Automated checks');

        // Navigating to the test should automatically scan all rules
        await detailsViewPage.waitForScanCompleteAlert();

        // Failure in the outer page
        await detailsViewPage.waitForRequirementStatus('html-has-lang', 'Failed');
        // Failure in an iframe
        await detailsViewPage.waitForRequirementStatus('duplicate-id', 'Failed');

        await detailsViewPage.waitForRequirementStatus('duplicate-id', 'Passed');
    });
});
