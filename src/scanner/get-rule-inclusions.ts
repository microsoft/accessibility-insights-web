// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BestPractice } from 'scanner/rule-to-links-mappings';
import { DictionaryStringTo } from 'types/common-types';
import { HyperlinkDefinition } from 'views/content/content-page';
import * as Axe from 'axe-core';

// Temporary workaround for issue https://github.com/dequelabs/axe-core/issues/2459
const explicitlyExcludedRules: string[] = ['link-name'];

export const getRuleInclusions = (
    axe: typeof Axe,
    ruleToLinksMap: DictionaryStringTo<HyperlinkDefinition[]>,
): DictionaryStringTo<boolean> => {
    axe._audit.rules.forEach(r => {
        console.log(`${r.id}, ${r.enabled}, ${ruleToLinksMap[r.id]?.map(v => v.text).join('-')},`);
    });
    return Object.assign(
        {},
        ...axe._audit.rules.map(r => ({
            [r.id]:
                r.enabled &&
                ruleToLinksMap.hasOwnProperty(r.id) &&
                !ruleToLinksMap[r.id].includes(BestPractice) &&
                !explicitlyExcludedRules.includes(r.id),
        })),
    );
};
