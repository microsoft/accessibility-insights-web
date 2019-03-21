// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Axe from 'axe-core';

import { ruleToLinkConfiguration } from '../../../../scanner/rule-to-links-mappings';
import { difference } from 'lodash';

describe('ruleToLinkConfiguration', () => {
    const axe = Axe as any;
    const allAxeRules: string[] = axe.getRules().map(rule => rule.ruleId);
    const bestPracticeAxeRules: string[] = axe.getRules(['best-practice']).map(rule => rule.ruleId);

    // We're grandfathering this case in while we validate why axe considers it best-practice
    const bestPracticeAxeRulesWeWantToEnforceAnyway = ['accesskeys'];

    it.each(allAxeRules)(`should have a mapping for axe rule %s`, rule => {
        expect(ruleToLinkConfiguration[rule]).toBeDefined();
    });

    it.each(difference(bestPracticeAxeRules, bestPracticeAxeRulesWeWantToEnforceAnyway))(
        `should map axe best-practice rule %s as BestPractice`,
        rule => {
            expect(hasBestPracticeLink(ruleToLinkConfiguration[rule])).toBe(true);
        },
    );

    function hasBestPracticeLink(links: HyperTextDefinition[]): boolean {
        return links.findIndex(link => link.text === 'Best Practice') !== -1;
    }
});
