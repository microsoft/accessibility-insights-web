// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Browser } from 'tests/end-to-end/common/browser';
import { launchBrowser } from 'tests/end-to-end/common/browser-factory';
import { CommonSelectors } from 'tests/end-to-end/common/element-identifiers/common-selectors';
import { settingsPanelSelectors } from 'tests/end-to-end/common/element-identifiers/details-view-selectors';
import { BackgroundContext } from 'tests/end-to-end/common/page-controllers/background-context';
import { DetailsViewPage } from 'tests/end-to-end/common/page-controllers/details-view-page';
import { TargetPage } from 'tests/end-to-end/common/page-controllers/target-page';
import { scanForAccessibilityIssues } from 'tests/end-to-end/common/scan-for-accessibility-issues';

describe('Details View -> Settings Panel', () => {
    let browser: Browser;
    let targetPage: TargetPage;
    let detailsViewPage: DetailsViewPage;
    let backgroundContext: BackgroundContext;

    beforeAll(async () => {
        browser = await launchBrowser({ suppressFirstTimeDialog: true });
        targetPage = await browser.newTargetPage();
        await browser.newPopupPage(targetPage);
        backgroundContext = await browser.background();
        detailsViewPage = await browser.newDetailsViewPage(targetPage);
        await detailsViewPage.openSettingsPanel();
    });

    afterAll(async () => {
        await browser?.close();
    });

    describe('Telemetry toggle', () => {
        it('should default to "off" in the usual configuration our E2E tests use', async () => {
            await detailsViewPage.expectToggleState(
                settingsPanelSelectors.telemetryStateToggle,
                false,
            );
        });

        it('should reflect the state applied via the background service worker insightsUserConfiguration controller all other tests use', async () => {
            await backgroundContext.setTelemetryState(true);
            await detailsViewPage.expectToggleState(
                settingsPanelSelectors.telemetryStateToggle,
                true,
            );

            await backgroundContext.setTelemetryState(false);
            await detailsViewPage.expectToggleState(
                settingsPanelSelectors.telemetryStateToggle,
                false,
            );
        });
    });

    describe('High Contrast Mode toggle', () => {
        it('should default to non-high-contrast mode', async () => {
            await detailsViewPage.expectToggleState(
                settingsPanelSelectors.highContrastModeToggle,
                false,
            );
        });

        it('should apply the appropriate CSS style when High Contrast Mode setting is toggled', async () => {
            await detailsViewPage.setToggleState(
                settingsPanelSelectors.highContrastModeToggle,
                true,
            );
            await detailsViewPage.waitForSelector(CommonSelectors.highContrastThemeSelector);

            await detailsViewPage.setToggleState(
                settingsPanelSelectors.highContrastModeToggle,
                false,
            );
            await detailsViewPage.waitForSelectorToDisappear(
                CommonSelectors.highContrastThemeSelector,
            );
        });

        it('should reflect the state applied via the background service worker insightsUserConfiguration controller all other tests use', async () => {
            await backgroundContext.setHighContrastMode(true);
            await detailsViewPage.expectToggleState(
                settingsPanelSelectors.highContrastModeToggle,
                true,
            );

            await backgroundContext.setHighContrastMode(false);
            await detailsViewPage.expectToggleState(
                settingsPanelSelectors.highContrastModeToggle,
                false,
            );
        });
    });

    it.each([true, false])(
        'should pass accessibility validation with highContrastMode=%s',
        async highContrastMode => {
            await backgroundContext.setHighContrastMode(highContrastMode);
            await detailsViewPage.waitForHighContrastMode(highContrastMode);

            const results = await scanForAccessibilityIssues(
                detailsViewPage,
                settingsPanelSelectors.settingsPanel,
            );

            // this results object has a false positive for link-in-text-block
            // the text block foreground (#000000) and link foreground color (#106ebe) have
            // a contrast value of 3.99:1
            expect(results).toMatchSnapshot();
        },
    );
});
