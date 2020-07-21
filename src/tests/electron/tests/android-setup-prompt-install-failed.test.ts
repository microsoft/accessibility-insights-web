// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    leftFooterButtonAutomationId,
    rightFooterButtonAutomationId,
} from 'electron/views/device-connect-view/components/android-setup/android-setup-step-layout';
import { tryAgainAutomationId } from 'electron/views/device-connect-view/components/android-setup/prompt-configuring-port-forwarding-failed-step';
import { installAutomationId } from 'electron/views/device-connect-view/components/android-setup/prompt-install-service-step';
import { getAutomationIdSelector } from 'tests/common/get-automation-id-selector';
import { createApplication } from 'tests/electron/common/create-application';
import { scanForAccessibilityIssuesInAllModes } from 'tests/electron/common/scan-for-accessibility-issues';
import { AndroidSetupViewController } from 'tests/electron/common/view-controllers/android-setup-view-controller';
import { AppController } from 'tests/electron/common/view-controllers/app-controller';
import {
    commonAdbConfigs,
    delayAllCommands,
    setupMockAdb,
    simulateServiceInstallationError,
    simulateServiceNotInstalled,
} from '../../miscellaneous/mock-adb/setup-mock-adb';

const description = 'prompt-install-service-failed';
describe(`Android setup - ${description}`, () => {
    const defaultDeviceConfig = commonAdbConfigs['single-device'];
    let app: AppController;
    let dialog: AndroidSetupViewController;

    beforeEach(async () => {
        await setupMockAdb(simulateServiceNotInstalled(defaultDeviceConfig));
        app = await createApplication({ suppressFirstTimeDialog: true });
        dialog = await app.openAndroidSetupView('prompt-install-service');

        await setupMockAdb(
            simulateServiceInstallationError(defaultDeviceConfig),
            description,
            'beforeEach',
        );
        await dialog.click(getAutomationIdSelector(installAutomationId));
        await dialog.waitForDialogVisible('prompt-install-failed');
    });

    afterEach(async () => {
        if (app != null) {
            await app.stop();
        }
    });

    it('initial component state is correct', async () => {
        const [cancel, nextId] = [leftFooterButtonAutomationId, rightFooterButtonAutomationId];
        expect(await dialog.isEnabled(getAutomationIdSelector(cancel))).toBe(true);
        expect(await dialog.isEnabled(getAutomationIdSelector(nextId))).toBe(false);
        expect(await dialog.isEnabled(getAutomationIdSelector(tryAgainAutomationId))).toBe(true);
    });

    it('try again button triggers installation, prompts for permission on success', async () => {
        await setupMockAdb(defaultDeviceConfig, description, 'try again to permissions');
        await dialog.client.click(getAutomationIdSelector(tryAgainAutomationId));
        await dialog.waitForDialogVisible('prompt-grant-permissions');
    });

    it('install button triggers installation, prompts correctly on failure', async () => {
        await setupMockAdb(
            simulateServiceInstallationError(defaultDeviceConfig),
            description,
            'install button to install failed',
        );
        await dialog.client.click(getAutomationIdSelector(tryAgainAutomationId));
        await dialog.waitForDialogVisible('prompt-install-failed');
    });

    it('cancel button returns to choose device step', async () => {
        await dialog.client.click(getAutomationIdSelector(leftFooterButtonAutomationId));
        await dialog.waitForDialogVisible('prompt-choose-device');
    });

    it('should pass accessibility validation in all contrast modes', async () => {
        await scanForAccessibilityIssuesInAllModes(app);
    });

    it('installing service spinner should pass accessibility validation in all contrast modes', async () => {
        await setupMockAdb(
            delayAllCommands(3000, simulateServiceInstallationError(defaultDeviceConfig)),
            description,
            'install spinner accessibility',
        );
        await dialog.client.click(getAutomationIdSelector(tryAgainAutomationId));
        await dialog.waitForDialogVisible('installing-service');
        await scanForAccessibilityIssuesInAllModes(app);
        await dialog.waitForDialogVisible('prompt-install-failed'); // Let mock-adb finish
    });
});
