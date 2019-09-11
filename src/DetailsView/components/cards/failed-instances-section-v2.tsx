// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

import { UnifiedResult, UnifiedRuleResultStatus } from '../../../common/types/store-data/unified-data-interface';
import { GuidanceLink } from '../../../scanner/rule-to-links-mappings';
import { ResultSectionV2, ResultSectionV2Deps } from './result-section-v2';

export type FailedInstancesSectionV2Deps = ResultSectionV2Deps;
export type FailedInstancesSectionV2Props = {
    deps: FailedInstancesSectionV2Deps;
    result: UnifiedStatusResults;
};

export interface UnifiedRuleResult {
    id: string;
    nodes: UnifiedResult[];
    description: string;
    url: string;
    guidance: GuidanceLink[];
}

export type UnifiedStatusResults = {
    [key in UnifiedRuleResultStatus]: UnifiedRuleResult[];
};

export const FailedInstancesSectionV2 = NamedFC<FailedInstancesSectionV2Props>('FailedInstancesSectionV2', ({ result, deps }) => {
    if (result == null) {
        return null;
    }

    const count = result.fail.reduce((total, rule) => {
        return total + rule.nodes.length;
    }, 0);

    return (
        <ResultSectionV2
            deps={deps}
            title="Failed instances"
            results={result.fail}
            containerClassName={null}
            outcomeType="fail"
            badgeCount={count}
        />
    );
});
