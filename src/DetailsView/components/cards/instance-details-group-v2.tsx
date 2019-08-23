// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GetGuidanceTagsFromGuidanceLinks } from 'common/get-guidance-tags-from-guidance-links';
import { NamedSFC } from 'common/react/named-sfc';
import { FixInstructionProcessor } from 'injected/fix-instruction-processor';
import * as React from 'react';

import { UnifiedRuleResult } from './failed-instances-section-v2';
import { InstanceDetailsV2 } from './instance-details-v2';

export type InstanceDetailsGroupV2Deps = {
    getGuidanceTagsFromGuidanceLinks: GetGuidanceTagsFromGuidanceLinks;
};

export type InstanceDetailsGroupV2Props = {
    deps: InstanceDetailsGroupV2Deps;
    rule: UnifiedRuleResult;
    fixInstructionProcessor: FixInstructionProcessor;
};

export const InstanceDetailsGroupV2 = NamedSFC<InstanceDetailsGroupV2Props>('InstanceDetailsGroupV2', props => {
    const { fixInstructionProcessor, rule } = props;
    const { nodes } = rule;

    return (
        <ul className="instance-details-list" aria-label="failed instances with path, snippet and how to fix information">
            {nodes.map((node, index) => (
                <li key={`instance-details-${index}`}>
                    <InstanceDetailsV2 {...{ index, fixInstructionProcessor: fixInstructionProcessor }} result={node} />
                </li>
            ))}
        </ul>
    );
});
