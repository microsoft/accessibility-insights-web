// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createApplication } from 'tests/electron/common/create-application';
import { AutomatedChecksViewSelectors } from 'tests/electron/common/element-identifiers/automated-checks-view-selectors';
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
        await app.reset();
    });

    it('displays automated checks results', async () => {
        const ruleGroups = await automatedChecksView.queryRuleGroups();

        expect(ruleGroups).toHaveLength(4);

        await assertExpandedRuleGroup(1, 'ImageViewName', 1);
        await assertExpandedRuleGroup(2, 'ActiveViewName', 2);
        await assertExpandedRuleGroup(3, 'TouchSizeWcag', 1);
        await assertExpandedRuleGroup(4, 'ColorContrast', 1);
    });

    it('supports collapsing rule groups to hide their associated failure details', async () => {
        const ruleGroups = await automatedChecksView.queryRuleGroups();

        expect(ruleGroups).toHaveLength(4);

        await automatedChecksView.collapseRuleGroupAtPosition(1);
        await automatedChecksView.collapseRuleGroupAtPosition(2);
        await automatedChecksView.collapseRuleGroupAtPosition(3);
        await automatedChecksView.collapseRuleGroupAtPosition(4);

        const collapsibleContentElements = await automatedChecksView.client.$$(AutomatedChecksViewSelectors.collapsibleContainerContent);

        expect(collapsibleContentElements).toHaveLength(0);
    });

    async function assertExpandedRuleGroup(position: number, expectedTitle: string, expectedFailures: number): Promise<void> {
        const title = await automatedChecksView.client.$(AutomatedChecksViewSelectors.getRuleDetailsIdSelector(position)).getText();
        expect(title).toEqual(expectedTitle);

        const failures = await automatedChecksView.client.$$(AutomatedChecksViewSelectors.getLiFailuresSelector(position));
        expect(failures).toHaveLength(expectedFailures);
    }
});
