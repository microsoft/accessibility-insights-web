// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GetGuidanceTagsFromGuidanceLinks } from 'common/get-guidance-tags-from-guidance-links';
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

import { getPropertyConfiguration } from '../../../common/configs/unified-result-property-configurations';
import { UnifiedRuleResult } from './failed-instances-section-v2';
import { instanceDetailsList } from './instance-details-group.scss';
import { InstanceDetails, InstanceDetailsDeps } from './instance-details-v2';

export type InstanceDetailsGroupDeps = {
    getGuidanceTagsFromGuidanceLinks: GetGuidanceTagsFromGuidanceLinks;
} & InstanceDetailsDeps;

export type InstanceDetailsGroupProps = {
    deps: InstanceDetailsGroupDeps;
    rule: UnifiedRuleResult;
};

export const InstanceDetailsGroup = NamedFC<InstanceDetailsGroupProps>('InstanceDetailsGroup', props => {
    const { deps, rule } = props;
    const { nodes } = rule;

    return (
        <ul className={instanceDetailsList} aria-label="failed instances with path, snippet and how to fix information">
            {nodes.map((node, index) => (
                <li key={`instance-details-${index}`}>
                    <InstanceDetails {...{ index }} deps={deps} result={node} getPropertyConfigById={getPropertyConfiguration} />
                </li>
            ))}
        </ul>
    );
});
