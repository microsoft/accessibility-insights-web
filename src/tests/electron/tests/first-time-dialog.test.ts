// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createApplication } from 'tests/electron/common/create-application';
import { scanForAccessibilityIssues } from 'tests/electron/common/scan-for-accessibility-issues';
import { AppController } from 'tests/electron/common/view-controllers/app-controller';
import { DeviceConnectionDialogController } from 'tests/electron/common/view-controllers/device-connection-dialog-controller';

describe('first time dialog', () => {
    let app: AppController;
    let dialog: DeviceConnectionDialogController;

    beforeEach(async () => {
        app = await createApplication({ suppressFirstTimeDialog: false });
        dialog = await app.openDeviceConnectionDialog();
    });

    afterEach(async () => {
        dialog = null;
        if (app != null) {
            await app.stop();
        }
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
