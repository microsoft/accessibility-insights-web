// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserController } from '../common/browser-controller';

// We want this to be greater than default timeout of puppeteer's waitFor* functions (30s),
// because test failures of the form "such and such puppeteer operation timed out" are much
// more actionable than test failures of the form "such and such test timed out".
const E2E_TEST_TIMEOUT = 60000;

describe('Launchpad page', () => {
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

        await launchpadPage.waitForSelector('[role="heading"]');
        const title = await launchpadPage.$eval('[role="heading"]', e => e.textContent);
        expect(title).toBe('Accessibility Insights for Web');
    }, E2E_TEST_TIMEOUT);
});
