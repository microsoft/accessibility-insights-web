// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { kebabCase } from 'lodash';
import * as React from 'react';

import { NamedSFC } from '../../../common/react/named-sfc';
import { outcomeIconMap, outcomeIconMapInverted, OutcomeStats, OutcomeType, outcomeTypeSemantics, OutcomeUnits } from './outcome-type';

export type OutcomeSummaryBarProps = {
    outcomeStats: Partial<OutcomeStats>;
    allOutcomeTypes: OutcomeType[];
    iconStyleInverted?: boolean;
    countSuffix?: string;
};

export const OutcomeSummaryBar = NamedSFC<OutcomeSummaryBarProps>('OutcomeSummaryBar', props => {
    return (
        <div className="outcome-summary-bar">
            {props.allOutcomeTypes.map(outcomeType => {
                const { iconStyleInverted, countSuffix } = props;
                const text = outcomeTypeSemantics[outcomeType].pastTense;
                const iconMap = iconStyleInverted === true ? outcomeIconMapInverted : outcomeIconMap;
                const outcomeIcon = iconMap[outcomeType];
                const count = props.outcomeStats[outcomeType];

                return (
                    <div key={outcomeType} style={{ flexGrow: count }}>
                        <span className={kebabCase(outcomeType)}>
                            {outcomeIcon} {count + countSuffix} <span className="outcome-past-tense">{text}</span>
                        </span>
                    </div>
                );
            })}
        </div>
    );
});
