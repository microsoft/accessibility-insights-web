// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

import { UnifiedRuleResult } from './failed-instances-section-v2';
import { InstanceDetailsGroupV2, InstanceDetailsGroupV2Deps } from './instance-details-group-v2';
import { RuleResourcesV2, RuleResourcesV2Deps } from './rule-resources-v2';

export type RuleContentV2Deps = InstanceDetailsGroupV2Deps & RuleResourcesV2Deps;

export type RuleContentV2Props = {
    deps: RuleContentV2Deps;
    rule: UnifiedRuleResult;
};

export const RuleContentV2 = NamedFC<RuleContentV2Props>('RuleContentV2', props => {
    return (
        <>
            <RuleResourcesV2 {...props} />
            <InstanceDetailsGroupV2 {...props} />
        </>
    );
});
