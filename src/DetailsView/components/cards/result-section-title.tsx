// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-sfc';
import * as React from 'react';

import { InstanceOutcomeType } from '../../../reports/components/instance-outcome-type';
import { OutcomeChip } from '../../../reports/components/outcome-chip';
import { outcomeChipContainer, resultSectionTitle, title } from './result-section-title.scss';

export type ResultSectionTitleProps = {
    title: string;
    badgeCount: number;
    outcomeType: InstanceOutcomeType;
};

export const ResultSectionTitle = NamedFC<ResultSectionTitleProps>('ResultSectionTitle', props => {
    return (
        <span className={resultSectionTitle}>
            <span className="screen-reader-only">
                {props.title} {props.badgeCount}
            </span>
            <span className={title} aria-hidden="true">
                {props.title}
            </span>
            <span className={outcomeChipContainer} aria-hidden="true">
                <OutcomeChip outcomeType={props.outcomeType} count={props.badgeCount} />
            </span>
        </span>
    );
});
