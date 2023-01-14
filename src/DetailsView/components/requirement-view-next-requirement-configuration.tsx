// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PrimaryButton } from '@fluentui/react';
import { AutomatedChecks } from 'assessments/automated-checks/assessment';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';
import { Requirement } from 'assessments/types/requirement';
import { AssessmentNavState } from 'common/types/store-data/assessment-result-data';
import { VisualizationType } from 'common/types/visualization-type';
import {
    NextRequirementButton,
    NextRequirementButtonDeps,
} from 'DetailsView/components/next-requirement-button';
import { DataTransferViewController } from 'DetailsView/data-transfer-view-controller';
import * as React from 'react';

export type GetNextRequirementConfigurationDeps = {
    mediumPassRequirementKeys: string[];
    getProvider: () => AssessmentsProvider;
    dataTransferViewController: DataTransferViewController;
} & NextRequirementButtonDeps;

export type GetNextRequirementConfigurationProps = {
    deps: GetNextRequirementConfigurationDeps;
    currentRequirement: Requirement;
    currentAssessment: Assessment;
    assessmentNavState: AssessmentNavState;
    className?: string;
};

export type NextRequirementButtonConfiguration = {
    nextRequirement: Requirement;
    nextRequirementVisualizationType: VisualizationType;
};

export type GetNextRequirementButtonConfiguration = (
    props: GetNextRequirementConfigurationProps,
) => JSX.Element;

export const getNextRequirementConfigurationForAssessment = (
    props: GetNextRequirementConfigurationProps,
) => {
    const requirementIndex: number = props.currentAssessment.requirements.findIndex(
        r => r.key === props.currentRequirement.key,
    );
    const nextRequirement: Requirement =
        props.currentAssessment.requirements[requirementIndex + 1] ?? null;
    const nextRequirementVisualizationType: VisualizationType =
        props.assessmentNavState.selectedTestType;
    return (
        <NextRequirementButton
            deps={props.deps}
            nextRequirement={nextRequirement}
            nextRequirementVisualizationType={nextRequirementVisualizationType}
            className={props.className}
        />
    );
};

export const getNextRequirementConfigurationForQuickAssess = (
    props: GetNextRequirementConfigurationProps,
): JSX.Element => {
    if (props.currentAssessment.key === AutomatedChecks.key) {
        return getNextRequirementConfigurationForAssessment(props);
    }

    const requirementIndex = props.deps.mediumPassRequirementKeys.findIndex(
        r => r === props.currentRequirement.key,
    );
    if (requirementIndex === props.deps.mediumPassRequirementKeys.length - 1) {
        return (
            <PrimaryButton
                text={'Complete'}
                className={props.className}
                onClick={
                    props.deps.dataTransferViewController.showQuickAssessToAssessmentConfirmDialog
                }
            ></PrimaryButton>
        );
    }

    const nextRequirementKey = props.deps.mediumPassRequirementKeys[requirementIndex + 1];
    const nextAssessment = props.deps.getProvider().forRequirementKey(nextRequirementKey);
    return (
        <NextRequirementButton
            deps={props.deps}
            nextRequirement={
                nextAssessment!.requirements.find(r => r.key === nextRequirementKey) as Requirement
            }
            nextRequirementVisualizationType={nextAssessment!.visualizationType}
            className={props.className}
        />
    );
};
