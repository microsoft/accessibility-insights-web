// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Requirement } from 'assessments/types/requirement';
import { NamedFC } from 'common/react/named-fc';
import { AssessmentNavState } from 'common/types/store-data/assessment-result-data';
import { RequirementInstructions } from 'DetailsView/components/requirement-instructions';
import {
    RequirementViewTitle,
    RequirementViewTitleDeps,
} from 'DetailsView/components/requirement-view-title';
import * as React from 'react';
import * as styles from './requirement-view.scss';

export type RequirementViewDeps = RequirementViewTitleDeps;
export interface RequirementViewProps {
    deps: RequirementViewDeps;
    requirement: Requirement;
    assessmentsProvider: AssessmentsProvider;
    assessmentNavState: AssessmentNavState;
}

export const RequirementView = NamedFC<RequirementViewProps>('RequirementView', props => {
    const selectedRequirement: Readonly<Requirement> = props.assessmentsProvider.getStep(
        props.assessmentNavState.selectedTestType,
        props.assessmentNavState.selectedTestSubview,
    );

    const hasVisualHelper: boolean = selectedRequirement.getVisualHelperToggle != null;

    return (
        <div className={styles.requirementView}>
            <RequirementViewTitle
                deps={props.deps}
                name={props.requirement.name}
                guidanceLinks={props.requirement.guidanceLinks}
                infoAndExamples={props.requirement.infoAndExamples}
            />
            {props.requirement.description}
            <RequirementInstructions howToTest={props.requirement.howToTest} />
        </div>
    );
});
