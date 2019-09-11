// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedFC } from 'common/react/named-sfc';
import { SectionProps } from './report-section-factory';
import { ResultSection } from './result-section';

export type FailedInstancesSectionProps = Pick<SectionProps, 'scanResult' | 'fixInstructionProcessor' | 'getGuidanceTagsFromGuidanceLinks'>;

export const FailedInstancesSection = NamedFC<FailedInstancesSectionProps>(
    'FailedInstancesSection',
    ({ scanResult, fixInstructionProcessor, getGuidanceTagsFromGuidanceLinks }) => {
        const rules = scanResult.violations;
        const count = rules.reduce((total, rule) => {
            return total + rule.nodes.length;
        }, 0);

        return (
            <ResultSection
                deps={{ getGuidanceTagsFromGuidanceLinks }}
                fixInstructionProcessor={fixInstructionProcessor}
                title="Failed instances"
                rules={rules}
                containerClassName="failed-instances-section result-section"
                outcomeType="fail"
                badgeCount={count}
            />
        );
    },
);
