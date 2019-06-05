// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { kebabCase } from 'lodash';
import * as React from 'react';

import { NamedSFC } from '../../../../common/react/named-sfc';
import { outcomeIconMap, outcomeTypeSemantics } from '../outcome-type';
import { SectionProps } from './report-section-factory';

export type InstanceOutcomeType = 'pass' | 'fail' | 'inapplicable';
const allInstanceOutcomeTypes: InstanceOutcomeType[] = ['fail', 'pass', 'inapplicable'];

export type OutcomeSummaryBarProps = Pick<SectionProps, 'scanResult'>;

export const OutcomeSummaryBar = NamedSFC<OutcomeSummaryBarProps>('OutcomeSummaryBar', ({ scanResult }) => {
    const countSummary: { [type in InstanceOutcomeType]: number } = {
        pass: scanResult.passes.length,
        fail: scanResult.violations.reduce((total, violation) => {
            return total + violation.nodes.length;
        }, 0),
        inapplicable: scanResult.inapplicable.length,
    };

    return (
        <div className="outcome-summary-bar">
            {allInstanceOutcomeTypes.map(outcomeType => {
                const text = outcomeTypeSemantics[outcomeType];
                const outcomeIcon = outcomeIconMap[outcomeType];
                const count = countSummary[outcomeType];

                return (
                    <span key={outcomeType} className={kebabCase(outcomeType)} style={{ flexGrow: count }}>
                        {outcomeIcon} {count} {text}
                    </span>
                );
            })}
        </div>
    );
});
