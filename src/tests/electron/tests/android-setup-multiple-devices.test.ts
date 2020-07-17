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
import { commonAdbConfigs, setupMockAdb } from '../../miscellaneous/mock-adb/setup-mock-adb';

describe('Android setup - multiple devices ', () => {
    let app: AppController;
    let dialog: AndroidSetupViewController;

    beforeEach(async () => {
        await setupMockAdb(commonAdbConfigs['multiple-devices']);
        app = await createApplication({ suppressFirstTimeDialog: true });
        dialog = await app.openAndroidSetupView('prompt-choose-device');
    });

    afterEach(async () => {
        if (app != null) {
            await app.stop();
        }
    });

    it('initial component state is correct', async () => {
        const [closeId, nextId] = [leftFooterButtonAutomationId, rightFooterButtonAutomationId];
        expect(await dialog.isEnabled(getAutomationIdSelector(closeId))).toBe(true);
        expect(await dialog.isEnabled(getAutomationIdSelector(nextId))).toBe(true);
        expect(await dialog.isEnabled(getAutomationIdSelector('rescan'))).toBe(true);
        const devices = await dialog.client.$$(
            getAutomationIdSelector(deviceDescriptionAutomationId),
        );
        expect(devices.length).toBe(3);
    });

    it('choosing a device changes next button state, selecting next goes to detect-service', async () => {
        await dialog.client.click(getAutomationIdSelector(deviceDescriptionAutomationId));
        expect(await dialog.isEnabled(getAutomationIdSelector(rightFooterButtonAutomationId))).toBe(
            true,
        );
        await dialog.client.click(getAutomationIdSelector(rightFooterButtonAutomationId));
        await dialog.waitForSelector(getAutomationIdSelector('detect-service-content'));
    });

    it('selecting rescan goes to detect-devices', async () => {
        await dialog.client.click(getAutomationIdSelector('rescan'));
        await dialog.waitForSelector(getAutomationIdSelector('detect-devices-content'));
    });

    it('should pass accessibility validation in both contrast modes', async () => {
        await scanForAccessibilityIssuesInAllModes(app);
    });
});
