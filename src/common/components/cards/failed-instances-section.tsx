// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

import { UnifiedResult, UnifiedRuleResultStatus } from '../../../common/types/store-data/unified-data-interface';
import { GuidanceLink } from '../../../scanner/rule-to-links-mappings';
import { UserConfigurationStoreData } from '../../types/store-data/user-configuration-store';
import { ResultSection, ResultSectionDeps } from './result-section';

export type FailedInstancesSectionDeps = ResultSectionDeps;
export type FailedInstancesSectionProps = {
    deps: FailedInstancesSectionDeps;
    ruleResultsByStatus: UnifiedStatusResults;
    userConfigurationStoreData: UserConfigurationStoreData;
};

export interface UnifiedRuleResult {
    id: string;
    nodes: UnifiedResult[];
    description: string;
    url: string;
    guidance: GuidanceLink[];
}

export type UnifiedStatusResults = {
    [key in UnifiedRuleResultStatus]: UnifiedRuleResult[];
};

export const FailedInstancesSection = NamedFC<FailedInstancesSectionProps>(
    'FailedInstancesSection',
    ({ ruleResultsByStatus, deps, userConfigurationStoreData }) => {
        if (ruleResultsByStatus == null) {
            return null;
        }

        const count = ruleResultsByStatus.fail.reduce((total, rule) => {
            return total + rule.nodes.length;
        }, 0);

        return (
            <ResultSection
                deps={deps}
                title="Failed instances"
                results={ruleResultsByStatus.fail}
                containerClassName={null}
                outcomeType="fail"
                badgeCount={count}
                userConfigurationStoreData={userConfigurationStoreData}
            />
        );
    },
);
