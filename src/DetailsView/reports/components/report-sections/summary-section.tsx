// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../../../common/react/named-sfc';
import { OutcomeSummaryBar, OutcomeSummaryBarProps } from './outcome-summary-bar';

export type SummarySectionProps = OutcomeSummaryBarProps;

export const SummarySection = NamedSFC<SummarySectionProps>('SummarySection', props => {
    return (
        <div className="summary-section">
            <h2>Summary</h2>
            <OutcomeSummaryBar {...props} />
        </div>
    );
});
