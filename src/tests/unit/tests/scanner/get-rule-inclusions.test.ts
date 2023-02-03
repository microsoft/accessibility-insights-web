// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as axe from 'axe-core';
import {
    explicitRuleOverrides,
    getIncludedAlwaysRules,
    getRuleInclusions,
    RuleIncluded,
} from 'scanner/get-rule-inclusions';
import { IRuleConfiguration } from 'scanner/iruleresults';
import { DictionaryStringTo } from 'types/common-types';

describe('getRuleInclusions', () => {
    describe('getIncludedAlwaysRules', () => {
        it('returns expected results', () => {
            const inclusions = getIncludedAlwaysRules();
            expect(inclusions).toMatchObject(['frame-tested']);
        });
    });

    describe('getRuleInclusions', () => {
        const fakeRules: IRuleConfiguration[] = [
            { id: 'axe-enabled', selector: 'fake-selector', enabled: true, tags: [] },
            { id: 'axe-disabled', selector: 'fake-selector', enabled: false, tags: [] },
        ];

        it('respects initial enabled/disabled config and populates reason', () => {
            const inclusions = getRuleInclusions(fakeRules, {});
            expect(inclusions).toMatchObject({
                'axe-enabled': {
                    status: 'included',
                },
                'axe-disabled': {
                    status: 'excluded',
                    reason: 'disabled in axe config',
                },
            });
        });

        it('respects explicit overrides and populates reason', () => {
            const overrideReason = 'unit test override';
            const fakeOverrides: DictionaryStringTo<RuleIncluded> = {
                'axe-enabled': {
                    status: 'excluded',
                    reason: overrideReason,
                },
            };

            const inclusions = getRuleInclusions(fakeRules, fakeOverrides);
            expect(inclusions).toMatchObject({
                'axe-enabled': {
                    status: 'excluded',
                    reason: overrideReason,
                },
                'axe-disabled': {
                    status: 'excluded',
                    reason: 'disabled in axe config',
                },
            });
        });

        it("excludes rules mapped to null tags (because it's probably one of our custom rules) and populates reason", () => {
            const noTagRule = [
                {
                    id: 'no-tag-rule',
                    selector: 'fake-selector',
                    enabled: true,
                    // tags: ...
                },
            ];
            const inclusions = getRuleInclusions(noTagRule, {});
            expect(inclusions).toMatchObject({
                'no-tag-rule': {
                    status: 'excluded',
                    reason: 'rule does not define a tags property',
                },
            });
        });

        it('excludes rules mapped to best-practice tag and populates reason', () => {
            const bestPracticeRule = [
                {
                    id: 'best-practice-rule',
                    selector: 'fake-selector',
                    enabled: true,
                    tags: ['best-practice'],
                },
            ];
            const inclusions = getRuleInclusions(bestPracticeRule, {});
            expect(inclusions).toMatchObject({
                'best-practice-rule': {
                    status: 'excluded',
                    reason: 'rule is tagged best-practice',
                },
            });
        });

        it('excludes rules mapped to wcag2aaa tag and populates reason', () => {
            const aaaRule = [
                {
                    id: 'aaa-rule',
                    selector: 'fake-selector',
                    enabled: true,
                    tags: ['wcag2aaa'],
                },
            ];
            const inclusions = getRuleInclusions(aaaRule, {});
            expect(inclusions).toMatchObject({
                'aaa-rule': {
                    status: 'excluded',
                    reason: 'rule is tagged wcag2aaa',
                },
            });
        });

        it('excludes rules mapped to experimental tag and populates reason', () => {
            const experimentalRule = [
                {
                    id: 'experimental-rule',
                    selector: 'fake-selector',
                    enabled: true,
                    tags: ['experimental'],
                },
            ];
            const inclusions = getRuleInclusions(experimentalRule, {});
            expect(inclusions).toMatchObject({
                'experimental-rule': {
                    status: 'excluded',
                    reason: 'rule is tagged experimental',
                },
            });
        });

        it('matches snapshotted list of production rules', () => {
            const inclusions = getRuleInclusions(axe._audit.rules, explicitRuleOverrides);
            expect(inclusions).toMatchSnapshot();
        });
    });
});
