// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserController } from '../common/browser-controller';
import { getTestResourceUrl } from '../common/test-resources';
import { E2E_TEST_TIMEOUT } from '../common/timeouts';

describe('telemetry-permission-dialog', () => {
    const arbitraryTargetUrl = getTestResourceUrl('all.html');
    let browserController: BrowserController;

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

        await expect(launchpadPage).toFill('#telemetry-permission-title', 'We need your help');
    }, E2E_TEST_TIMEOUT);

    it('should be dismissed by clicking the OK button', async () => {
        let launchpadPage = await browserController.newLaunchpadPage(
            arbitraryTargetUrl,
            { suppressFirstTimeTelemetryDialog: false });

        // Click the OK button on the dialog
        await launchpadPage.waitForSelector('.telemetry-permission-dialog-modal');
        await expect(launchpadPage).toClick('button.start-using-product-button');

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
