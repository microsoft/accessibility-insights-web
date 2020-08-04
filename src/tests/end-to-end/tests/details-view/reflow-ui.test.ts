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

    const commandBarButtonSelector = detailsViewSelectors.commandBarMenuButton;
    const commandBarWindowWidth = narrowModeThresholds.collapseCommandBarThreshold - 1;
    const hamburgerButtonSelector = detailsViewSelectors.assessmentNavHamburgerButton;
    const hamburgerButtonWindowWidth = narrowModeThresholds.collapseHeaderAndNavThreshold - 1;

    describe.each`
        componentName           | componentSelector           | width
        ${'command bar button'} | ${commandBarButtonSelector} | ${commandBarWindowWidth}
        ${'hamburger button'}   | ${hamburgerButtonSelector}  | ${hamburgerButtonWindowWidth}
    `('With $componentName visible', ({ componentName, componentSelector, width }) => {
        beforeAll(async () => {
            await detailsViewPage.setViewport(width, height);
            await detailsViewPage.waitForSelector(componentSelector);
        });

        it.each([true, false])(
            `should pass accessibility validation with high contrast mode=%s`,
            async highContrastMode => {
                await scanForA11yIssuesWithHighContrast(highContrastMode);
            },
        );

        describe(`with ${componentName} expanded`, () => {
            beforeAll(async () => {
                await expandButton(componentSelector, true);
            });

            afterAll(async () => {
                await expandButton(componentSelector, false);
            });

            it.each([true, false])(
                `should pass accessibility validation with command bar menu open and high contrast mode=%s`,
                async highContrastMode => {
                    await scanForA11yIssuesWithHighContrast(highContrastMode);
                },
            );
        });
    });

    async function scanForA11yIssuesWithHighContrast(highContrastMode: boolean): Promise<void> {
        await browser.setHighContrastMode(highContrastMode);
        await detailsViewPage.waitForHighContrastMode(highContrastMode);

        const results = await scanForAccessibilityIssues(detailsViewPage, '*');
        expect(results).toHaveLength(0);
    }

    async function expandButton(buttonSelector: string, expanded: boolean): Promise<void> {
        await detailsViewPage.clickSelector(buttonSelector);
        await detailsViewPage.waitForSelector(`${buttonSelector}[aria-expanded=${expanded}]`);
    }
});
