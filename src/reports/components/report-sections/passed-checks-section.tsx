// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

import { CollapsibleResultSection, CollapsibleResultSectionDeps } from './collapsible-result-section';
import { SectionProps } from './report-section-factory';

export type PassedChecksSectionDeps = CollapsibleResultSectionDeps;

export type PassedChecksSectionProps = Pick<SectionProps, 'scanResult' | 'deps'>;

export const PassedChecksSection = NamedFC<PassedChecksSectionProps>('PassedChecksSection', ({ scanResult, deps }) => {
    const rules = scanResult.passes;
    return (
        <CollapsibleResultSection
            deps={deps}
            title="Passed checks"
            rules={rules}
            containerClassName="result-section"
            outcomeType="pass"
            badgeCount={rules.length}
            containerId="passed-checks-section"
        />
    );
});
