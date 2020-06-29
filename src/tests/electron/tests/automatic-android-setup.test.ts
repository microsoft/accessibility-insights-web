// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedFeatureFlags } from 'electron/common/unified-feature-flags';
import { moreInfoLinkAutomationId } from 'electron/views/device-connect-view/components/android-setup/android-setup-step-layout';
import { getAutomationIdSelector } from 'tests/common/get-automation-id-selector';
import { createApplication } from 'tests/electron/common/create-application';
import { AppController } from 'tests/electron/common/view-controllers/app-controller';
import { DeviceConnectionDialogController } from 'tests/electron/common/view-controllers/device-connection-dialog-controller';
describe('AutomaticAndroidSetup', () => {
    let app: AppController;
    let deviceConnectionController: DeviceConnectionDialogController;

    beforeEach(async () => {
        app = await createApplication({ suppressFirstTimeDialog: true });
        await app.setFeatureFlag(UnifiedFeatureFlags.adbSetupView, true);
        deviceConnectionController = await app.openDeviceConnectionDialog();
        await deviceConnectionController.waitForDialogVisible();
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

    it('first dialog has more info link', async () => {
        const selector = getAutomationIdSelector(moreInfoLinkAutomationId);
        await deviceConnectionController.client.waitForExist(selector);
        const text = await deviceConnectionController.client.getText(selector);
        expect(text.startsWith('How do I')).toBe(true);
    });
});
