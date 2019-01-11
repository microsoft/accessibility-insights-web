// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserController } from '../common/browser-controller';

describe('Ad hoc tools', () => {
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

        await expect(launchpadPage).toClick('button', { text: 'Ad hoc tools' });

        await expect(launchpadPage).toFill('[role="heading"]', 'Accessibility Insights for Web');
    });

    /*
    it ('should toggle automated check visualizations when the "Automated checks" Ad hoc tool switch is toggled', async () => {
        throw 'not implemented';
    });

    it ('should toggle images to be monochrome when the "Color" Ad hoc tool switch is toggled', async () => {
        throw 'not implemented';
    });

    it ('should toggle heading visualizations when the "Headings" Ad hoc tool switch is toggled', async () => {
        throw 'not implemented';
    });

    it ('should toggle landmark visualizations when the "Landmarks" Ad hoc tool switch is toggled', async () => {
        throw 'not implemented';
    });

    it ('should refocus on the target page when the "Tab stops" Ad hoc tool switch is enabled', async () => {
        throw 'not implemented';
    });

    it ('should toggle tab stop visualizations when the "Tab stops" Ad hoc tool switch is toggled', async () => {
        throw 'not implemented';
    });

    it ('should switch to the main Launchpad view when the "Back to launch pad" link is clicked', async () => {
        throw 'not implemented';
    });

    it ('should maintain the state of Ad hoc tools when dismissing and repening the Launchpad', async () => {
        throw 'not implemented';
    });
    */
});
