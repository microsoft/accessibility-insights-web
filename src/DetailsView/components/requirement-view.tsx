// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Requirement, VisualHelperToggleConfig } from 'assessments/types/requirement';
import { NamedFC } from 'common/react/named-fc';
import {
    AssessmentNavState,
    GeneratedAssessmentInstance,
} from 'common/types/store-data/assessment-result-data';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { RequirementInstructions } from 'DetailsView/components/requirement-instructions';
import {
    RequirementViewTitle,
    RequirementViewTitleDeps,
} from 'DetailsView/components/requirement-view-title';
import * as React from 'react';
import { DictionaryStringTo } from 'types/common-types';
import * as styles from './requirement-view.scss';

export type RequirementViewDeps = {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
} & RequirementViewTitleDeps;

export interface RequirementViewProps {
    deps: RequirementViewDeps;
    requirement: Requirement;
    assessmentsProvider: AssessmentsProvider;
    assessmentNavState: AssessmentNavState;
    instancesMap: DictionaryStringTo<GeneratedAssessmentInstance>;
    isStepEnabled: boolean;
    isStepScanned: boolean;
}

export const RequirementView = NamedFC<RequirementViewProps>('RequirementView', props => {
    const requirement: Readonly<Requirement> = props.assessmentsProvider.getStep(
        props.assessmentNavState.selectedTestType,
        props.assessmentNavState.selectedTestSubview,
    );

    const visualHelperToggleConfig: VisualHelperToggleConfig = {
        deps: props.deps,
        assessmentNavState: props.assessmentNavState,
        instancesMap: props.instancesMap,
        isStepEnabled: props.isStepEnabled,
        isStepScanned: props.isStepScanned,
    };

    const visualHelperToggle = requirement.getVisualHelperToggle
        ? requirement.getVisualHelperToggle(visualHelperToggleConfig)
        : null;

    return (
        <div className={styles.requirementView}>
            <RequirementViewTitle
                deps={props.deps}
                name={props.requirement.name}
                guidanceLinks={props.requirement.guidanceLinks}
                infoAndExamples={props.requirement.infoAndExamples}
            />
            {props.requirement.description}
            {visualHelperToggle}
            <RequirementInstructions howToTest={props.requirement.howToTest} />
        </div>
    );
});
