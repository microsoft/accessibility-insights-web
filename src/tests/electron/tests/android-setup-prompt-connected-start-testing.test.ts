// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as path from 'path';
import { deviceDescriptionAutomationId } from 'electron/views/device-connect-view/components/android-setup/device-description';
import {
    leftFooterButtonAutomationId,
    rescanAutomationId,
    rightFooterButtonAutomationId,
} from 'electron/views/device-connect-view/components/automation-ids';
import { getAutomationIdSelector } from 'tests/common/get-automation-id-selector';
import { createApplication } from 'tests/electron/common/create-application';
import { scanForAccessibilityIssuesInAllModes } from 'tests/electron/common/scan-for-accessibility-issues';
import { AndroidSetupViewController } from 'tests/electron/common/view-controllers/android-setup-view-controller';
import { AppController } from 'tests/electron/common/view-controllers/app-controller';
import {
    commonAdbConfigs,
    delayAllCommands,
    physicalDeviceName1,
    setupMockAdb,
} from '../../miscellaneous/mock-adb/setup-mock-adb';

const [cancelId, startTestingId] = [leftFooterButtonAutomationId, rightFooterButtonAutomationId];
const expectedRunningApp = 'com.google.android.apps.messaging';

describe('Android setup - prompt-connected-start-testing', () => {
    const defaultDeviceConfig = commonAdbConfigs['single-device'];
    let app: AppController;
    let dialog: AndroidSetupViewController;

    beforeEach(async () => {
        await setupMockAdb(defaultDeviceConfig, path.basename(__filename), 'beforeEach');
        app = await createApplication({ suppressFirstTimeDialog: true });
        dialog = await app.openAndroidSetupView('prompt-connected-start-testing');
    });

    afterEach(async () => {
        if (app != null) {
            await app.stop();
        }
    });

    it('initial component state is correct', async () => {
        expect(await dialog.isEnabled(getAutomationIdSelector(cancelId))).toBe(true);
        expect(await dialog.isEnabled(getAutomationIdSelector(startTestingId))).toBe(true);
        expect(await dialog.isEnabled(getAutomationIdSelector(rescanAutomationId))).toBe(true);
        expect(
            await dialog.itemTextIncludesTarget(
                getAutomationIdSelector(deviceDescriptionAutomationId),
                physicalDeviceName1,
            ),
        ).toBe(true);
        expect(
            await dialog.itemTextIncludesTarget(
                getAutomationIdSelector(deviceDescriptionAutomationId),
                expectedRunningApp,
            ),
        ).toBe(true);
    });

    it('goes to prompt-choose-device upon cancel', async () => {
        await setupMockAdb(defaultDeviceConfig, path.basename(__filename), 'cancel');
        await dialog.click(getAutomationIdSelector(cancelId));
        await dialog.waitForDialogVisible('prompt-choose-device');
    });

    it('goes to detect-devices upon rescan (same devices)', async () => {
        await setupMockAdb(
            delayAllCommands(50, defaultDeviceConfig),
            path.basename(__filename),
            'rescan same devices',
        );
        await dialog.click(getAutomationIdSelector(rescanAutomationId));
        await dialog.waitForDialogVisible('detect-devices');
        await dialog.waitForDialogVisible('prompt-connected-start-testing');
    });

    it('goes to detect-devices upon rescan (different devices)', async () => {
        await setupMockAdb(
            delayAllCommands(100, commonAdbConfigs['multiple-devices']),
            path.basename(__filename),
            'rescan different devices',
        );
        await dialog.click(getAutomationIdSelector(rescanAutomationId));
        await dialog.waitForDialogVisible('detect-devices');
        await dialog.waitForDialogVisible('prompt-choose-device');
    });

    it('goes to automated checks upon start testing', async () => {
        await dialog.click(getAutomationIdSelector(startTestingId));
        await app.waitForResultsView();
    });

    it('should pass accessibility validation in all contrast modes', async () => {
        await scanForAccessibilityIssuesInAllModes(app);
    });
});
