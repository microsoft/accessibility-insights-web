// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { GettingStarted, RequirementName } from 'common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { assessmentTestKeyGenerator } from 'DetailsView/components/left-nav/left-nav-link-builder';
import { VisualizationType } from '../../../common/types/visualization-type';

export type GetLeftNavSelectedKeyDeps = {
    generateAssessmentTestKey: assessmentTestKeyGenerator;
};

export type GetLeftNavSelectedKeyProps = {
    deps: GetLeftNavSelectedKeyDeps;
    visualizationType: VisualizationType;
    assessmentsProvider: AssessmentsProvider;
    featureFlagStoreData: FeatureFlagStoreData;
    selectedSubview: RequirementName | GettingStarted;
};

export function getOverviewKey(): string {
    return 'Overview';
}

export function getTestViewKey(props: GetLeftNavSelectedKeyProps): string {
    if (
        props.assessmentsProvider.isValidType(props.visualizationType) === false ||
        props.assessmentsProvider.forType(props.visualizationType)?.isNonCollapsible
    ) {
        return VisualizationType[props.visualizationType];
    }

    return props.deps.generateAssessmentTestKey(props.visualizationType, props.selectedSubview);
}
