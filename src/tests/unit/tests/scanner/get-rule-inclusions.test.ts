// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as axe from 'axe-core';
import { HyperlinkDefinition } from 'common/types/hyperlink-definition';
import {
    explicitRuleOverrides,
    getRuleInclusions,
    RuleIncluded,
} from 'scanner/get-rule-inclusions';
import { IRuleConfiguration } from 'scanner/iruleresults';
import { BestPractice, ruleToLinkConfiguration } from 'scanner/rule-to-links-mappings';
import { DictionaryStringTo } from 'types/common-types';

describe('getRuleInclusions', () => {
    const fakeRules: IRuleConfiguration[] = [
        { id: 'axe-enabled', selector: 'fake-selector', enabled: true },
        { id: 'axe-disabled', selector: 'fake-selector', enabled: false },
    ];
    const fakeEmptyConfig: DictionaryStringTo<HyperlinkDefinition[]> = {
        'axe-enabled': [{} as HyperlinkDefinition],
        'axe-disabled': [{} as HyperlinkDefinition],
    };

    it('respects initial enabled/disabled config and populates reason', () => {
        const inclusions = getRuleInclusions(fakeRules, fakeEmptyConfig, {});
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

        const inclusions = getRuleInclusions(fakeRules, fakeEmptyConfig, fakeOverrides);
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

    it('excludes rules without a guidance mapping and populates reason', () => {
        const inclusions = getRuleInclusions(fakeRules, {}, {});
        expect(inclusions).toMatchObject({
            'axe-enabled': {
                status: 'excluded',
                reason: 'no guidance link mapping',
            },
            'axe-disabled': {
                status: 'excluded',
                reason: 'disabled in axe config',
            },
        });
    });

    it('excludes rules mapped to Best Practice and populates reason', () => {
        const configWithBestPractice: DictionaryStringTo<HyperlinkDefinition[]> = {
            'axe-enabled': [BestPractice],
            'axe-disabled': [{} as HyperlinkDefinition],
        };
        const inclusions = getRuleInclusions(fakeRules, configWithBestPractice, {});
        expect(inclusions).toMatchObject({
            'axe-enabled': {
                status: 'excluded',
                reason: 'rule maps to BestPractice',
            },
            'axe-disabled': {
                status: 'excluded',
                reason: 'disabled in axe config',
            },
        });
    });

    it('matches snapshotted list of production rules', () => {
        const inclusions = getRuleInclusions(
            axe._audit.rules,
            ruleToLinkConfiguration,
            explicitRuleOverrides,
        );
        expect(inclusions).toMatchSnapshot();
    });
});
