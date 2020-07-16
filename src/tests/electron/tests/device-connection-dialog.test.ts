// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedFeatureFlags } from 'electron/common/unified-feature-flags';
import { createApplication } from 'tests/electron/common/create-application';
import { DeviceConnectionDialogSelectors } from 'tests/electron/common/element-identifiers/device-connection-dialog-selectors';
import { scanForAccessibilityIssues } from 'tests/electron/common/scan-for-accessibility-issues';
import { AppController } from 'tests/electron/common/view-controllers/app-controller';
import { DeviceConnectionDialogController } from 'tests/electron/common/view-controllers/device-connection-dialog-controller';

describe('device connection dialog', () => {
    let app: AppController;
    let dialog: DeviceConnectionDialogController;

    beforeEach(async () => {
        app = await createApplication({ suppressFirstTimeDialog: true });
        await app.setFeatureFlag(UnifiedFeatureFlags.adbSetupView, false);
        dialog = await app.openDeviceConnectionDialog();
    });

    afterEach(async () => {
        if (app != null) {
            await app.stop();
        }
    });

    it('should use the expected window title', async () => {
        expect(await app.getTitle()).toBe(
            'Accessibility Insights for Android - Connect to your Android device',
        );
    });

    it('should initially have the cancel button and port field enabled, but validate and start buttons disabled', async () => {
        expect(await dialog.isEnabled(DeviceConnectionDialogSelectors.cancelButton)).toBe(true);
        expect(await dialog.isEnabled(DeviceConnectionDialogSelectors.portNumber)).toBe(true);
        expect(await dialog.isEnabled(DeviceConnectionDialogSelectors.startButton)).toBe(false);
        expect(await dialog.isEnabled(DeviceConnectionDialogSelectors.validateButton)).toBe(false);
    });

    it('should leave the validate and start buttons disabled when provided an invalid port number', async () => {
        await dialog.click(DeviceConnectionDialogSelectors.portNumber);
        await dialog.client.$(DeviceConnectionDialogSelectors.portNumber);
        await dialog.client.keys('abc');
        expect(await dialog.isEnabled(DeviceConnectionDialogSelectors.validateButton)).toBe(false);
        expect(await dialog.isEnabled(DeviceConnectionDialogSelectors.startButton)).toBe(false);
    });

    it('should enable the validate and start buttons when provided a valid port number', async () => {
        await dialog.click(DeviceConnectionDialogSelectors.portNumber);
        await dialog.client.$(DeviceConnectionDialogSelectors.portNumber);
        await dialog.client.keys('999');
        expect(await dialog.isEnabled(DeviceConnectionDialogSelectors.validateButton)).toBe(true);
        expect(await dialog.isEnabled(DeviceConnectionDialogSelectors.startButton)).toBe(false);
    });

    it('should pass accessibility validation in both contrast modes', async () => {
        await scanForAccessibilityIssues(app, true);
        await scanForAccessibilityIssues(app, false);
    });
});
