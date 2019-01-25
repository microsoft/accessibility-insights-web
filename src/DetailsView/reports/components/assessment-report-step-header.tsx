// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { DefaultMessageInterface } from '../../../assessments/assessment-default-message-generator';
import { NamedSFC } from '../../../common/react/named-sfc';
import { ManualTestStatus } from '../../../common/types/manual-test-status';
import { GuidanceLinks } from '../../components/guidance-links';
import { IRequirementHeaderReportModel } from '../assessment-report-model';
import { OutcomeChip } from './outcome-chip';
import { allOutcomeTypes, OutcomeTypeSemantic } from './outcome-type';

export type AssessmentReportStepHeaderDeps = {
    outcomeTypeSemanticsFromTestStatus: (testStatus: ManualTestStatus) => OutcomeTypeSemantic;
};

export interface AssessmentReportStepHeaderProps {
    deps: AssessmentReportStepHeaderDeps;
    status: ManualTestStatus;
    header: IRequirementHeaderReportModel;
    instanceCount: number;
    defaultMessageComponent: DefaultMessageInterface;
}

export const AssessmentReportStepHeader = NamedSFC<AssessmentReportStepHeaderProps>('AssessmentReportStepHeader', props => {
    const { deps, header, instanceCount, status, defaultMessageComponent } = props;
    const { outcomeTypeSemanticsFromTestStatus } = deps;

    const outcomeType = allOutcomeTypes[status];
    const minCount = header.requirementType === 'manual' && outcomeType === 'pass' ? 1 : 0;
    let count = Math.max(minCount, instanceCount);
    let message: JSX.Element = null;

    if (defaultMessageComponent && outcomeType === 'pass') {
        count = defaultMessageComponent.instanceCount;
        message = defaultMessageComponent.message;
    }

    const outcomePastTense = outcomeTypeSemanticsFromTestStatus(status).pastTense;
    const outcomeText = `${count} ${outcomePastTense}`;

    return (
        <div className="step-header">
            <h4 className="step-header-name">
                {header.displayName}:<span className="screen-reader-only">{outcomeText}</span>
            </h4>
            <span className="step-header-description">{header.description}</span>
            -
            <GuidanceLinks classNameForDiv={`test-guidance-links-group`} links={header.guidanceLinks} />
            <OutcomeChip count={count} outcomeType={outcomeType} />
            {message && <span className="step-header-message">{message}</span>}
        </div>
    );
});
