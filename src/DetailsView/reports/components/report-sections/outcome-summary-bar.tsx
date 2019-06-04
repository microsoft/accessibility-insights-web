// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { kebabCase } from 'lodash';
import * as React from 'react';

import { CheckIcon } from '../../../../common/icons/check-icon';
import { CrossIcon } from '../../../../common/icons/cross-icon';
import { InapplicableIcon } from '../../../../common/icons/inapplicable-icon';
import { NamedSFC } from '../../../../common/react/named-sfc';
import { SectionProps } from './report-section-factory';

const iconMap = {
    pass: <CheckIcon />,
    inapplicable: <InapplicableIcon />,
    fail: <CrossIcon />,
};

export const outcomeText = {
    pass: 'Passed',
    inapplicable: 'Not applicable',
    fail: 'Failed',
};

export type InstanceOutcomeType = 'pass' | 'fail' | 'inapplicable';
const allOutcomeTypes: InstanceOutcomeType[] = ['fail', 'pass', 'inapplicable'];

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
            {allOutcomeTypes.map(outcomeType => {
                const text = outcomeText[outcomeType];
                const outcomeIcon = iconMap[outcomeType];
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
