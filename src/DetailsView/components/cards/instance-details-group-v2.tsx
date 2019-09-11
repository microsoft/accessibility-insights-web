// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GetGuidanceTagsFromGuidanceLinks } from 'common/get-guidance-tags-from-guidance-links';
import { NamedFC } from 'common/react/named-sfc';
import * as React from 'react';

import { getPropertyConfiguration } from '../../../common/configs/unified-result-property-configurations';
import { UnifiedRuleResult } from './failed-instances-section-v2';
import { instanceDetailsList } from './instance-details-group.scss';
import { InstanceDetailsV2, InstanceDetailsV2Deps } from './instance-details-v2';

export type InstanceDetailsGroupV2Deps = {
    getGuidanceTagsFromGuidanceLinks: GetGuidanceTagsFromGuidanceLinks;
} & InstanceDetailsV2Deps;

export type InstanceDetailsGroupV2Props = {
    deps: InstanceDetailsGroupV2Deps;
    rule: UnifiedRuleResult;
};

export const InstanceDetailsGroupV2 = NamedFC<InstanceDetailsGroupV2Props>('InstanceDetailsGroupV2', props => {
    const { deps, rule } = props;
    const { nodes } = rule;

    return (
        <ul className={instanceDetailsList} aria-label="failed instances with path, snippet and how to fix information">
            {nodes.map((node, index) => (
                <li key={`instance-details-${index}`}>
                    <InstanceDetailsV2 {...{ index }} deps={deps} result={node} getPropertyConfigById={getPropertyConfiguration} />
                </li>
            ))}
        </ul>
    );
});
