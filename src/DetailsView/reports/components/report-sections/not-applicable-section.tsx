// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../../../common/react/named-sfc';
import { SectionProps } from './report-section-factory';
import { ResultSectionTitle } from './result-section-title';
import { RuleDetailsGroup } from './rule-details-group';

export type NotApplicableChecksSectionProps = Pick<SectionProps, 'scanResult'>;

export const NotApplicableChecksSection = NamedSFC<NotApplicableChecksSectionProps>('NotApplicableChecksSection', props => {
    const rules = props.scanResult.inapplicable;

    return (
        <div id="not-applicable-checks-section">
            <ResultSectionTitle title="Not applicable" count={rules.length} outcomeType="incomplete" />
            <RuleDetailsGroup rules={rules} />
        </div>
    );
});
