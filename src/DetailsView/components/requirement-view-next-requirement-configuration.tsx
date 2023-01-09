// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AutomatedChecks } from 'assessments/automated-checks/assessment';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';
import { Requirement } from 'assessments/types/requirement';
import { AssessmentNavState } from 'common/types/store-data/assessment-result-data';
import { VisualizationType } from 'common/types/visualization-type';
import { NextRequirementButtonDeps } from 'DetailsView/components/next-requirement-button';

export type GetNextRequirementConfigurationDeps = {
    mediumPassRequirementKeys: string[];
    getProvider: () => AssessmentsProvider;
} & NextRequirementButtonDeps;

export type GetNextRequirementConfigurationProps = {
    deps: GetNextRequirementConfigurationDeps;
    currentRequirement: Requirement;
    currentAssessment: Assessment;
    assessmentNavState: AssessmentNavState;
};

export type NextRequirementButtonConfiguration = {
    nextRequirement: Requirement;
    nextRequirementVisualizationType: VisualizationType;
};

export type GetNextRequirementButtonConfiguration = (
    props: GetNextRequirementConfigurationProps,
) => NextRequirementButtonConfiguration;

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
    return {
        nextRequirement,
        nextRequirementVisualizationType,
    };
};

export const getNextRequirementConfigurationForQuickAssess = (
    props: GetNextRequirementConfigurationProps,
) => {
    if (props.currentAssessment.key === AutomatedChecks.key) {
        return getNextRequirementConfigurationForAssessment(props);
    }
    const requirementIndex = props.deps.mediumPassRequirementKeys.findIndex(
        r => r === props.currentRequirement.key,
    );
    if (requirementIndex === props.deps.mediumPassRequirementKeys.length - 1) {
        //TODO: special go to assessment button
        return {
            nextRequirement: null,
            nextRequirementVisualizationType: props.assessmentNavState.selectedTestType,
        };
    } else {
        const nextRequirementKey = props.deps.mediumPassRequirementKeys[requirementIndex + 1];
        const nextAssessment = props.deps.getProvider().forRequirementKey(nextRequirementKey);
        return {
            nextRequirement: nextAssessment!.requirements.find(r => r.key === nextRequirementKey),
            nextRequirementVisualizationType: nextAssessment!.visualizationType,
        };
    }
};
