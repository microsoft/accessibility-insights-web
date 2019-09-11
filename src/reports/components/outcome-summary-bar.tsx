// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-sfc';
import { kebabCase } from 'lodash';
import * as React from 'react';

import { outcomeIconMap, outcomeIconMapInverted, OutcomeStats, OutcomeType, outcomeTypeSemantics } from './outcome-type';

export type OutcomeSummaryBarProps = {
    outcomeStats: Partial<OutcomeStats>;
    allOutcomeTypes: OutcomeType[];
    iconStyleInverted?: boolean;
    countSuffix?: string;
};

export const OutcomeSummaryBar = NamedFC<OutcomeSummaryBarProps>('OutcomeSummaryBar', props => {
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
                            <span aria-hidden="true">{outcomeIcon}</span>
                            {count}
                            {countSuffix} <span className="outcome-past-tense">{text}</span>
                        </span>
                    </div>
                );
            })}
        </div>
    );
});
