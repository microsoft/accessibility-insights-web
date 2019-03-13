// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { contentPages } from '../../../../content';
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';

describe('A11Y for content pages', () => {
    let browser: Browser;

    beforeAll(async () => {
        browser = await launchBrowser({ suppressFirstTimeDialog: true });
    });

    afterEach(async () => {
        if (browser) {
            await browser.closeAllPages();
        }
    });

    afterAll(async () => {
        if (browser) {
            await browser.close();
            browser = undefined;
        }
    });

    const contentPaths = contentPages.allPaths();

    it.each(contentPaths)('%s has not a11y issues', async path => {
        const content = await browser.newContentPage(path);

        const results = await scanForAccessibilityIssues(content, '*');

        expect(results).toHaveLength(0);
    });
});
