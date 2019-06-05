// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../../../common/react/named-sfc';
import { OutcomeChip } from '../outcome-chip';
import { InstanceOutcomeType } from './outcome-summary-bar';

export type ResultSectionTitlePros = {
    title: string;
    count: number;
    outcomeType: InstanceOutcomeType;
};

export const ResultSectionTitle = NamedSFC<ResultSectionTitlePros>('ResultSectionTitle', props => {
    return (
        <div className="result-section-title">
            <h3>{props.title}</h3>
            <OutcomeChip outcomeType={props.outcomeType} count={props.count} />
        </div>
    );
});
