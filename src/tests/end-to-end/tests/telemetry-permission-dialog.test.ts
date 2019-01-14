// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { getTestResourceUrl } from '../common/test-resources';
import { DEFAULT_E2E_TEST_TIMEOUT_MS } from '../common/timeouts';
import { launchBrowser } from '../common/browser-factory';
import { Browser } from '../common/browser';

describe('telemetry-permission-dialog', () => {
    const arbitraryTargetUrl = getTestResourceUrl('all.html');
    let browser: Browser;

    beforeEach(async () => {
        browser = await launchBrowser();
    });

    afterEach(async () => {
        await browser.stop();
    });

    it('should be visible with the expected title the first time a launchpad is opened', async () => {
        const launchpadPage = await browser.newPopupPage(
            arbitraryTargetUrl,
            { suppressFirstTimeTelemetryDialog: false });

        await launchpadPage.waitForSelector('.telemetry-permission-dialog-modal');

        const dialogTitle = await launchpadPage.waitForSelector('#telemetry-permission-title');
        const textContentPropertyHandle = await dialogTitle.getProperty('textContent');
        const dialogTitleText = await textContentPropertyHandle.jsonValue();

        expect(dialogTitleText).toBe('We need your help');
    }, DEFAULT_E2E_TEST_TIMEOUT_MS);

    it('should be dismissed by clicking the OK button', async () => {
        let launchpadPage = await browser.newPopupPage(
            arbitraryTargetUrl,
            { suppressFirstTimeTelemetryDialog: false });

        // Click the OK button on the dialog
        await launchpadPage.waitForSelector('.telemetry-permission-dialog-modal');

        const okButton = await launchpadPage.waitForSelector('.telemetry-permission-dialog-modal button.start-using-product-button');
        await okButton.click();

        // Verify the dialog is dismissed from the original launchpad
        await launchpadPage.waitForSelectorToDisappear('.telemetry-permission-dialog-modal');

        // Open a new separate launchpad
        await browser.closeAllPages();
        launchpadPage = await browser.newPopupPage(
            arbitraryTargetUrl,
            { suppressFirstTimeTelemetryDialog: false });

        // Verify the dialog is suppressed in the second launchpad instance
        await launchpadPage.waitForSelector('#new-launch-pad');
        await launchpadPage.waitForSelectorToDisappear('.telemetry-permission-dialog-modal');
    }, DEFAULT_E2E_TEST_TIMEOUT_MS);

    // Sanity check for the sake of other test files
    it('should be suppressed by BrowserController.newLaunchpadPage by default', async () => {
        const launchpadPage = await browser.newPopupPage(arbitraryTargetUrl);

        await launchpadPage.waitForSelector('#new-launch-pad');
        await launchpadPage.waitForSelectorToDisappear('.telemetry-permission-dialog-modal');
    }, DEFAULT_E2E_TEST_TIMEOUT_MS);
});
