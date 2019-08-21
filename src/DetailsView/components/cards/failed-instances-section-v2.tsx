// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from 'common/react/named-sfc';
import { ResultSectionV2 } from './result-section-v2';
import { FixInstructionProcessor } from '../../../injected/fix-instruction-processor';
import { GetGuidanceTagsFromGuidanceLinks } from '../../../common/get-guidance-tags-from-guidance-links';
import { UnifiedResult } from '../../../common/types/store-data/unified-data-interface';

export type FailedInstancesSectionPropsV2 = {
    fixInstructionProcessor: FixInstructionProcessor;
    result: UnifiedResult[];
    getGuidanceTagsFromGuidanceLinks: GetGuidanceTagsFromGuidanceLinks;
};

export const FailedInstancesSectionV2 = NamedSFC<FailedInstancesSectionPropsV2>(
    'FailedInstancesSection',
    ({ result, fixInstructionProcessor, getGuidanceTagsFromGuidanceLinks }) => {
        const rules = [];
        const count = result.reduce((total, rule) => {
            return total + (rule.status === 'fail' ? 1 : 0);
        }, 0);

        return (
            <ResultSectionV2
                deps={{ getGuidanceTagsFromGuidanceLinks }}
                fixInstructionProcessor={fixInstructionProcessor}
                title="Failed instances"
                rules={rules}
                containerClassName="failed-instances-section result-section"
                outcomeType="fail"
                badgeCount={count}
            />
        );
    },
);
