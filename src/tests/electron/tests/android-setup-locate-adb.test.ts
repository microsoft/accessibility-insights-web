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
import { commonAdbConfigs, setupMockAdb } from '../../miscellaneous/mock-adb/setup-mock-adb';

describe('Android setup - locate adb', () => {
    let app: AppController;
    let dialog: AndroidSetupViewController;

    beforeEach(async () => {
        app = await createApplication({
            suppressFirstTimeDialog: true,
            env: {
                ANDROID_HOME: `FAKE-TO-FORCE-PROMPT`,
            },
        });
        dialog = await app.openAndroidSetupView('prompt-locate-adb');
    });

    afterEach(async () => {
        if (app != null) {
            await app.stop();
        }
    });

    it('respects user-provided adb location', async () => {
        const [closeId, nextId] = [leftFooterButtonAutomationId, rightFooterButtonAutomationId];
        expect(await dialog.isEnabled(getAutomationIdSelector(closeId))).toBe(true);
        expect(await dialog.isEnabled(getAutomationIdSelector(nextId))).toBe(false);

        await setupMockAdb(commonAdbConfigs['single-device']);
        await dialog.client.click('input[type="text"]');
        await dialog.client.keys(`${(global as any).rootDir}/drop/mock-adb`);

        expect(await dialog.isEnabled(getAutomationIdSelector(nextId))).toBe(true);
        await dialog.client.click(getAutomationIdSelector(nextId));
        await dialog.waitForDialogVisible('prompt-connected-start-testing');
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
