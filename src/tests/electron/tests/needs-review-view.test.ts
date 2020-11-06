// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedFeatureFlags } from 'electron/common/unified-feature-flags';
import * as path from 'path';
import { createApplication } from 'tests/electron/common/create-application';
import { AppController } from 'tests/electron/common/view-controllers/app-controller';
import { LeftNavController } from 'tests/electron/common/view-controllers/left-nav-controller';
import { commonAdbConfigs, setupMockAdb } from 'tests/miscellaneous/mock-adb/setup-mock-adb';

describe('NeedsReviewView', () => {
    let app: AppController;

    beforeEach(async () => {
        await setupMockAdb(
            commonAdbConfigs['single-device'],
            path.basename(__filename),
            'beforeEach',
        );

        app = await createApplication({ suppressFirstTimeDialog: true });
        await app.setFeatureFlag(UnifiedFeatureFlags.leftNavBar, true);
        await app.openAutomatedChecksView();

        const leftNavController = new LeftNavController(app.client);
        await leftNavController.clickNeedsReview();
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
