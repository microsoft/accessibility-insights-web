// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../../../common/react/named-sfc';
import { CollapsibleResultSection } from './collapsible-result-section';
import { SectionProps } from './report-section-factory';

export type NotApplicableChecksSectionProps = Pick<SectionProps, 'scanResult'>;

export const NotApplicableChecksSection = NamedSFC<NotApplicableChecksSectionProps>('NotApplicableChecksSection', ({ scanResult }) => {
    const rules = scanResult.inapplicable;

    return (
        <CollapsibleResultSection
            title="Not applicable"
            rules={rules}
            containerClassName="not-applicable-checks-section"
            outcomeType="inapplicable"
            badgeCount={rules.length}
            buttonAriaLabel="show not applicable checks list"
        />
    );
});
