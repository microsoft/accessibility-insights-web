// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedSFC } from 'common/react/named-sfc';
import * as React from 'react';

import { InstanceDetailsGroupV2, InstanceDetailsGroupV2Deps, InstanceDetailsGroupV2Props } from './instance-details-group-v2';
import { RuleResourcesV2, RuleResourcesV2Deps, RuleResourcesV2Props } from './rule-resources-v2';

export type RuleContentV2Deps = InstanceDetailsGroupV2Deps & RuleResourcesV2Deps;

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

export type RuleContentV2Props = Omit<InstanceDetailsGroupV2Props, 'deps'> &
    RuleResourcesV2Props & {
        deps: RuleContentV2Deps;
    };

export const RuleContentV2 = NamedSFC<RuleContentV2Props>('RuleContentV2', props => {
    return (
        <>
            <RuleResourcesV2 {...props} />
            <InstanceDetailsGroupV2 {...props} />
        </>
    );
});
