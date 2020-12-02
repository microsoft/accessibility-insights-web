// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as axe from 'axe-core';
import {
    explicitRuleOverrides,
    getRuleInclusions,
    RuleIncluded,
} from 'scanner/get-rule-inclusions';
import { IRuleConfiguration } from 'scanner/iruleresults';
import { DictionaryStringTo } from 'types/common-types';

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

    it('excludes rules mapped to best-practice tag and populates reason', () => {
        const bestPracticeRule = [
            {
                id: 'best-practice-rule',
                selector: 'fake-selector',
                enabled: true,
                tags: ['experimental'],
            },
        ];
        const inclusions = getRuleInclusions(bestPracticeRule, {});
        expect(inclusions).toMatchObject({
            'best-practice-rule': {
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
