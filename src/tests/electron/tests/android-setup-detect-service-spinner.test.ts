// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createApplication } from 'tests/electron/common/create-application';
import { scanForAccessibilityIssuesInAllModes } from 'tests/electron/common/scan-for-accessibility-issues';
import { AppController } from 'tests/electron/common/view-controllers/app-controller';
import {
    commonAdbConfigs,
    delayAllCommands,
    setupMockAdb,
    simulateServiceNotInstalled,
} from '../../miscellaneous/mock-adb/setup-mock-adb';

const testDescription = 'Android setup - detect-service';
describe(testDescription, () => {
    const defaultDeviceConfig = commonAdbConfigs['single-device'];
    let app: AppController;

    beforeEach(async () => {
        await setupMockAdb(
            delayAllCommands(3000, simulateServiceNotInstalled(defaultDeviceConfig)),
            testDescription,
        );
        app = await createApplication({ suppressFirstTimeDialog: true });
        await app.openAndroidSetupView('detect-service');
    });

    afterEach(async () => {
        if (app != null) {
            await app.stop();
        }
    });

    it('should pass accessibility validation in both contrast modes', async () => {
        expect(true).toBeFalsy(); // on purpose to trigger logs
        await scanForAccessibilityIssuesInAllModes(app);
    });
});
