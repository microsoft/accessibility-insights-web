// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserController } from '../common/browser-controller';

// We want this to be greater than default timeout of puppeteer's waitFor* functions (30s),
// because test failures of the form "such and such puppeteer operation timed out" are much
// more actionable than test failures of the form "such and such test timed out".
const E2E_TEST_TIMEOUT = 60000;

describe('telemetry-permission-dialog', () => {
    let browserController: BrowserController;

    // Replace this with the in-repo target URL once that user story is complete
    const arbitraryTargetUrl = 'https://bing.com';

    beforeEach(async () => {
        browserController = await BrowserController.launch();
    });

    afterEach(async () => {
        await browserController.close();
    });

    it('should be visible with the expected title the first time a launchpad is opened', async () => {
        const launchpadPage = await browserController.newLaunchpadPage(
            arbitraryTargetUrl,
            { suppressFirstTimeTelemetryDialog: false });

        await launchpadPage.waitForSelector('.telemetry-permission-dialog-modal');

        const title = await launchpadPage.$eval('#telemetry-permission-title', element => element.textContent);
        expect(title).toBe('We need your help');
    }, E2E_TEST_TIMEOUT);

    it('should be dismissed by clicking the OK button', async () => {
        let launchpadPage = await browserController.newLaunchpadPage(
            arbitraryTargetUrl,
            { suppressFirstTimeTelemetryDialog: false });

        // Click the OK button on the dialog
        await launchpadPage.waitForSelector('.telemetry-permission-dialog-modal');
        await launchpadPage.click('button.start-using-product-button');

        // Verify the dialog is dismissed from the original launchpad
        await launchpadPage.waitFor(() => !document.querySelector('.telemetry-permission-dialog-modal'));

        // Open a new separate launchpad
        await browserController.closeAllPages();
        launchpadPage = await browserController.newLaunchpadPage(
            arbitraryTargetUrl,
            { suppressFirstTimeTelemetryDialog: false });

        // Verify the dialog is suppressed in the second launchpad instance
        await launchpadPage.waitForSelector('#new-launch-pad');
        await launchpadPage.waitFor(() => !document.querySelector('.telemetry-permission-dialog-modal'));
    }, E2E_TEST_TIMEOUT);

    // Sanity check for the sake of other test files
    it('should be suppressed by BrowserController.newLaunchpadPage by default', async () => {
        const launchpadPage = await browserController.newLaunchpadPage(arbitraryTargetUrl);

        await launchpadPage.waitForSelector('#new-launch-pad');
        await launchpadPage.waitFor(() => !document.querySelector('.telemetry-permission-dialog-modal'));
    }, E2E_TEST_TIMEOUT);
});
