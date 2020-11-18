// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as path from 'path';
import { createApplication } from 'tests/electron/common/create-application';
import { AutomatedChecksViewSelectors } from 'tests/electron/common/element-identifiers/automated-checks-view-selectors';
import { scanForAccessibilityIssuesInAllModes } from 'tests/electron/common/scan-for-accessibility-issues';
import { AppController } from 'tests/electron/common/view-controllers/app-controller';
import { AutomatedChecksViewController } from 'tests/electron/common/view-controllers/automated-checks-view-controller';
import { commonAdbConfigs, setupMockAdb } from 'tests/miscellaneous/mock-adb/setup-mock-adb';

describe('AutomatedChecksView', () => {
    let app: AppController;
    let automatedChecksView: AutomatedChecksViewController;

    beforeEach(async () => {
        await setupMockAdb(
            commonAdbConfigs['single-device'],
            path.basename(__filename),
            'beforeEach',
        );
        app = await createApplication({ suppressFirstTimeDialog: true });
        const resultsView = await app.openResultsView();
        await resultsView.waitForScreenshotViewVisible();
        automatedChecksView = resultsView.createAutomatedChecksViewController();
    });

    afterEach(async () => {
        if (app != null) {
            await app.stop();
        }
    });

    it('should use the expected window title', async () => {
        await app.waitForTitle('Accessibility Insights for Android - Automated checks');
    });

    it('displays automated checks results collapsed by default', async () => {
        await automatedChecksView.waitForRuleGroupCount(3);

        const collapsibleContentElements = await automatedChecksView.queryRuleGroupContents();
        expect(collapsibleContentElements).toHaveLength(0);
    });

    it('supports expanding and collapsing rule groups', async () => {
        await automatedChecksView.waitForHighlightBoxCount(4);
        expect(await automatedChecksView.queryRuleGroupContents()).toHaveLength(0);

        await automatedChecksView.toggleRuleGroupAtPosition(1);
        await automatedChecksView.assertExpandedRuleGroup(1, 'ImageViewName', 1);

        await automatedChecksView.toggleRuleGroupAtPosition(2);
        await automatedChecksView.assertExpandedRuleGroup(2, 'ActiveViewName', 2);

        await automatedChecksView.toggleRuleGroupAtPosition(3);
        await automatedChecksView.assertExpandedRuleGroup(3, 'TouchSizeWcag', 1);

        await automatedChecksView.waitForHighlightBoxCount(4);
        expect(await automatedChecksView.queryRuleGroupContents()).toHaveLength(3);

        await automatedChecksView.toggleRuleGroupAtPosition(1);
        await automatedChecksView.assertCollapsedRuleGroup(1, 'ImageViewName');

        await automatedChecksView.toggleRuleGroupAtPosition(2);
        await automatedChecksView.assertCollapsedRuleGroup(2, 'ActiveViewName');

        await automatedChecksView.waitForHighlightBoxCount(1);
        expect(await automatedChecksView.queryRuleGroupContents()).toHaveLength(1);
        await automatedChecksView.assertExpandedRuleGroup(3, 'TouchSizeWcag', 1);
    });

    it('should pass accessibility rvalidation in all contrast modes', async () => {
        await scanForAccessibilityIssuesInAllModes(app);
    });
});
