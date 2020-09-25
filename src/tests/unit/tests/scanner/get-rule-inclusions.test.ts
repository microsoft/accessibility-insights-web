// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as axe from 'axe-core';
import { AxeRuleOverrides } from 'scanner/axe-rule-overrides';
import {
    explicitRuleOverrides,
    getRuleInclusions,
    RuleIncluded,
} from 'scanner/get-rule-inclusions';
import { IRuleConfiguration } from 'scanner/iruleresults';
import { BestPractice, ruleToLinkConfiguration } from 'scanner/rule-to-links-mappings';
import { DictionaryStringTo } from 'types/common-types';
import { HyperlinkDefinition } from 'views/content/content-page';

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
                excludedReason: null,
            },
            'axe-disabled': {
                status: 'excluded',
                excludedReason: 'disabled in axe config',
            },
        });
    });

    it('respects explicit overrides and populates reason', () => {
        const overrideReason = 'unit test override';
        const fakeOverrides: DictionaryStringTo<RuleIncluded> = {
            'axe-enabled': {
                status: 'excluded',
                excludedReason: overrideReason,
            },
        };

        const inclusions = getRuleInclusions(fakeRules, fakeEmptyConfig, fakeOverrides);
        expect(inclusions).toMatchObject({
            'axe-enabled': {
                status: 'excluded',
                excludedReason: overrideReason,
            },
            'axe-disabled': {
                status: 'excluded',
                excludedReason: 'disabled in axe config',
            },
        });
    });

    it('excludes rules without a guidance mapping and populates reason', () => {
        const inclusions = getRuleInclusions(fakeRules, {}, {});
        expect(inclusions).toMatchObject({
            'axe-enabled': {
                status: 'excluded',
                excludedReason: 'no guidance link mapping',
            },
            'axe-disabled': {
                status: 'excluded',
                excludedReason: 'disabled in axe config',
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
                excludedReason: 'rule maps to BestPractice',
            },
            'axe-disabled': {
                status: 'excluded',
                excludedReason: 'disabled in axe config',
            },
        });
    });

    it('matches snapshotted list of production rules', () => {
        AxeRuleOverrides.override(axe); // might be nice to only override for assessment rule/checks & do the explicit rule changes elsewhere
        const inclusions = getRuleInclusions(
            axe._audit.rules,
            ruleToLinkConfiguration,
            explicitRuleOverrides,
        );
        expect(inclusions).toMatchSnapshot();
    });
});
