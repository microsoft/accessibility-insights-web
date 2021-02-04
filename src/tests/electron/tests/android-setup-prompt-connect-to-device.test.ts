// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as path from 'path';
import {
    detectDeviceAutomationId,
    leftFooterButtonAutomationId,
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
    setupMockAdb,
    simulateNoDevicesConnected,
} from '../../miscellaneous/mock-adb/setup-mock-adb';

const [closeId, nextId] = [leftFooterButtonAutomationId, rightFooterButtonAutomationId];

describe('Android setup - prompt-connect-to-device ', () => {
    const defaultDeviceConfig = commonAdbConfigs['multiple-devices'];
    let app: AppController;
    let dialog: AndroidSetupViewController;

    beforeEach(async () => {
        await setupMockAdb(
            simulateNoDevicesConnected(defaultDeviceConfig),
            path.basename(__filename),
            'beforeEach',
        );
        app = await createApplication({ suppressFirstTimeDialog: true });
        dialog = await app.openAndroidSetupView('prompt-connect-to-device');
    });

    afterEach(async () => {
        if (app != null) {
            await app.stop();
        }
    });

    it('initial component state is correct', async () => {
        expect(await dialog.isEnabled(getAutomationIdSelector(closeId))).toBe(true);
        expect(await dialog.isEnabled(getAutomationIdSelector(nextId))).toBe(false);
        expect(await dialog.isEnabled(getAutomationIdSelector(detectDeviceAutomationId))).toBe(
            true,
        );
    });

    it('detect button triggers new detection', async () => {
        await setupMockAdb(
            defaultDeviceConfig,
            path.basename(__filename),
            'triggers new detection',
        );
        await dialog.click(getAutomationIdSelector(detectDeviceAutomationId));
        await dialog.waitForDialogVisible('prompt-choose-device');
    });

    it('detect device spinner should pass accessibility validation an all contrast modes', async () => {
        await setupMockAdb(
            delayAllCommands(3000, simulateNoDevicesConnected(defaultDeviceConfig)),
            path.basename(__filename),
            'spinner a11y',
        );
        await dialog.click(getAutomationIdSelector(detectDeviceAutomationId));
        await dialog.waitForDialogVisible('detect-devices');
        await scanForAccessibilityIssuesInAllModes(app);
        await dialog.waitForDialogVisible('prompt-connect-to-device'); // Let mock-adb finish
    });

    it('should pass accessibility validation in all contrast modes', async () => {
        await scanForAccessibilityIssuesInAllModes(app);
    });
});
