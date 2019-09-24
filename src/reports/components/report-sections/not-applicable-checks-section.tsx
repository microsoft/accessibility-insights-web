// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedFC } from 'common/react/named-fc';
import { CollapsibleResultSection, CollapsibleResultSectionDeps } from './collapsible-result-section';
import { SectionProps } from './report-section-factory';

export type NotApplicableChecksSectionDeps = CollapsibleResultSectionDeps;

export type NotApplicableChecksSectionProps = Pick<SectionProps, 'scanResult' | 'deps'>;

export const NotApplicableChecksSection = NamedFC<NotApplicableChecksSectionProps>('NotApplicableChecksSection', ({ scanResult, deps }) => {
    const rules = scanResult.inapplicable;

    return (
        <CollapsibleResultSection
            deps={deps}
            title="Not applicable checks"
            rules={rules}
            containerClassName="result-section"
            outcomeType="inapplicable"
            badgeCount={rules.length}
            containerId="not-applicable-checks-section"
        />
    );
});
