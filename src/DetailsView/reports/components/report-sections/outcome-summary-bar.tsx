// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { kebabCase } from 'lodash';
import * as React from 'react';

import { NamedSFC } from '../../../../common/react/named-sfc';
import {
    allOutcomeTypes,
    outcomeIconMap,
    outcomeIconMapInverted,
    OutcomeStats,
    outcomeTypeSemantics,
    OutcomeUnits,
} from '../outcome-type';

export type OutcomeSummaryBarProps = Partial<OutcomeStats> & { units?: OutcomeUnits, inverted?: boolean };

export const OutcomeSummaryBar = NamedSFC<OutcomeSummaryBarProps>('OutcomeSummaryBar', (props) => {
    return (
        <div className="outcome-summary-bar">
            {allOutcomeTypes
                .filter(outcomeType => props[outcomeType] != null)
                .map(outcomeType => {
                    const { units, inverted } = props;
                    const text = outcomeTypeSemantics[outcomeType].pastTense;
                    const iconMap = inverted === true ? outcomeIconMapInverted : outcomeIconMap;
                    const outcomeIcon = iconMap[outcomeType];
                    const count = props[outcomeType];
                    const suffix = units === 'percentage' ? '% ' : '';

                    return (
                        <div key={outcomeType} style={{ flexGrow: count }}>
                            <span className={kebabCase(outcomeType)}>
                                {outcomeIcon} {count + suffix} <span className="outcome-past-tense">{text}</span>
                            </span>
                        </div>
                    );
                })}
        </div>
    );
});
