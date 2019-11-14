// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isEmpty } from 'lodash';

import { RuleResult } from '../../scanner/iruleresults';
import { IResultRuleFilter } from './batched-rule-analyzer';

export const filterResultsByRules: IResultRuleFilter = (results, rules) => {
    if (isEmpty(rules)) {
        return results;
    }

    return {
        ...results,
        inapplicable: filterRuleResultListByRules(results.inapplicable, rules),
        incomplete: filterRuleResultListByRules(results.incomplete, rules),
        passes: filterRuleResultListByRules(results.passes, rules),
        violations: filterRuleResultListByRules(results.violations, rules),
    };
};

function filterRuleResultListByRules(
    list: RuleResult[],
    rules: string[],
): RuleResult[] {
    return list.filter(result => {
        return rules.indexOf(result.id) >= 0;
    });
}
