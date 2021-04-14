// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as path from 'path';
import { createApplication } from 'tests/electron/common/create-application';
import { scanForAccessibilityIssuesInAllModes } from 'tests/electron/common/scan-for-accessibility-issues';
import { AppController } from 'tests/electron/common/view-controllers/app-controller';
import { CardsViewController } from 'tests/electron/common/view-controllers/cards-view-controller';
import { commonAdbConfigs, setupMockAdb } from 'tests/miscellaneous/mock-adb/setup-mock-adb';

describe('AutomatedChecksView', () => {
    let app: AppController;
    let cardsView: CardsViewController;

    beforeEach(async () => {
        await setupMockAdb(
            commonAdbConfigs['single-device'],
            path.basename(__filename),
            'beforeEach',
        );
        app = await createApplication({ suppressFirstTimeDialog: true });
        const resultsView = await app.openResultsView();
        await resultsView.waitForScreenshotViewVisible();
        cardsView = resultsView.createCardsViewController();
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
        await cardsView.waitForRuleGroupCount(3);

        const collapsibleContentElements = await cardsView.queryRuleGroupContents();
        expect(collapsibleContentElements).toHaveLength(0);
    });

    it('supports expanding and collapsing rule groups', async () => {
        await cardsView.waitForHighlightBoxCount(4);
        expect(await cardsView.queryRuleGroupContents()).toHaveLength(0);

        await cardsView.toggleRuleGroupAtPosition(1);
        await cardsView.assertExpandedRuleGroup(1, 'ImageViewName', 1);

        await cardsView.toggleRuleGroupAtPosition(2);
        await cardsView.assertExpandedRuleGroup(2, 'ActiveViewName', 2);

        await cardsView.toggleRuleGroupAtPosition(3);
        await cardsView.assertExpandedRuleGroup(3, 'TouchSizeWcag', 1);

        await cardsView.waitForHighlightBoxCount(4);
        expect(await cardsView.queryRuleGroupContents()).toHaveLength(3);

        await cardsView.toggleRuleGroupAtPosition(1);
        await cardsView.assertCollapsedRuleGroup(1, 'ImageViewName');

        await cardsView.toggleRuleGroupAtPosition(2);
        await cardsView.assertCollapsedRuleGroup(2, 'ActiveViewName');

        await cardsView.waitForHighlightBoxCount(1);
        expect(await cardsView.queryRuleGroupContents()).toHaveLength(1);
        await cardsView.assertExpandedRuleGroup(3, 'TouchSizeWcag', 1);
    });

    it('should pass accessibility rvalidation in all contrast modes', async () => {
        await scanForAccessibilityIssuesInAllModes(app);
    });
});
