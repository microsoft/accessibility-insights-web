// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { CheckIcon } from '../../../../common/icons/check-icon';
import { CircleIcon } from '../../../../common/icons/circle-icon';
import { CrossIcon } from '../../../../common/icons/cross-icon';
import { NamedSFC } from '../../../../common/react/named-sfc';
import { SectionProps } from './report-section-factory';

const iconMap = {
    pass: <CheckIcon />,
    'not applicable': <CircleIcon />,
    fail: <CrossIcon />,
};

const outcomeText = {
    pass: 'Passed',
    'not applicable': 'Not applicable',
    fail: 'Failed',
};

type OutcomeType = 'pass' | 'fail' | 'not applicable';
const allOutcomeTypes: OutcomeType[] = ['pass', 'fail', 'not applicable'];

export type SummarySectionProps = Pick<SectionProps, 'scanResult'>;

export const SummarySection = NamedSFC<SummarySectionProps>('SummarySection', ({ scanResult }) => {
    const countSummary: { [type in OutcomeType]: number } = {
        pass: scanResult.passes.length,
        fail: scanResult.violations.reduce((total, violation) => {
            return total + violation.nodes.length;
        }, 0),
        'not applicable': scanResult.inapplicable.length,
    };

    return (
        <div className="outcome-summary-bar">
            {allOutcomeTypes.map(outcomeType => {
                const text = outcomeText[outcomeType];
                const outcomeIcon = iconMap[outcomeType];
                const count = countSummary[outcomeType];

                return (
                    <span key={outcomeType} className={outcomeType} style={{ flexGrow: count }}>
                        {outcomeIcon} {count} {text}
                    </span>
                );
            })}
        </div>
    );
});
