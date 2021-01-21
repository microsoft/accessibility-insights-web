// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as path from 'path';
import { deviceDescriptionAutomationId } from 'electron/views/device-connect-view/components/android-setup/device-description';
import { installAutomationId } from 'electron/views/device-connect-view/components/android-setup/prompt-install-service-step';
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
    simulateServiceInstallationError,
    simulateServiceNotInstalled,
} from '../../miscellaneous/mock-adb/setup-mock-adb';

const [cancelId, nextId] = [leftFooterButtonAutomationId, rightFooterButtonAutomationId];

describe('Android setup - prompt-install-service-failed ', () => {
    const defaultDeviceConfig = commonAdbConfigs['single-device'];
    let app: AppController;
    let dialog: AndroidSetupViewController;

    beforeEach(async () => {
        await setupMockAdb(
            simulateServiceNotInstalled(defaultDeviceConfig),
            path.basename(__filename),
            'beforeEach',
        );
        app = await createApplication({ suppressFirstTimeDialog: true });
        dialog = await app.openAndroidSetupView('prompt-install-service');

        await setupMockAdb(
            simulateServiceInstallationError(defaultDeviceConfig),
            path.basename(__filename),
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

    it('try again button triggers installation, prompts for permission on success', async () => {
        await setupMockAdb(
            defaultDeviceConfig,
            path.basename(__filename),
            'try again to permissions',
        );
        await dialog.click(getAutomationIdSelector(tryAgainAutomationId));
        await dialog.waitForDialogVisible('prompt-grant-permissions');
    });

    it('install button triggers installation, prompts correctly on failure', async () => {
        await setupMockAdb(
            simulateServiceInstallationError(defaultDeviceConfig),
            path.basename(__filename),
            'install button to install failed',
        );
        await dialog.click(getAutomationIdSelector(tryAgainAutomationId));
        await dialog.waitForDialogVisible('prompt-install-failed');
    });

    it('cancel button returns to choose device step', async () => {
        await dialog.click(getAutomationIdSelector(leftFooterButtonAutomationId));
        await dialog.waitForDialogVisible('prompt-choose-device');
    });

    it('should pass accessibility validation in all contrast modes', async () => {
        await scanForAccessibilityIssuesInAllModes(app);
    });

    it('installing service spinner should pass accessibility validation in all contrast modes', async () => {
        await setupMockAdb(
            delayAllCommands(3000, simulateServiceInstallationError(defaultDeviceConfig)),
            path.basename(__filename),
            'install spinner accessibility',
        );
        await dialog.click(getAutomationIdSelector(tryAgainAutomationId));
        await dialog.waitForDialogVisible('installing-service');
        await scanForAccessibilityIssuesInAllModes(app);
        await dialog.waitForDialogVisible('prompt-install-failed'); // Let mock-adb finish
    });
});
