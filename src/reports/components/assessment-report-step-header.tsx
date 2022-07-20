// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DefaultMessageInterface } from 'assessments/assessment-default-message-generator';
import { GuidanceLinks } from 'common/components/guidance-links';
import { GuidanceTags, GuidanceTagsDeps } from 'common/components/guidance-tags';
import { NamedFC } from 'common/react/named-fc';
import { LinkComponentType } from 'common/types/link-component-type';
import { ManualTestStatus } from 'common/types/store-data/manual-test-status';
import * as React from 'react';

import { RequirementHeaderReportModel } from '../assessment-report-model';
import { OutcomeChip } from './outcome-chip';
import { OutcomeTypeSemantic } from './outcome-type';
import { allRequirementOutcomeTypes } from './requirement-outcome-type';

export type AssessmentReportStepHeaderDeps = GuidanceTagsDeps & {
    outcomeTypeSemanticsFromTestStatus: (testStatus: ManualTestStatus) => OutcomeTypeSemantic;
    LinkComponent: LinkComponentType;
};

export interface AssessmentReportStepHeaderProps {
    deps: AssessmentReportStepHeaderDeps;
    status: ManualTestStatus;
    header: RequirementHeaderReportModel;
    instanceCount: number;
    defaultMessageComponent: DefaultMessageInterface;
}

export const AssessmentReportStepHeader = NamedFC<AssessmentReportStepHeaderProps>(
    'AssessmentReportStepHeader',
    props => {
        const { deps, header, instanceCount, status, defaultMessageComponent } = props;
        const { outcomeTypeSemanticsFromTestStatus } = deps;

        const outcomeType = allRequirementOutcomeTypes[status];
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
                <GuidanceLinks
                    classNameForDiv={`test-guidance-links-group`}
                    links={header.guidanceLinks}
                    LinkComponent={deps.LinkComponent}
                />
                <OutcomeChip count={count} outcomeType={outcomeType} />
                <GuidanceTags deps={deps} links={header.guidanceLinks} />
                {message && <span className="step-header-message">{message}</span>}
            </div>
        );
    },
);
