// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedFeatureFlags } from 'electron/common/unified-feature-flags';
import * as path from 'path';
import { createApplication } from 'tests/electron/common/create-application';
import { AppController } from 'tests/electron/common/view-controllers/app-controller';
import { AutomatedChecksViewController } from 'tests/electron/common/view-controllers/automated-checks-view-controller';
import { commonAdbConfigs, setupMockAdb } from 'tests/miscellaneous/mock-adb/setup-mock-adb';

describe('NeedsReviewView', () => {
    let app: AppController;
    let automatedChecksViewController: AutomatedChecksViewController;

    beforeEach(async () => {
        await setupMockAdb(
            commonAdbConfigs['single-device'],
            path.basename(__filename),
            'beforeEach',
        );

        app = await createApplication({ suppressFirstTimeDialog: true });
        await app.setFeatureFlag(UnifiedFeatureFlags.leftNavBar, true);
        automatedChecksViewController = await app.openAutomatedChecksView();
        await automatedChecksViewController.clickLeftNavItem('needs-review');
    });

    afterEach(async () => {
        if (app != null) {
            await app.stop();
        }
    });

    it('should use the expected window title', async () => {
        await app.waitForTitle('Accessibility Insights for Android - Needs review');
    });
});
