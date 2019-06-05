// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../../common/react/named-sfc';
import { OutcomeIcon } from './outcome-icon';
import { allRequirementOutcomeTypes, OutcomeStats } from './requirement-outcome-type';

type OutcomeUnits = 'percentage' | 'requirements';

const outcomeText = {
    pass: 'Passed',
    incomplete: 'Incomplete',
    fail: 'Failed',
};

export type OutcomeSummaryBarProps = OutcomeStats & { units?: OutcomeUnits };

export const OutcomeSummaryBar = NamedSFC<OutcomeSummaryBarProps>('OutcomeSummaryBar', props => (
    <div className="outcome-summary-bar">
        {allRequirementOutcomeTypes.map(outcomeType => {
            const { units } = props;
            const count = props[outcomeType];
            const suffix = units === 'percentage' ? '%' : '';
            const text = outcomeText[outcomeType];
            return (
                <span key={outcomeType} className={outcomeType} style={{ flexGrow: count }}>
                    <OutcomeIcon outcomeType={outcomeType} /> {count + suffix} {text}
                </span>
            );
        })}
    </div>
));
