// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as path from 'path';
import { createApplication } from 'tests/electron/common/create-application';
import { scanForAccessibilityIssuesInAllModes } from 'tests/electron/common/scan-for-accessibility-issues';
import { AppController } from 'tests/electron/common/view-controllers/app-controller';
import { AutomatedChecksViewController } from 'tests/electron/common/view-controllers/automated-checks-view-controller';
import { CommonSelectors } from 'tests/end-to-end/common/element-identifiers/common-selectors';
import { settingsPanelSelectors } from 'tests/end-to-end/common/element-identifiers/details-view-selectors';
import { commonAdbConfigs, setupMockAdb } from 'tests/miscellaneous/mock-adb/setup-mock-adb';
describe('AutomatedChecksView -> Settings Panel', () => {
    let app: AppController;
    let automatedChecksView: AutomatedChecksViewController;

    beforeEach(async () => {
        await setupMockAdb(
            commonAdbConfigs['single-device'],
            path.basename(__filename),
            'beforeEach',
        );
        app = await createApplication({ suppressFirstTimeDialog: true });
        automatedChecksView = await app.openAutomatedChecksView();
        await automatedChecksView.waitForViewVisible();
        await automatedChecksView.openSettingsPanel();
    });

    afterEach(async () => {
        if (app != null) {
            await app.stop();
        }
    });

    describe('Telemetry toggle', () => {
        it('should be "off" as per our suppressFirstTimeDialog implementation of the initial state', async () => {
            await automatedChecksView.expectToggleState(
                settingsPanelSelectors.telemetryStateToggle,
                false,
            );
        });

        it('should reflect the state applied via the insightsUserConfiguration controller', async () => {
            await app.setTelemetryState(true);
            await automatedChecksView.expectToggleState(
                settingsPanelSelectors.telemetryStateToggle,
                true,
            );

            await app.setTelemetryState(false);
            await automatedChecksView.expectToggleState(
                settingsPanelSelectors.telemetryStateToggle,
                false,
            );
        });
    });

    describe('High Contrast Mode toggle', () => {
        // skipping this test for now as we don't have a good, clean way to check if the system is using
        // high contrast from the running test.
        it.skip('should default to system setting or non-high-contrast mode', async () => {
            const highContrastModeEnabled = false;

            await automatedChecksView.expectToggleState(
                settingsPanelSelectors.highContrastModeToggle,
                highContrastModeEnabled,
            );
        });

        it('should apply the appropriate CSS style when High Contrast Mode setting is toggled', async () => {
            await automatedChecksView.setToggleState(
                settingsPanelSelectors.highContrastModeToggle,
                true,
            );

            await automatedChecksView.waitForSelector(CommonSelectors.highContrastThemeSelector);

            await automatedChecksView.setToggleState(
                settingsPanelSelectors.highContrastModeToggle,
                false,
            );

            await automatedChecksView.waitForSelectorToDisappear(
                CommonSelectors.highContrastThemeSelector,
            );
        });

        it('should reflect the state applied via the insightsUserConfiguration controller', async () => {
            await app.setHighContrastMode(true);
            await automatedChecksView.expectToggleState(
                settingsPanelSelectors.highContrastModeToggle,
                true,
            );

            await app.setHighContrastMode(false);
            await automatedChecksView.expectToggleState(
                settingsPanelSelectors.highContrastModeToggle,
                false,
            );
        });

        it('should pass accessibility validation in all contrast modes', async () => {
            await scanForAccessibilityIssuesInAllModes(app);
        });
    });
});
