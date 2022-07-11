// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as path from 'path';
import { createApplication } from 'tests/electron/common/create-application';
import { scanForAccessibilityIssuesInAllModes } from 'tests/electron/common/scan-for-accessibility-issues';
import { AppController } from 'tests/electron/common/view-controllers/app-controller';
import {
    commonAdbConfigs,
    delayAllCommands,
    setupMockAdb,
    simulateServiceNotInstalled,
} from '../../miscellaneous/setup-mock-adb/setup-mock-adb';

describe('Android setup - detect-service', () => {
    const defaultDeviceConfig = commonAdbConfigs['single-device'];
    let app: AppController;

    beforeEach(async () => {
        await setupMockAdb(
            delayAllCommands(3000, simulateServiceNotInstalled(defaultDeviceConfig)),
            path.basename(__filename),
            'beforeEach',
        );
        app = await createApplication({ suppressFirstTimeDialog: true });
        await app.openAndroidSetupView('detect-service');
    });

    afterEach(async () => {
        if (app != null) {
            await app.stop();
        }
    });

    it('should pass accessibility validation in all contrast modes', async () => {
        await scanForAccessibilityIssuesInAllModes(app);
    });
});
