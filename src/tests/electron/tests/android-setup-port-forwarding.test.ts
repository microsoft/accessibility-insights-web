// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as path from 'path';
import { deviceDescriptionAutomationId } from 'electron/views/device-connect-view/components/android-setup/device-description';
import {
    leftFooterButtonAutomationId,
    rightFooterButtonAutomationId,
    tryAgainAutomationId,
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
    simulatePortForwardingError,
} from '../../miscellaneous/mock-adb/setup-mock-adb';

const [cancelId, nextId] = [leftFooterButtonAutomationId, rightFooterButtonAutomationId];

describe('Android setup - prompt-configuring-port-forwarding-failed', () => {
    const defaultDeviceConfig = commonAdbConfigs['single-device'];
    let app: AppController;
    let dialog: AndroidSetupViewController;

    beforeEach(async () => {
        await setupMockAdb(
            simulatePortForwardingError(defaultDeviceConfig),
            path.basename(__filename),
            'beforeEach',
        );
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
        expect(
            await dialog.itemTextIncludesTarget(
                getAutomationIdSelector(deviceDescriptionAutomationId),
                physicalDeviceName1,
            ),
        ).toBe(true);
    });

    it('goes to prompt-choose-device upon cancel', async () => {
        await setupMockAdb(
            commonAdbConfigs['multiple-devices'],
            path.basename(__filename),
            'cancel',
        );
        await dialog.click(getAutomationIdSelector(cancelId));
        await dialog.waitForDialogVisible('prompt-choose-device');
    });

    it('try again returns here if port forwarding still fails', async () => {
        await setupMockAdb(
            delayAllCommands(2500, simulatePortForwardingError(defaultDeviceConfig)),
            path.basename(__filename),
            'try again returns here',
        );
        await dialog.click(getAutomationIdSelector(tryAgainAutomationId));
        await dialog.waitForDialogVisible('configuring-port-forwarding');
        await dialog.waitForDialogVisible('prompt-configuring-port-forwarding-failed');
    });

    it('try again moves on if port forwarded properly; configuring-port-forwarding a11y test', async () => {
        await setupMockAdb(
            delayAllCommands(2500, defaultDeviceConfig),
            path.basename(__filename),
            'try again moves on',
        );
        await dialog.click(getAutomationIdSelector(tryAgainAutomationId));
        await dialog.waitForDialogVisible('configuring-port-forwarding');
        await scanForAccessibilityIssuesInAllModes(app);
        await dialog.waitForDialogVisible('prompt-connected-start-testing');
    });

    it('should pass accessibility validation in all contrast modes', async () => {
        await scanForAccessibilityIssuesInAllModes(app);
    });
});
