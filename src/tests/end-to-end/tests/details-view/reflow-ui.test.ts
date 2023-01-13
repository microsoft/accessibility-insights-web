// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { getNarrowModeThresholdsForWeb } from 'common/narrow-mode-thresholds';
import { TargetPage } from 'tests/end-to-end/common/page-controllers/target-page';
import {
    DEFAULT_PAGE_ELEMENT_WAIT_TIMEOUT_MS,
    DEFAULT_TARGET_PAGE_SCAN_TIMEOUT_MS,
} from 'tests/end-to-end/common/timeouts';
import { Browser } from '../../common/browser';
import { launchBrowser } from '../../common/browser-factory';
import {
    detailsViewSelectors,
    fastPassAutomatedChecksSelectors,
    navMenuSelectors,
} from '../../common/element-identifiers/details-view-selectors';
import { DetailsViewPage } from '../../common/page-controllers/details-view-page';
import { scanForAccessibilityIssues } from '../../common/scan-for-accessibility-issues';

describe('Details View ->', () => {
    let browser: Browser;
    let detailsViewPage: DetailsViewPage;
    const height = 400;
    const narrowModeThresholds = getNarrowModeThresholdsForWeb();

    beforeAll(async () => {
        browser = await launchBrowser({
            suppressFirstTimeDialog: true,
            addExtraPermissionsToManifest: 'fake-activeTab',
        });
    });

    afterAll(async () => {
        await browser?.close();
    });

    describe('Assessment -> Reflow', () => {
        beforeAll(async () => {
            detailsViewPage = (await browser.newAssessment()).detailsViewPage;
        });

        afterAll(async () => {
            await detailsViewPage.close();
        });

        const { commandBarMenuButtonSelectors, hamburgerMenuButtonSelectors } = navMenuSelectors;

        const commandBarWindowWidth = narrowModeThresholds.collapseCommandBarThreshold - 1;
        const hamburgerButtonWindowWidth = narrowModeThresholds.collapseHeaderAndNavThreshold - 1;

        describe.each`
            componentName           | componentSelectors               | width
            ${'command bar button'} | ${commandBarMenuButtonSelectors} | ${commandBarWindowWidth}
            ${'hamburger button'}   | ${hamburgerMenuButtonSelectors}  | ${hamburgerButtonWindowWidth}
        `('With $componentName visible', ({ componentName, componentSelectors, width }) => {
            beforeAll(async () => {
                await resizeDetailsView(width, componentSelectors.collapsed);
            });

            it.each([true, false])(
                `should pass accessibility validation with high contrast mode=%s`,
                async highContrastMode => {
                    await scanForA11yIssuesWithHighContrast(highContrastMode);
                },
            );

            describe(`with ${componentName} expanded`, () => {
                beforeAll(async () => {
                    await setButtonExpandedState(componentSelectors, true);
                });

                afterAll(async () => {
                    await setButtonExpandedState(componentSelectors, false);
                });

                it.each([true, false])(
                    `should pass accessibility validation with command bar menu open and high contrast mode=%s`,
                    async highContrastMode => {
                        await scanForA11yIssuesWithHighContrast(highContrastMode);
                    },
                );
            });
        });
    });

    describe('Fastpass -> Reflow', () => {
        let targetPage: TargetPage;

        const cardFooterWindowWidth = narrowModeThresholds.collapseCardFooterThreshold - 1;
        const cardFooterSelectors = fastPassAutomatedChecksSelectors.cardFooterKebabButton;

        beforeAll(async () => {
            targetPage = await browser.newTargetPage({
                testResourcePath: 'all.html',
            });
            await browser.newPopupPage(targetPage);
            detailsViewPage = await browser.newDetailsViewPage(targetPage);
            await detailsViewPage.waitForSelector(
                detailsViewSelectors.automatedChecksResultSection,
                {
                    timeout: DEFAULT_TARGET_PAGE_SCAN_TIMEOUT_MS,
                },
            );
            await detailsViewPage.waitForSelector(fastPassAutomatedChecksSelectors.expandButton, {
                timeout: DEFAULT_PAGE_ELEMENT_WAIT_TIMEOUT_MS,
            });

            await resizeDetailsView(cardFooterWindowWidth);
            await expandCard();
        });

        afterAll(async () => {
            await detailsViewPage.close();
            await targetPage.close();
        });

        describe.each([true, false])('With high contrast mode=%s', highContrastMode => {
            it('and card kebab menu collapsed', async () => {
                await scanForA11yIssuesWithHighContrast(highContrastMode);
            });

            it('and card kebab menu expanded', async () => {
                await setButtonExpandedState(cardFooterSelectors, true);

                await scanForA11yIssuesWithHighContrast(highContrastMode);

                await setButtonExpandedState(cardFooterSelectors, false);
            });
        });

        describe.each([true, false])('With high contrast mode=%s', highContrastMode => {
            const { commandBarMenuButtonSelectors } = navMenuSelectors;
            const commandBarWindowWidth = narrowModeThresholds.collapseCommandBarThreshold - 1;

            describe.each`
                componentName           | componentSelectors               | width
                ${'command bar button'} | ${commandBarMenuButtonSelectors} | ${commandBarWindowWidth}
            `('With $componentName visible', ({ componentName, componentSelectors, width }) => {
                beforeAll(async () => {
                    await resizeDetailsView(width, componentSelectors.collapsed);
                });

                describe(`with ${componentName} expanded`, () => {
                    beforeAll(async () => {
                        await setButtonExpandedState(componentSelectors, true);
                    });

                    afterAll(async () => {
                        await setButtonExpandedState(componentSelectors, false);
                    });

                    it(`should pass accessibility validation with command bar menu open and high contrast mode=%s`, async () => {
                        await scanForA11yIssuesWithHighContrast(highContrastMode);
                    });
                });
            });
        });

        async function expandCard(): Promise<void> {
            await detailsViewPage.waitForSelector(fastPassAutomatedChecksSelectors.expandButton, {
                timeout: DEFAULT_PAGE_ELEMENT_WAIT_TIMEOUT_MS,
            });

            await detailsViewPage.clickSelector(fastPassAutomatedChecksSelectors.expandButton);
            await detailsViewPage.waitForSelector(cardFooterSelectors.collapsed);
        }
    });

    async function resizeDetailsView(
        screenWidth: number,
        expectedSelector?: string,
    ): Promise<void> {
        await detailsViewPage.setViewport(screenWidth, height);
        if (expectedSelector) {
            await detailsViewPage.waitForSelector(expectedSelector);
        }
    }

    async function scanForA11yIssuesWithHighContrast(highContrastMode: boolean): Promise<void> {
        await browser.setHighContrastMode(highContrastMode);
        await detailsViewPage.waitForHighContrastMode(highContrastMode);

        const results = await scanForAccessibilityIssues(detailsViewPage, '*');
        expect(results).toHaveLength(0);
    }

    async function setButtonExpandedState(
        buttonSelectors: { expanded: string; collapsed: string },
        expanded: boolean,
    ): Promise<void> {
        const oldSelector = expanded ? buttonSelectors.collapsed : buttonSelectors.expanded;
        const newSelector = expanded ? buttonSelectors.expanded : buttonSelectors.collapsed;
        await detailsViewPage.clickSelector(oldSelector);
        await detailsViewPage.waitForSelector(newSelector);
    }
});
