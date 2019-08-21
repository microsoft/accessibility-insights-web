// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GetGuidanceTagsFromGuidanceLinks } from 'common/get-guidance-tags-from-guidance-links';
import { NamedSFC } from 'common/react/named-sfc';
import { FixInstructionProcessor } from 'injected/fix-instruction-processor';
import * as React from 'react';
import { RuleResult } from 'scanner/iruleresults';

import { InstanceDetails } from './instance-details';

export type InstanceDetailsGroupDeps = {
    getGuidanceTagsFromGuidanceLinks: GetGuidanceTagsFromGuidanceLinks;
};

export type InstanceDetailsGroupProps = {
    deps: InstanceDetailsGroupDeps;
    rule: RuleResult;
    fixInstructionProcessor: FixInstructionProcessor;
};

export const InstanceDetailsGroup = NamedSFC<InstanceDetailsGroupProps>('InstanceDetailsGroup', props => {
    const { fixInstructionProcessor, rule } = props;
    const { nodes } = rule;

    return (
        <ul className="instance-details-list" aria-label="failed instances with path, snippet and how to fix information">
            {nodes.map((node, index) => (
                <li key={`instance-details-${index}`}>
                    <InstanceDetails {...{ index, ...node, fixInstructionProcessor: fixInstructionProcessor }} />
                </li>
            ))}
        </ul>
    );
});
