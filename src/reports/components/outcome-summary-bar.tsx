// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import classNames from 'classnames';
import { NamedFC } from 'common/react/named-fc';
import { kebabCase } from 'lodash';
import * as React from 'react';

import {
    outcomeIconMap,
    outcomeIconMapInverted,
    OutcomeStats,
    OutcomeType,
    outcomeTypeSemantics,
} from './outcome-type';

export type OutcomeSummaryBarProps = {
    outcomeStats: Partial<OutcomeStats>;
    allOutcomeTypes: OutcomeType[];
    iconStyleInverted?: boolean;
    countSuffix?: string;
    textLabel?: boolean;
};

export const outcomeSummaryBarAutomationId = 'outcome-summary-bar';

export const OutcomeSummaryBar = NamedFC<OutcomeSummaryBarProps>('OutcomeSummaryBar', props => {
    const outcomeTypesCount = props.allOutcomeTypes.length;

    const getClassNames = (outcomeType: OutcomeType, index: number) => {
        return classNames({
            [kebabCase(outcomeType)]: true,
            'summary-bar-left-edge': index === 0,
            'summary-bar-right-edge': index === outcomeTypesCount - 1,
        });
    };

    const getLabel = () => {
        const { allOutcomeTypes, outcomeStats } = props;
        const countSuffix = props.countSuffix || '';
        return allOutcomeTypes
            .map(outcomeType => {
                const count = outcomeStats[outcomeType];
                const outcomePastTense = outcomeTypeSemantics[outcomeType].pastTense;
                return `${count}${countSuffix} ${outcomePastTense}`;
            })
            .join(', ');
    };

    const getTextLabel = (outcomeType: OutcomeType) => {
        if (props.textLabel !== true) {
            return null;
        }
        const outcomePastTense = outcomeTypeSemantics[outcomeType].pastTense;
        return <span className={'label'}>{` ${outcomePastTense}`}</span>;
    };

    return (
        <div
            className="outcome-summary-bar"
            aria-label={getLabel()}
            role="img"
            data-automation-id={outcomeSummaryBarAutomationId}
        >
            {props.allOutcomeTypes.map((outcomeType, index) => {
                const { iconStyleInverted, countSuffix } = props;
                const iconMap =
                    iconStyleInverted === true ? outcomeIconMapInverted : outcomeIconMap;
                const outcomeIcon = iconMap[outcomeType];
                const count = props.outcomeStats[outcomeType];

                return (
                    <div key={outcomeType} style={{ flexGrow: count }}>
                        <span className={getClassNames(outcomeType, index)}>
                            <span aria-hidden="true">{outcomeIcon}</span>
                            {count}
                            {countSuffix}
                            {getTextLabel(outcomeType)}
                        </span>
                    </div>
                );
            })}
        </div>
    );
});
