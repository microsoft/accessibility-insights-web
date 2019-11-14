// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedFC } from 'common/react/named-fc';
import {
    allInstanceOutcomeTypes,
    InstanceOutcomeType,
} from '../instance-outcome-type';
import { OutcomeSummaryBar } from '../outcome-summary-bar';
import { SectionProps } from './report-section-factory';

export type SummarySectionProps = Pick<SectionProps, 'scanResult'>;

export const SummarySection = NamedFC<SummarySectionProps>(
    'SummarySection',
    props => {
        const scanResult = props.scanResult;
        const countSummary: { [type in InstanceOutcomeType]: number } = {
            fail: scanResult.violations.reduce((total, violation) => {
                return total + violation.nodes.length;
            }, 0),
            pass: scanResult.passes.length,
            inapplicable: scanResult.inapplicable.length,
        };

        return (
            <div className="summary-section">
                <h2>Summary</h2>
                <OutcomeSummaryBar
                    {...props}
                    outcomeStats={countSummary}
                    iconStyleInverted={true}
                    allOutcomeTypes={allInstanceOutcomeTypes}
                />
            </div>
        );
    },
);
