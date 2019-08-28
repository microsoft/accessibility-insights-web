// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@uifabric/utilities';
import { NamedSFC } from 'common/react/named-sfc';
import * as React from 'react';

import { UnifiedResult, UnifiedRuleResultStatus } from '../../../common/types/store-data/unified-data-interface';
import { failedInstancesSection, resultSection } from '../../../reports/automated-checks-report.scss';
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

export const FailedInstancesSectionV2 = NamedSFC<FailedInstancesSectionV2Props>('FailedInstancesSectionV2', ({ result, deps }) => {
    return (
        <ResultSectionV2
            deps={deps}
            title="Failed instances"
            results={result.fail}
            containerClassName={css(failedInstancesSection, resultSection)}
            outcomeType="fail"
            badgeCount={result.fail.length}
        />
    );
});
