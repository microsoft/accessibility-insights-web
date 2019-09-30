// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { contentPages } from '../../../../content';
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { GuidanceContentSelectors } from '../../common/element-identifiers/common-selectors';
import { formatPageElementForSnapshot } from '../../common/element-snapshot-formatter';
import { TargetPage } from '../../common/page-controllers/target-page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';

describe('A11Y for content pages', () => {
    const contentPaths = contentPages.allPaths();

    describe('Normal mode', () => {
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

        it.each(contentPaths)('%s', async path => {
            const content = await browser.newContentPage(path);

            const results = await scanForAccessibilityIssues(content, '*');

            expect(results).toHaveLength(0);

            const mainContentContainer = await formatPageElementForSnapshot(content, GuidanceContentSelectors.mainContentContainer);
            expect(mainContentContainer).toMatchSnapshot();

            await content.close();
        });
    });

    describe('High Contrast mode', () => {
        let browser: Browser;
        let targetPage: TargetPage;

        beforeAll(async () => {
            browser = await launchBrowser({ suppressFirstTimeDialog: true });
            targetPage = await browser.newTargetPage();
            const detailsViewPage = await browser.newDetailsViewPage(targetPage);
            await detailsViewPage.enableHighContrast();
        });

        afterAll(async () => {
            if (browser) {
                await browser.close();
                browser = undefined;
            }
        });

        it.each(contentPaths)('%s', async path => {
            const content = await browser.newContentPage(path);

            const results = await scanForAccessibilityIssues(content, '*');

            expect(results).toHaveLength(0);

            const mainContentContainer = await formatPageElementForSnapshot(content, GuidanceContentSelectors.mainContentContainer);
            expect(mainContentContainer).toMatchSnapshot();

            await content.close();
        });
    });
});
