// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    leftFooterButtonAutomationId,
    rightFooterButtonAutomationId,
} from 'electron/views/device-connect-view/components/android-setup/android-setup-step-layout';
import { getAutomationIdSelector } from 'tests/common/get-automation-id-selector';
import { createApplication } from 'tests/electron/common/create-application';
import { scanForAccessibilityIssues } from 'tests/electron/common/scan-for-accessibility-issues';
import { AndroidSetupViewController } from 'tests/electron/common/view-controllers/android-setup-view-controller';
import { AppController } from 'tests/electron/common/view-controllers/app-controller';
import {
    commonAdbConfigs,
    setupMockAdb,
    simulateNoDevices,
} from '../../miscellaneous/mock-adb/setup-mock-adb';

describe('Android setup - prompt-connect-to-device ', () => {
    const defaultDeviceConfig = commonAdbConfigs['multiple-devices'];
    let app: AppController;
    let dialog: AndroidSetupViewController;

    beforeEach(async () => {
        await setupMockAdb(simulateNoDevices(defaultDeviceConfig));
        app = await createApplication({ suppressFirstTimeDialog: true });
        dialog = await app.openAndroidSetupView('prompt-connect-to-device');
    });

    afterEach(async () => {
        if (app != null) {
            await app.stop();
        }
    });

    it('initial component state is correct', async () => {
        const [closeId, nextId] = [leftFooterButtonAutomationId, rightFooterButtonAutomationId];
        expect(await dialog.isEnabled(getAutomationIdSelector(closeId))).toBe(true);
        expect(await dialog.isEnabled(getAutomationIdSelector(nextId))).toBe(false);
        expect(await dialog.isEnabled(getAutomationIdSelector('detect-device'))).toBe(true);
    });

    it('detect button triggers new detection', async () => {
        await setupMockAdb(defaultDeviceConfig);
        await dialog.client.click(getAutomationIdSelector('detect-device'));
        await dialog.waitForDialogVisible('prompt-choose-device');
    });

    it.each([true, false])(
        'should pass accessibility validation with highContrastMode=%s',
        async highContrastMode => {
            await app.setHighContrastMode(highContrastMode);
            await app.waitForHighContrastMode(highContrastMode);

            const violations = await scanForAccessibilityIssues(dialog);
            expect(violations).toStrictEqual([]);
        },
    );
});
