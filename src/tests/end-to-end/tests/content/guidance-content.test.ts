// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { formatPageElementForSnapshot } from 'tests/common/element-snapshot-formatter';
import { ContentPage } from 'tests/end-to-end/common/page-controllers/content-page';
import { contentPages } from '../../../../content';
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { GuidanceContentSelectors } from '../../common/element-identifiers/common-selectors';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';

describe('Guidance Content pages', () => {
    const contentPaths = contentPages.allPaths();

    let browser: Browser;
    let contentPage: ContentPage;

    beforeAll(async () => {
        browser = await launchBrowser({ suppressFirstTimeDialog: true });
        contentPage = await browser.newContentPage(contentPaths[0]);
    });

    afterAll(async () => {
        await browser?.close();
    });

    describe.each(contentPaths)('%s', path => {
        beforeAll(async () => {
            // It's important that we re-use the same tab/page for each test case;
            // spawning a new tab/page per case hits a resource leak in the linux/docker
            // test environments that causes spurious test failures in 90% of runs.
            await browser.gotoContentPage(contentPage, path);
        });

        it('matches the snapshot', async () => {
            const mainContentContainer = await formatPageElementForSnapshot(
                contentPage,
                GuidanceContentSelectors.mainContentContainer,
            );
            expect(mainContentContainer).toMatchSnapshot();
        });

        it.each([true, false])(
            'has no accessibility issues with highContrastMode=%s',
            async highContrastMode => {
                await browser.setHighContrastMode(highContrastMode);
                await contentPage.waitForHighContrastMode(highContrastMode);

                const results = await scanForAccessibilityIssues(contentPage, '*');
                expect(results).toMatchSnapshot();
            },
        );
    });
});
