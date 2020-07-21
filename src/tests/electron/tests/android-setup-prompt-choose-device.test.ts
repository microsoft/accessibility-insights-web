// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    leftFooterButtonAutomationId,
    rightFooterButtonAutomationId,
} from 'electron/views/device-connect-view/components/android-setup/android-setup-step-layout';
import { deviceDescriptionAutomationId } from 'electron/views/device-connect-view/components/android-setup/device-description';
import { getAutomationIdSelector } from 'tests/common/get-automation-id-selector';
import { createApplication } from 'tests/electron/common/create-application';
import { scanForAccessibilityIssuesInAllModes } from 'tests/electron/common/scan-for-accessibility-issues';
import { AndroidSetupViewController } from 'tests/electron/common/view-controllers/android-setup-view-controller';
import { AppController } from 'tests/electron/common/view-controllers/app-controller';
import {
    commonAdbConfigs,
    delayAllCommands,
    MockAdbConfig,
    setupMockAdb,
    simulateServiceNotInstalled,
} from '../../miscellaneous/mock-adb/setup-mock-adb';

describe('Android setup - prompt-choose-device (multiple devices)', () => {
    const defaultDeviceConfig: MockAdbConfig = commonAdbConfigs['multiple-devices'];
    const [closeId, nextId] = [leftFooterButtonAutomationId, rightFooterButtonAutomationId];
    let app: AppController;
    let dialog: AndroidSetupViewController;

    beforeEach(async () => {
        await setupMockAdb(defaultDeviceConfig);
        app = await createApplication({ suppressFirstTimeDialog: true });
        dialog = await app.openAndroidSetupView('prompt-choose-device');
    });

    afterEach(async () => {
        if (app != null) {
            await app.stop();
        }
    });

    it('initial component state is correct', async () => {
        expect(await dialog.isEnabled(getAutomationIdSelector(closeId))).toBe(true);
        expect(await dialog.isEnabled(getAutomationIdSelector(nextId))).toBe(true);
        expect(await dialog.isEnabled(getAutomationIdSelector('rescan'))).toBe(true);
        const devices = await dialog.client.$$(
            getAutomationIdSelector(deviceDescriptionAutomationId),
        );
        expect(devices.length).toBe(3);
    });

    it('selecting next goes to detect-service', async () => {
        await setupMockAdb(
            delayAllCommands(1000, simulateServiceNotInstalled(defaultDeviceConfig)),
        );
        await dialog.client.click(getAutomationIdSelector(nextId));
        await dialog.waitForDialogVisible('detect-service');
        await dialog.waitForDialogVisible('prompt-install-service'); // Let mock-adb complete
    });

    it('selecting rescan goes to detect-devices', async () => {
        await setupMockAdb(delayAllCommands(100, defaultDeviceConfig));
        await dialog.client.click(getAutomationIdSelector('rescan'));
        await dialog.waitForDialogVisible('detect-devices');
        await dialog.waitForDialogVisible('prompt-choose-device'); // Let mock-adb complete
    });

    it('should pass accessibility validation in all contrast modes', async () => {
        await scanForAccessibilityIssuesInAllModes(app);
    });
});
