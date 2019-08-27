// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedSFC } from 'common/react/named-sfc';
import * as React from 'react';

import { css } from '@uifabric/utilities';
import { GetGuidanceTagsFromGuidanceLinks } from '../../../common/get-guidance-tags-from-guidance-links';
import { ResultStatus, UnifiedResult } from '../../../common/types/store-data/unified-data-interface';
import { FixInstructionProcessor } from '../../../injected/fix-instruction-processor';
import { failedInstancesSection, resultSection } from '../../../reports/automated-checks-report.scss';
import { GuidanceLink } from '../../../scanner/rule-to-links-mappings';
import { ResultSectionV2 } from './result-section-v2';

export type FailedInstancesSectionV2Props = {
    fixInstructionProcessor: FixInstructionProcessor;
    result: UnifiedStatusResults;
    getGuidanceTagsFromGuidanceLinks: GetGuidanceTagsFromGuidanceLinks;
};

export interface UnifiedRuleResult {
    id: string;
    nodes: UnifiedResult[];
    description: string;
    url: string;
    guidance: GuidanceLink[];
}

export type UnifiedRuleResultStatus = ResultStatus | 'inapplicable';

export type UnifiedStatusResults = {
    [key in UnifiedRuleResultStatus]: UnifiedRuleResult[];
};

export const FailedInstancesSectionV2 = NamedSFC<FailedInstancesSectionV2Props>(
    'FailedInstancesSectionV2',
    ({ result, fixInstructionProcessor, getGuidanceTagsFromGuidanceLinks }) => {
        return (
            <ResultSectionV2
                deps={{ getGuidanceTagsFromGuidanceLinks }}
                fixInstructionProcessor={fixInstructionProcessor}
                title="Failed instances"
                results={result.fail}
                containerClassName={css(failedInstancesSection, resultSection)}
                outcomeType="fail"
                badgeCount={result.fail.length}
            />
        );
    },
);
