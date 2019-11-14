// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    RuleSifter,
    RuleWithA11YCriteria,
} from '../../../../scanner/rule-sifter';

describe('RuleSifter', () => {
    describe('constructor', () => {
        it('should construct the sifter', () => {
            const sifter = new RuleSifter(null, null);
            expect(sifter).not.toBeNull();
        });
    });

    describe('getSiftedRules', () => {
        it('should return rule-b which has only nonfiltered rule', () => {
            const ruleSetStub = [
                {
                    id: 'rule-a',
                    enabled: true,
                },
                {
                    id: 'rule-b',
                    enabled: true,
                },
            ];

            const bestPracticeRule = {
                text: 'Best Practice',
                href: '',
            };

            const nonFilteredRule = {
                text: 'nonFilteredRule',
                href: '',
            };

            const ruleToLinksMap = {
                'rule-a': [nonFilteredRule, bestPracticeRule],
                'rule-b': [nonFilteredRule],
            };

            const expectedRules: RuleWithA11YCriteria[] = [
                {
                    id: 'rule-b',
                    a11yCriteria: [nonFilteredRule],
                },
            ];

            const sifter = new RuleSifter(ruleSetStub, ruleToLinksMap);
            expect(sifter.getSiftedRules()).toEqual(expectedRules);
        });

        it('should return rule-b since rule-a does not have rule to link mapping', () => {
            const ruleSetStub = [
                {
                    id: 'rule-a',
                    enabled: true,
                },
                {
                    id: 'rule-b',
                    enabled: true,
                },
            ];

            const nonFilteredRule = {
                text: 'nonFilteredRule',
                href: '',
            };

            const ruleToLinkMap = {
                'rule-b': [nonFilteredRule],
            };

            const expectedRules: RuleWithA11YCriteria[] = [
                {
                    id: 'rule-b',
                    a11yCriteria: [nonFilteredRule],
                },
            ];

            const sifter = new RuleSifter(ruleSetStub, ruleToLinkMap);
            expect(sifter.getSiftedRules()).toEqual(expectedRules);
        });

        it('should return rule-b since rule-a does not have any rule-to-link mappings', () => {
            const ruleSetStub = [
                {
                    id: 'rule-a',
                    enabled: true,
                },
                {
                    id: 'rule-b',
                    enabled: true,
                },
            ];

            const nonFilteredRule = {
                text: 'nonFilteredRule',
                href: '',
            };

            const ruleToLinkMap = {
                'rule-a': [],
                'rule-b': [nonFilteredRule],
            };

            const expectedRules: RuleWithA11YCriteria[] = [
                {
                    id: 'rule-b',
                    a11yCriteria: [nonFilteredRule],
                },
            ];

            const sifter = new RuleSifter(ruleSetStub, ruleToLinkMap);
            expect(sifter.getSiftedRules()).toEqual(expectedRules);
        });

        it('should return rule-b since rule-a is not enabled', () => {
            const ruleSetStub = [
                {
                    id: 'rule-a',
                    enabled: false,
                },
                {
                    id: 'rule-b',
                    enabled: true,
                },
            ];

            const nonFilteredRule = {
                text: 'nonFilteredRule',
                href: '',
            };

            const ruleToLinkMap = {
                'rule-a': [],
                'rule-b': [nonFilteredRule],
            };

            const expectedRules: RuleWithA11YCriteria[] = [
                {
                    id: 'rule-b',
                    a11yCriteria: [nonFilteredRule],
                },
            ];

            const sifter = new RuleSifter(ruleSetStub, ruleToLinkMap);
            expect(sifter.getSiftedRules()).toEqual(expectedRules);
        });
    });
});
