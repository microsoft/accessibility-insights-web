// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from 'common/react/named-sfc';
import { resultSectionTitle, screenReaderOnly, title } from '../../../reports/automated-checks-report.scss';
import { InstanceOutcomeType } from '../../../reports/components/instance-outcome-type';
import { OutcomeChip } from '../../../reports/components/outcome-chip';

export type ResultSectionTitleV2Props = {
    title: string;
    badgeCount: number;
    outcomeType: InstanceOutcomeType;
};

export const ResultSectionTitleV2 = NamedSFC<ResultSectionTitleV2Props>('ResultSectionTitleV2', props => {
    return (
        <span className={resultSectionTitle}>
            <span className={screenReaderOnly}>
                {props.title} {props.badgeCount}
            </span>
            <span className={title} aria-hidden="true">
                {props.title}
            </span>
            <span aria-hidden="true">
                <OutcomeChip outcomeType={props.outcomeType} count={props.badgeCount} />
            </span>
        </span>
    );
});
