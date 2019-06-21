// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../../../common/react/named-sfc';
import { InstanceOutcomeType } from '../instance-outcome-type';
import { OutcomeChip } from '../outcome-chip';

export type ResultSectionTitleProps = {
    title: string;
    badgeCount: number;
    outcomeType: InstanceOutcomeType;
};

export const ResultSectionTitle = NamedSFC<ResultSectionTitleProps>('ResultSectionTitle', props => {
    return (
        <div className="result-section-title">
            <h2>{props.title}</h2>
            <OutcomeChip outcomeType={props.outcomeType} count={props.badgeCount} />
        </div>
    );
});
