// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../../../common/react/named-sfc';
import { InstanceOutcomeType } from '../outcome-type';
import { OutcomeSummaryBar } from './outcome-summary-bar';
import { SectionProps } from './report-section-factory';

export type SummarySectionProps = Pick<SectionProps, 'scanResult'>;;

export const SummarySection = NamedSFC<SummarySectionProps>('SummarySection', props => {
    const scanResult = props.scanResult;
    const countSummary: { [type in InstanceOutcomeType]: number } = {
        pass: scanResult.passes.length,
        fail: scanResult.violations.reduce((total, violation) => {
            return total + violation.nodes.length;
        }, 0),
        inapplicable: scanResult.inapplicable.length,
    };

    return (
        <div className="summary-section">
            <h2>Summary</h2>
            <OutcomeSummaryBar {...props} {...countSummary} inverted={true} />
        </div>
    );
});
