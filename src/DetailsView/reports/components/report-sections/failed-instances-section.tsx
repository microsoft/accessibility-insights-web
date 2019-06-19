// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../../../common/react/named-sfc';
import { SectionProps } from './report-section-factory';
import { ResultSection } from './result-section';

export type FailedInstancesSectionProps = Pick<SectionProps, 'scanResult' | 'getGuidanceTagsFromGuidanceLinks' | 'fixInstructionProcessor'>;

export const FailedInstancesSection = NamedSFC<FailedInstancesSectionProps>(
    'FailedInstancesSection',
    ({ scanResult, getGuidanceTagsFromGuidanceLinks, fixInstructionProcessor }) => {
        const rules = scanResult.violations;
        const count = rules.reduce((total, rule) => {
            return total + rule.nodes.length;
        }, 0);

        return (
            <ResultSection
                fixInstructionProcessor={fixInstructionProcessor}
                deps={{ getGuidanceTagsFromGuidanceLinks }}
                title="Failed instances"
                rules={rules}
                containerClassName="failed-instances-section result-section"
                outcomeType="fail"
                showDetails={true}
                badgeCount={count}
            />
        );
    },
);
