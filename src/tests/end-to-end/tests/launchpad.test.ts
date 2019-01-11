// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserController } from '../common/browser-controller';
import { E2E_TEST_TIMEOUT } from '../common/timeouts';

describe('Launchpad', () => {
    let browserController: BrowserController;

    // Replace this with the in-repo target URL once that user story is complete
    const arbitraryTargetUrl = 'https://bing.com';

    beforeEach(async () => {
        browserController = await BrowserController.launch();
    });

    afterEach(async () => {
        await browserController.close();
    });

    it('should display the correct title', async () => {
        const launchpadPage = await browserController.newLaunchpadPage(arbitraryTargetUrl);

        await expect(launchpadPage).toFill('[role="heading"]', 'Accessibility Insights for Web');
    }, E2E_TEST_TIMEOUT);

    it('should open a FastPass details view with Automated checks selected when the FastPass link is clicked', async () => {
        const targetUrl = arbitraryTargetUrl;
        const launchpadPage = await browserController.newLaunchpadPage(targetUrl);

        await expect(launchpadPage).toClick('button', { text: 'FastPass' });
        const detailsPage = await browserController.waitForDetailsPage();

        // Verify the header listbox is set to "FastPass"
        await expect(detailsPage).toFill('header [role="listbox"]', 'FastPass', { timeout: 5000 });
        // Verify the subheader "Target page:" text matches the target page title
        await expect(detailsPage).toFill('button.target-page-link', targetUrl);
        // Verify that the "Automated checks" step is selected
        await expect(detailsPage).toFill('.details-view-test-nav-area .is-selected .test-name', 'Automated checks');
        await expect(detailsPage).toFill('[role="main"] h1', 'Automated checks');
        // Verify that the checks are set to begin immediately
        await expect(detailsPage).toMatchElement('.automated-checks-details-view-toggle.is-checked', { text: 'On' });
    }, E2E_TEST_TIMEOUT);

    /*
    it('should open an Assessment details view when the Assessment link is clicked', async () => {
        throw 'not implemented';
    });

    it('should switch to the Ad hoc tools view when the Ad hoc tools link is clicked', async () => {
        throw 'not implemented';
    });

    it('should open a details view with the Settings panel visible when the settings icon is clicked', async () => {
        throw 'not implemented';
    });

    it('should open a details view with the Settings panel visible when the settings icon is clicked', async () => {
        throw 'not implemented';
    });
    */
});
