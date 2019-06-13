// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../../../common/react/named-sfc';
import { FixInstructionProcessor } from '../../../../injected/fix-instruction-processor';
import { RuleResult } from '../../../../scanner/iruleresults';
import { NoFailedInstancesCongrats } from './no-failed-instances-congrats';
import { InstanceOutcomeType } from './outcome-summary-bar';
import { ResultSectionTitle } from './result-section-title';
import { RuleDetailsGroup } from './rule-details-group';

export type ResultSectionProps = {
    fixInstructionProcessor?: FixInstructionProcessor;
    rules: RuleResult[];
    containerClassName: string;
    title: string;
    outcomeType: InstanceOutcomeType;
    showDetails?: boolean;
    showCongratsIfNotInstances?: boolean;
    badgeCount: number;
};

export const ResultSection = NamedSFC<ResultSectionProps>('ResultSection', props => {
    const { rules, containerClassName, title, outcomeType, badgeCount, showCongratsIfNotInstances, fixInstructionProcessor } = props;

    let content = (
        <RuleDetailsGroup
            fixInstructionProcessor={fixInstructionProcessor}
            rules={rules}
            showDetails={props.showDetails}
            outcomeType={outcomeType}
        />
    );

    if (rules.length === 0 && showCongratsIfNotInstances) {
        content = <NoFailedInstancesCongrats />;
    }

    return (
        <div className={containerClassName}>
            <ResultSectionTitle title={title} count={badgeCount} outcomeType={outcomeType} />
            {content}
        </div>
    );
});
