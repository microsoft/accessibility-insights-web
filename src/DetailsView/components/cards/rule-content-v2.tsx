// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

import { UnifiedRuleResult } from './failed-instances-section-v2';
import { InstanceDetailsGroup, InstanceDetailsGroupDeps } from './instance-details-group-v2';
import { RuleResources, RuleResourcesDeps } from './rule-resources-v2';

export type RuleContentDeps = InstanceDetailsGroupDeps & RuleResourcesDeps;

export type RuleContentProps = {
    deps: RuleContentDeps;
    rule: UnifiedRuleResult;
};

export const RuleContent = NamedFC<RuleContentProps>('RuleContent', props => {
    return (
        <>
            <RuleResources {...props} />
            <InstanceDetailsGroup {...props} />
        </>
    );
});
