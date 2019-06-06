// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../../../common/react/named-sfc';
import { RuleResult } from '../../../../scanner/iruleresults';
import { InstanceOutcomeType } from './outcome-summary-bar';
import { ResultSectionTitle } from './result-section-title';
import { RuleDetailsGroup } from './rule-details-group';

export type ResultSectionProps = {
    rules: RuleResult[];
    containerClassName: string;
    title: string;
    outcomeType: InstanceOutcomeType;
    showDetails?: boolean;
    badgeCount: number;
};

export const ResultSection = NamedSFC<ResultSectionProps>('ResultSection', props => {
    const { rules, containerClassName, title, outcomeType, badgeCount } = props;

    return (
        <div className={containerClassName}>
            <ResultSectionTitle title={title} count={badgeCount} outcomeType={outcomeType} />
            <RuleDetailsGroup rules={rules} showDetails={props.showDetails} outcomeType={outcomeType} />
        </div>
    );
});
