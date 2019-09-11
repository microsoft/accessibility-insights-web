// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedFC } from 'common/react/named-sfc';
import { InstanceDetailsGroup, InstanceDetailsGroupDeps, InstanceDetailsGroupProps } from './instance-details-group';
import { RuleResources, RuleResourcesDeps, RuleResourcesProps } from './rule-resources';

export type RuleContentDeps = InstanceDetailsGroupDeps & RuleResourcesDeps;

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

export type RuleContentProps = Omit<InstanceDetailsGroupProps, 'deps'> &
    RuleResourcesProps & {
        deps: RuleContentDeps;
    };

export const RuleContent = NamedFC<RuleContentProps>('RuleContent', props => {
    return (
        <>
            <RuleResources {...props} />
            <InstanceDetailsGroup {...props} />
        </>
    );
});
