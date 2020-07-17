// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    leftFooterButtonAutomationId,
    rightFooterButtonAutomationId,
} from 'electron/views/device-connect-view/components/android-setup/android-setup-step-layout';
import { tryAgainAutomationId } from 'electron/views/device-connect-view/components/android-setup/prompt-configuring-port-forwarding-failed-step';
import { getAutomationIdSelector } from 'tests/common/get-automation-id-selector';
import { createApplication } from 'tests/electron/common/create-application';
import { scanForAccessibilityIssuesInAllModes } from 'tests/electron/common/scan-for-accessibility-issues';
import { AndroidSetupViewController } from 'tests/electron/common/view-controllers/android-setup-view-controller';
import { AppController } from 'tests/electron/common/view-controllers/app-controller';
import {
    commonAdbConfigs,
    delayAllCommands,
    setupMockAdb,
    simulatePortForwardingError,
} from '../../miscellaneous/mock-adb/setup-mock-adb';

describe('Android setup - prompt-configuring-port-forwarding-failed', () => {
    const [cancelId, nextId] = [leftFooterButtonAutomationId, rightFooterButtonAutomationId];
    const defaultDeviceConfig = commonAdbConfigs['single-device'];
    let app: AppController;
    let dialog: AndroidSetupViewController;

    beforeEach(async () => {
        await setupMockAdb(simulatePortForwardingError(defaultDeviceConfig));
        app = await createApplication({ suppressFirstTimeDialog: true });
        dialog = await app.openAndroidSetupView('prompt-configuring-port-forwarding-failed');
    });

    afterEach(async () => {
        if (app != null) {
            await app.stop();
        }
    });

    it('initial component state is correct', async () => {
        expect(await dialog.isEnabled(getAutomationIdSelector(cancelId))).toBe(true);
        expect(await dialog.isEnabled(getAutomationIdSelector(nextId))).toBe(false);
        expect(await dialog.isEnabled(getAutomationIdSelector(tryAgainAutomationId))).toBe(true);
    });

    it('goes to prompt-choose-device upon cancel', async () => {
        await setupMockAdb(commonAdbConfigs['multiple-devices']);
        await dialog.client.click(getAutomationIdSelector(cancelId));
        await dialog.waitForDialogVisible('prompt-choose-device');
    });

    it('try again returns here if port forwarding still fails', async () => {
        await setupMockAdb(
            delayAllCommands(5000, simulatePortForwardingError(defaultDeviceConfig)),
        );
        await dialog.client.click(getAutomationIdSelector(tryAgainAutomationId));
        await dialog.waitForDialogVisible('configuring-port-forwarding');
        await dialog.waitForDialogVisible('prompt-configuring-port-forwarding-failed');
    });

    it('try again moves on if permissions are granted; configuring-port-forwarding a11y test', async () => {
        await setupMockAdb(delayAllCommands(2500, defaultDeviceConfig));
        await dialog.client.click(getAutomationIdSelector(tryAgainAutomationId));
        await dialog.waitForDialogVisible('configuring-port-forwarding');
        await scanForAccessibilityIssuesInAllModes(app);
        await dialog.waitForDialogVisible('prompt-connected-start-testing');
    });

    it('should pass accessibility validation in both contrast modes', async () => {
        await scanForAccessibilityIssuesInAllModes(app);
    });
});
