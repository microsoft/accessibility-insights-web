// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

import { UserConfigurationStoreData } from '../../types/store-data/user-configuration-store';
import { UnifiedRuleResult } from './failed-instances-section';
import { InstanceDetailsGroup, InstanceDetailsGroupDeps } from './instance-details-group';
import { RuleResources, RuleResourcesDeps } from './rule-resources';

export type RuleContentDeps = InstanceDetailsGroupDeps & RuleResourcesDeps;

export type RuleContentProps = {
    deps: RuleContentDeps;
    rule: UnifiedRuleResult;
    userConfigurationStoreData: UserConfigurationStoreData;
};

export const RuleContent = NamedFC<RuleContentProps>('RuleContent', props => {
    return (
        <>
            <RuleResources {...props} />
            <InstanceDetailsGroup {...props} />
        </>
    );
});
