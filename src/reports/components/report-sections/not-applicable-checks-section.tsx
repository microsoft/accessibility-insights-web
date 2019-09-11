// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedFC } from 'common/react/named-sfc';
import { CollapsibleResultSection } from './collapsible-result-section';
import { SectionProps } from './report-section-factory';

export type NotApplicableChecksSectionProps = Pick<SectionProps, 'scanResult' | 'getGuidanceTagsFromGuidanceLinks'>;

export const NotApplicableChecksSection = NamedFC<NotApplicableChecksSectionProps>(
    'NotApplicableChecksSection',
    ({ scanResult, getGuidanceTagsFromGuidanceLinks }) => {
        const rules = scanResult.inapplicable;

        return (
            <CollapsibleResultSection
                deps={{ getGuidanceTagsFromGuidanceLinks }}
                title="Not applicable checks"
                rules={rules}
                containerClassName="result-section"
                outcomeType="inapplicable"
                badgeCount={rules.length}
                containerId="not-applicable-checks-section"
            />
        );
    },
);
