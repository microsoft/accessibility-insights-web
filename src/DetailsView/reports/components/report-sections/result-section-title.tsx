// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { NamedSFC } from '../../../../common/react/named-sfc';
import { OutcomeChip } from '../outcome-chip';
import { OutcomeType } from '../outcome-type';

export type ResultSectionTitlePros = {
    title: string;
    count: number;
    outcomeType: OutcomeType;
};

export const ResultSectionTitle = NamedSFC<ResultSectionTitlePros>('ResultSectionTitle', props => {
    const { title, outcomeType, count } = props;
    return (
        <div className="result-section-title">
            <h3>{title}</h3>
            <OutcomeChip outcomeType={outcomeType} count={count} />
        </div>
    );
});
