// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedSFC } from 'common/react/named-sfc';
import * as React from 'react';

import { InstanceDetailsGroupDepsV2, InstanceDetailsGroupPropsV2, InstanceDetailsGroupV2 } from './instance-details-group-v2';
import { RuleResourcesDepsV2, RuleResourcesPropsV2, RuleResourcesV2 } from './rule-resources-v2';

export type RuleContentDepsV2 = InstanceDetailsGroupDepsV2 & RuleResourcesDepsV2;

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

export type RuleContentPropsV2 = Omit<InstanceDetailsGroupPropsV2, 'deps'> &
    RuleResourcesPropsV2 & {
        deps: RuleContentDepsV2;
    };

export const RuleContentV2 = NamedSFC<RuleContentPropsV2>('RuleContentV2', props => {
    return (
        <>
            <RuleResourcesV2 {...props} />
            <InstanceDetailsGroupV2 {...props} />
        </>
    );
});
