// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../../../common/react/named-sfc';
import { SectionProps } from './report-section-factory';
import { ResultSection } from './result-section';

export type PassedChecksSectionProps = Pick<SectionProps, 'scanResult' | 'getGuidanceTagsFromGuidanceLinks'>;

export const PassedChecksSection = NamedSFC<PassedChecksSectionProps>(
    'PassedChecksSection',
    ({ scanResult, getGuidanceTagsFromGuidanceLinks }) => {
        const rules = scanResult.passes;
        return (
            <ResultSection
                deps={{ getGuidanceTagsFromGuidanceLinks }}
                title="Passed checks"
                rules={rules}
                containerClassName="passed-checks-section"
                outcomeType="pass"
                badgeCount={rules.length}
            />
        );
    },
);
