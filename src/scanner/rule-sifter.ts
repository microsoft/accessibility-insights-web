// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HyperlinkDefinition } from '../views/content/content-page';
import { IDictionaryStringTo } from './dictionary-types';
import { isEmpty } from 'lodash';

export interface IRuleInfo {
    id: string;
    enabled: boolean;
}

export interface IRuleWithA11YCriteria {
    id: string;
    a11yCriteria: HyperlinkDefinition[];
}

export class RuleSifter {
    private readonly bestPracticeText = 'Best Practice';
    constructor(private ruleSet: IRuleInfo[], private ruleToLinksMap: IDictionaryStringTo<HyperlinkDefinition[]>) {}

    public getSiftedRules(): IRuleWithA11YCriteria[] {
        return this.ruleSet.reduce((filteredArray: IRuleWithA11YCriteria[], rule: IRuleInfo) => {
            const ruleToLinks = this.ruleToLinksMap[rule.id];

            if (!isEmpty(ruleToLinks) && rule.enabled && ruleToLinks.find(elem => elem.text === this.bestPracticeText) == null) {
                filteredArray.push({
                    id: rule.id,
                    a11yCriteria: ruleToLinks,
                });
            }

            return filteredArray;
        }, []);
    }
}
