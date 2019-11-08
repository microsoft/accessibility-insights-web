// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createApplication } from 'tests/electron/common/create-application';
import { AutomatedChecksViewSelectors } from 'tests/electron/common/element-identifiers/automated-checks-view-selectors';
import { scanForAccessibilityIssues } from 'tests/electron/common/scan-for-accessibility-issues';
import { AppController } from 'tests/electron/common/view-controllers/app-controller';
import { AutomatedChecksViewController } from 'tests/electron/common/view-controllers/automated-checks-view-controller';

describe('AutomatedChecksView', () => {
    let app: AppController;
    let automatedChecksView: AutomatedChecksViewController;

    beforeEach(async () => {
        app = await createApplication();
        automatedChecksView = await app.openAutomatedChecksView();
    });

    afterEach(async () => {
        automatedChecksView = null;
        if (app != null) {
            await app.stop();
        }
    });

    it('displays automated checks results collapsed by default', async () => {
        const ruleGroups = await automatedChecksView.queryRuleGroups();
        expect(ruleGroups).toHaveLength(4);

        const collapsibleContentElements = await automatedChecksView.queryRuleGroupContents();
        expect(collapsibleContentElements).toHaveLength(0);
    });

    it('supports expanding and collapsing rule groups', async () => {
        expect(await automatedChecksView.queryRuleGroupContents()).toHaveLength(0);

        await automatedChecksView.toggleRuleGroupAtPosition(1);
        await automatedChecksView.toggleRuleGroupAtPosition(2);
        await automatedChecksView.toggleRuleGroupAtPosition(3);

        expect(await automatedChecksView.queryRuleGroupContents()).toHaveLength(3);
        await assertExpandedRuleGroup(1, 'ImageViewName', 1);
        await assertExpandedRuleGroup(2, 'ActiveViewName', 2);
        await assertExpandedRuleGroup(3, 'TouchSizeWcag', 1);

        await automatedChecksView.toggleRuleGroupAtPosition(1);
        await automatedChecksView.toggleRuleGroupAtPosition(2);

        expect(await automatedChecksView.queryRuleGroupContents()).toHaveLength(1);
        await assertExpandedRuleGroup(3, 'TouchSizeWcag', 1);
    });

    it('should not contain any accessibility issues', async () => {
        const violations = await scanForAccessibilityIssues(automatedChecksView);
        expect(violations).toStrictEqual([]);
    });

    async function assertExpandedRuleGroup(position: number, expectedTitle: string, expectedFailures: number): Promise<void> {
        const title = await automatedChecksView.client.$(AutomatedChecksViewSelectors.getRuleDetailsIdSelector(position)).getText();
        expect(title).toEqual(expectedTitle);

        const failures = await automatedChecksView.client.$$(AutomatedChecksViewSelectors.getLiFailuresSelector(position));
        expect(failures).toHaveLength(expectedFailures);
    }
});
