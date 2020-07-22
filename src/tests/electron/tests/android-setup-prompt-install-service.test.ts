// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { installAutomationId } from 'electron/views/device-connect-view/components/android-setup/prompt-install-service-step';
import {
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
    setupMockAdb,
    simulateServiceInstallationError,
    simulateServiceNotInstalled,
} from '../../miscellaneous/mock-adb/setup-mock-adb';

const [cancelId, nextId] = [leftFooterButtonAutomationId, rightFooterButtonAutomationId];

describe('Android setup - prompt-install-service ', () => {
    const defaultDeviceConfig = commonAdbConfigs['single-device'];
    let app: AppController;
    let dialog: AndroidSetupViewController;

    beforeEach(async () => {
        await setupMockAdb(simulateServiceNotInstalled(defaultDeviceConfig));
        app = await createApplication({ suppressFirstTimeDialog: true });
        dialog = await app.openAndroidSetupView('prompt-install-service');
    });

    afterEach(async () => {
        if (app != null) {
            await app.stop();
        }
    });

    it('initial component state is correct', async () => {
        expect(await dialog.isEnabled(getAutomationIdSelector(cancelId))).toBe(true);
        expect(await dialog.isEnabled(getAutomationIdSelector(nextId))).toBe(false);
        expect(await dialog.isEnabled(getAutomationIdSelector(installAutomationId))).toBe(true);
    });

    it('install button triggers installation, prompts for permission on success', async () => {
        await setupMockAdb(defaultDeviceConfig);
        await dialog.click(getAutomationIdSelector(installAutomationId));
        await dialog.waitForDialogVisible('prompt-grant-permissions');
    });

    it('install button triggers installation, prompts correctly on failure', async () => {
        await setupMockAdb(simulateServiceInstallationError(defaultDeviceConfig));
        await dialog.click(getAutomationIdSelector(installAutomationId));
        await dialog.waitForDialogVisible('prompt-install-failed');
    });

    it('should pass accessibility validation in all contrast modes', async () => {
        await scanForAccessibilityIssuesInAllModes(app);
    });
});
