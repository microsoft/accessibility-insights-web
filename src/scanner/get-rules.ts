// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Axe from 'axe-core';

import { findIndex } from 'lodash';
import { RuleSifter } from './rule-sifter';
import { ScannerRuleInfo } from './scanner-rule-info';

interface ExpectedGetRuleObject {
    help: string | Function;
    ruleId: string;
    helpUrl: string;
}

export function getRules(
    axe: typeof Axe,
    urlGenerator: (ruleId: string, axeHelpUrl: string) => string,
    ruleSifter: RuleSifter,
): ScannerRuleInfo[] {
    const defaultRules = ruleSifter.getSiftedRules();
    const allRules = axe.getRules() as ExpectedGetRuleObject[];

    return allRules.reduce((filteredArray: ScannerRuleInfo[], rule) => {
        const ruleInfoIndex = findIndex(
            defaultRules,
            ruleInfo => ruleInfo.id === rule.ruleId,
        );
        const foundRuleInfo = defaultRules[ruleInfoIndex];

        if (foundRuleInfo) {
            filteredArray.push({
                id: rule.ruleId,
                url: urlGenerator(rule.ruleId, rule.helpUrl),
                help: resolveHelp(rule.help),
                a11yCriteria: foundRuleInfo.a11yCriteria,
            });
        }

        return filteredArray;
    }, []);
}

function resolveHelp(help: string | Function): string {
    if (typeof help === 'function') {
        return help();
    }

    return help;
}
