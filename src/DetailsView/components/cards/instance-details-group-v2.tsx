// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GetGuidanceTagsFromGuidanceLinks } from 'common/get-guidance-tags-from-guidance-links';
import { NamedSFC } from 'common/react/named-sfc';
import { FixInstructionProcessor } from 'injected/fix-instruction-processor';
import * as React from 'react';
import { RuleResult } from 'scanner/iruleresults';

import { InstanceDetails } from '../../../reports/components/report-sections/instance-details';
import { UnifiedRuleResult } from './failed-instances-section-v2';

export type InstanceDetailsGroupDepsV2 = {
    getGuidanceTagsFromGuidanceLinks: GetGuidanceTagsFromGuidanceLinks;
};

export type InstanceDetailsGroupPropsV2 = {
    deps: InstanceDetailsGroupDepsV2;
    rule: UnifiedRuleResult;
    fixInstructionProcessor: FixInstructionProcessor;
};

export const InstanceDetailsGroupV2 = NamedSFC<InstanceDetailsGroupPropsV2>('InstanceDetailsGroupV2', props => {
    const { fixInstructionProcessor, rule } = props;
    const { nodes } = rule;

    return (
        <ul className="instance-details-list" aria-label="failed instances with path, snippet and how to fix information">
            {nodes.map((node, index) => (
                <li key={`instance-details-${index}`}>
                    <InstanceDetails {...{ index, ...(node as any), fixInstructionProcessor: fixInstructionProcessor }} />
                </li>
            ))}
        </ul>
    );
});
