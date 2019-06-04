// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../../../common/react/named-sfc';
import { RuleResult } from '../../../../scanner/iruleresults';
import { OutcomeType } from '../outcome-type';
import { ResultSectionTitle } from './result-section-title';
import { RuleDetailsGroup } from './rule-details-group';

export type ResultSectionProps = {
    rules: RuleResult[];
    containerClassName: string;
    title: string;
    outcomeType: OutcomeType;
};

export const ResultSection = NamedSFC<ResultSectionProps>('ResultSection', props => {
    const { rules, containerClassName, title, outcomeType } = props;

    return (
        <div id={containerClassName}>
            <ResultSectionTitle title={title} count={rules.length} outcomeType={outcomeType} />
            <RuleDetailsGroup rules={rules} />
        </div>
    );
});
