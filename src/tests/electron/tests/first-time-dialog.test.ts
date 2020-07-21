// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createApplication } from 'tests/electron/common/create-application';
import { scanForAccessibilityIssuesInAllModes } from 'tests/electron/common/scan-for-accessibility-issues';
import { AppController } from 'tests/electron/common/view-controllers/app-controller';
import { commonAdbConfigs, setupMockAdb } from 'tests/miscellaneous/mock-adb/setup-mock-adb';

const description = 'first time dialog';
describe(description, () => {
    let app: AppController;

    beforeEach(async () => {
        await setupMockAdb(commonAdbConfigs['single-device'], description, 'beforeEach');
        app = await createApplication({ suppressFirstTimeDialog: false });
        await app.openDeviceConnectionDialog();
    });

    afterEach(async () => {
        if (app != null) {
            await app.stop();
        }
    });

    it('should pass accessibility validation in both contrast modes', async () => {
        await scanForAccessibilityIssuesInAllModes(app);
    });
});
