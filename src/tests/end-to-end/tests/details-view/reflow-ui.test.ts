// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { narrowModeThresholds } from 'DetailsView/components/narrow-mode-detector';
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import { detailsViewSelectors } from '../../common/element-identifiers/details-view-selectors';
import { DetailsViewPage } from '../../common/page-controllers/details-view-page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';

describe('Details View -> Assessment -> Reflow', () => {
    let browser: Browser;
    let detailsViewPage: DetailsViewPage;
    const height = 400;

    beforeAll(async () => {
        browser = await launchBrowser({
            suppressFirstTimeDialog: true,
            addExtraPermissionsToManifest: 'fake-activeTab',
        });

        detailsViewPage = (await browser.newAssessment()).detailsViewPage;
    });

    afterAll(async () => {
        if (browser) {
            await browser.close();
            browser = undefined;
        }
    });

    describe('With command bar collapsed', () => {
        beforeEach(async () => {
            const width = narrowModeThresholds.collapseCommandBarThreshold - 1;
            await detailsViewPage.setViewport(width, height);
            await detailsViewPage.waitForSelector(detailsViewSelectors.commandBarMenuButton);
        });

        it.each([true, false])(
            `should pass accessibility validation with high contrast mode=%s`,
            async highContrastMode => {
                await browser.setHighContrastMode(highContrastMode);

                const results = await scanForAccessibilityIssues(
                    detailsViewPage,
                    detailsViewSelectors.mainContent,
                );
                expect(results).toHaveLength(0);
            },
        );

        it.each([true, false])(
            `should pass accessibility validation with command bar menu open and high contrast mode=%s`,
            async highContrastMode => {
                await browser.setHighContrastMode(highContrastMode);

                await detailsViewPage.clickSelector(detailsViewSelectors.commandBarMenuButton);
                await detailsViewPage.waitForSelector(
                    detailsViewSelectors.commandBarMenuButtonExpanded(true),
                );

                const results = await scanForAccessibilityIssues(
                    detailsViewPage,
                    detailsViewSelectors.mainContent,
                );
                expect(results).toHaveLength(0);

                // Close menu before next test
                await detailsViewPage.clickSelector(detailsViewSelectors.commandBarMenuButton);
                await detailsViewPage.waitForSelector(
                    detailsViewSelectors.commandBarMenuButtonExpanded(false),
                );
            },
        );
    });

    describe('With left nav collapsed', () => {
        beforeEach(async () => {
            const width = narrowModeThresholds.collapseHeaderAndNavThreshold - 1;
            await detailsViewPage.setViewport(width, height);
            await detailsViewPage.waitForSelector(
                detailsViewSelectors.assessmentNavHamburgerButton,
            );
        });

        it.each([true, false])(
            `should pass accessibility validation with high contrast mode=%s`,
            async highContrastMode => {
                await browser.setHighContrastMode(highContrastMode);

                const results = await scanForAccessibilityIssues(
                    detailsViewPage,
                    detailsViewSelectors.mainContent,
                );
                expect(results).toHaveLength(0);
            },
        );

        it.each([true, false])(
            `should pass accessibility validation with hamburger menu panel open and high contrast mode=%s`,
            async highContrastMode => {
                await browser.setHighContrastMode(highContrastMode);

                await detailsViewPage.clickSelector(
                    detailsViewSelectors.assessmentNavHamburgerButton,
                );
                await detailsViewPage.waitForSelector(
                    detailsViewSelectors.assessmentNavHamburgerButtonExpanded(true),
                );

                const results = await scanForAccessibilityIssues(
                    detailsViewPage,
                    detailsViewSelectors.mainContent,
                );
                expect(results).toHaveLength(0);

                // Close panel before next test
                await detailsViewPage.clickSelector(
                    detailsViewSelectors.assessmentNavHamburgerButton,
                );
                await detailsViewPage.waitForSelector(
                    detailsViewSelectors.assessmentNavHamburgerButtonExpanded(false),
                );
            },
        );
    });
});
