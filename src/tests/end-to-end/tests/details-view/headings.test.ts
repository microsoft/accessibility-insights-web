// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { detailsViewSelectors } from '../../common/element-identifiers/details-view-selectors';
import { DetailsViewPage } from '../../common/page-controllers/details-view-page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';
import { DEFAULT_TARGET_PAGE_SCAN_TIMEOUT_MS } from '../../common/timeouts';

describe('Details View -> Assessment -> Headings', () => {
    let browser: Browser;
    let headingsPage: DetailsViewPage;

    beforeAll(async () => {
        browser = await launchBrowser({
            suppressFirstTimeDialog: true,
            addExtraPermissionsToManifest: 'fake-activeTab',
        });

        headingsPage = (await browser.newAssessment()).detailsViewPage;
    });

    afterAll(async () => {
        await browser?.close();
    });

    describe('Requirement page', () => {
        beforeAll(async () => {
            await headingsPage.navigateToTestRequirement('Headings', 'Heading function');
            await headingsPage.waitForVisualHelperState('Off', {
                timeout: DEFAULT_TARGET_PAGE_SCAN_TIMEOUT_MS,
            });
        });

        afterAll(async () => {
            await headingsPage.closeNavTestLink('Headings');
        });

        it.each([true, false])(
            'should pass accessibility validation with highContrastMode=%s',
            async highContrastMode => {
                await browser.setHighContrastMode(highContrastMode);
                await headingsPage.waitForHighContrastMode(highContrastMode);

                const results = await scanForAccessibilityIssues(
                    headingsPage,
                    detailsViewSelectors.mainContent,
                );
                expect(results).toStrictEqual([]);
            },
        );
    });

    describe('Getting started page', () => {
        beforeAll(async () => {
            await headingsPage.navigateToGettingStarted('Headings');
        });

        afterAll(async () => {
            await headingsPage.closeNavTestLink('Headings');
        });

        it.each([true, false])(
            'Getting started page should pass accessibility validation with highContrastMode=%s',
            async highContrastMode => {
                await browser.setHighContrastMode(highContrastMode);
                await headingsPage.waitForHighContrastMode(highContrastMode);

                const results = await scanForAccessibilityIssues(
                    headingsPage,
                    detailsViewSelectors.mainContent,
                );
                expect(results).toStrictEqual([]);
            },
        );
    });
});
