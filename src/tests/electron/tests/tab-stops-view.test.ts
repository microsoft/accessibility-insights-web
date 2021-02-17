// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as path from 'path';
import { getNarrowModeThresholdsForUnified } from 'electron/common/narrow-mode-thresholds';
import { UnifiedFeatureFlags } from 'electron/common/unified-feature-flags';
import { createApplication } from 'tests/electron/common/create-application';
import { ResultsViewSelectors } from 'tests/electron/common/element-identifiers/results-view-selectors';
import { scanForAccessibilityIssuesInAllModes } from 'tests/electron/common/scan-for-accessibility-issues';
import { AppController } from 'tests/electron/common/view-controllers/app-controller';
import { LogController } from 'tests/electron/common/view-controllers/log-controller';
import { ResultsViewController } from 'tests/electron/common/view-controllers/results-view-controller';
import { VirtualKeyboardViewController } from 'tests/electron/common/view-controllers/virtual-keyboard-view-controller';
import {
    commonAdbConfigs,
    mockAdbFolder,
    setupMockAdb,
} from 'tests/miscellaneous/mock-adb/setup-mock-adb';

describe('TabStopsView', () => {
    let app: AppController;
    let resultsViewController: ResultsViewController;
    let virtualKeyboardViewController: VirtualKeyboardViewController;
    const enterKeyEvent = 'keyevent 66';
    const logController = new LogController(mockAdbFolder);
    const mockAdbLogsBase = path.basename(__filename);
    const mockAdbLogsFolder = 'tabStopsLogs';
    const windowWidth = getNarrowModeThresholdsForUnified().collapseHeaderAndNavThreshold + 5;
    const windowHeight = 1000;
    const logsContext = path.join(mockAdbLogsBase, mockAdbLogsFolder);

    beforeEach(async () => {
        await setupMockAdb(commonAdbConfigs['single-device'], mockAdbLogsBase, mockAdbLogsFolder);

        app = await createApplication({ suppressFirstTimeDialog: true });
        app.setFeatureFlag(UnifiedFeatureFlags.tabStops, true);
        app.client.browserWindow.setSize(windowWidth, windowHeight);
        virtualKeyboardViewController = new VirtualKeyboardViewController(app.client);
        resultsViewController = await app.openResultsView();
        await resultsViewController.clickLeftNavItem('tab-stops');
    });

    afterEach(async () => {
        if (app != null) {
            await app.stop();
        }
    });

    it('should use the expected window title', async () => {
        await app.waitForTitle('Accessibility Insights for Android - Tab stops');
    });

    it('virtual keyboard keys send corresponding adb commands', async () => {
        logController.resetAdbLog(logsContext);

        await virtualKeyboardViewController.clickVirtualKey('Up');
        await virtualKeyboardViewController.clickVirtualKey('Down');
        await virtualKeyboardViewController.clickVirtualKey('Left');
        await virtualKeyboardViewController.clickVirtualKey('Right');
        await virtualKeyboardViewController.clickVirtualKey('Tab');
        await virtualKeyboardViewController.clickVirtualKey('Enter');
        await logController.waitForAdbLogToContain(enterKeyEvent, logsContext, app.client);

        const adbLog = await logController.getAdbLog(logsContext);
        expect(adbLog).toMatchSnapshot();
    });

    it('should pass accessibility validation in all contrast modes', async () => {
        await scanForAccessibilityIssuesInAllModes(app);
    });

    it('export report button does not exist', async () => {
        await resultsViewController.waitForSelectorToDisappear(
            ResultsViewSelectors.exportReportButton,
        );
    });
});
