// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Axe from 'axe-core';
import { HyperlinkDefinition } from 'views/content/content-page';

import { ruleToLinkConfiguration } from '../../../../scanner/rule-to-links-mappings';

describe('ruleToLinkConfiguration', () => {
    const axe = Axe as any;
    const allAxeRules: string[] = axe.getRules().map(rule => rule.ruleId);
    const bestPracticeAxeRules: string[] = axe.getRules(['best-practice']).map(rule => rule.ruleId);

    it.each(allAxeRules)(`should have a mapping for axe rule %s`, rule => {
        const config = ruleToLinkConfiguration;
        expect(ruleToLinkConfiguration[rule]).toBeDefined();
    });

    it.each(bestPracticeAxeRules)(`should map axe best-practice rule %s as BestPractice`, rule => {
        expect(hasBestPracticeLink(ruleToLinkConfiguration[rule])).toBe(true);
    });

    function hasBestPracticeLink(links: HyperlinkDefinition[]): boolean {
        return links.findIndex(link => link.text === 'Best Practice') !== -1;
    }
});
