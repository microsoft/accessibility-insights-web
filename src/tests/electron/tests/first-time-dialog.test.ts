// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createApplication } from 'tests/electron/common/create-application';
import { scanForAccessibilityIssuesInAllModes } from 'tests/electron/common/scan-for-accessibility-issues';
import { AppController } from 'tests/electron/common/view-controllers/app-controller';

describe('first time dialog', () => {
    let app: AppController;

    beforeEach(async () => {
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
