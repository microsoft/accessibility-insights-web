// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ContentPage } from 'tests/end-to-end/common/page-controllers/content-page';
import { contentPages } from '../../../../content';
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { GuidanceContentSelectors } from '../../common/element-identifiers/common-selectors';
import { formatPageElementForSnapshot } from '../../common/element-snapshot-formatter';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';

describe('Guidance Content pages', () => {
    const contentPaths = contentPages.allPaths();

    let browser: Browser;

    beforeAll(async () => {
        browser = await launchBrowser({ suppressFirstTimeDialog: true });
    });

    afterAll(async () => {
        if (browser) {
            await browser.close();
            browser = undefined;
        }
    });

    describe.each(contentPaths)('%s', path => {
        let contentPage: ContentPage;

        beforeAll(async () => {
            contentPage = await browser.newContentPage(path);
        });

        afterAll(async () => {
            await contentPage.close();
        });

        it('matches the snapshot', async () => {
            const mainContentContainer = await formatPageElementForSnapshot(contentPage, GuidanceContentSelectors.mainContentContainer);
            expect(mainContentContainer).toMatchSnapshot();
        });

        it.each([true, false])('has no accessibility issues with highContrastMode=%s', async highContrastMode => {
            await browser.setHighContrastMode(highContrastMode);
            await contentPage.waitForHighContrastMode(highContrastMode);

            const results = await scanForAccessibilityIssues(contentPage, '*');
            expect(results).toHaveLength(0);
        });
    });
});
