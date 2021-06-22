// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentDefaultMessageGenerator } from 'assessments/assessment-default-message-generator';
import { RequirementResult } from 'common/assessment/requirement';
import { NamedFC } from 'common/react/named-fc';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { PathSnippetStoreData } from 'common/types/store-data/path-snippet-store-data';
import { RequirementView, RequirementViewDeps } from 'DetailsView/components/requirement-view';
import { AssessmentInstanceTableHandler } from 'DetailsView/handlers/assessment-instance-table-handler';
import * as React from 'react';
import { AssessmentTestResult } from '../../common/assessment/assessment-test-result';
import { Tab } from '../../common/itab';
import {
    AssessmentData,
    AssessmentNavState,
    PersistedTabInfo,
} from '../../common/types/store-data/assessment-result-data';

export type ReflowAssessmentViewDeps = RequirementViewDeps;

export type ReflowAssessmentViewProps = {
    deps: ReflowAssessmentViewDeps;
    currentTarget: Tab;
    prevTarget: PersistedTabInfo;
    scanningInProgress: boolean;
    selectedRequirementIsEnabled: boolean;
    assessmentNavState: AssessmentNavState;
    assessmentData: AssessmentData;
    assessmentDefaultMessageGenerator: AssessmentDefaultMessageGenerator;
    assessmentTestResult: AssessmentTestResult;
    assessmentInstanceTableHandler: AssessmentInstanceTableHandler;
    featureFlagStoreData: FeatureFlagStoreData;
    pathSnippetStoreData: PathSnippetStoreData;
};

export const ReflowAssessmentView = NamedFC<ReflowAssessmentViewProps>(
    'ReflowAssessmentView',
    props => {
        const selectedRequirement: RequirementResult =
            props.assessmentTestResult.getRequirementResult(
                props.assessmentNavState.selectedTestSubview,
            );

        const nextRequirement = props.assessmentTestResult
            .getRequirementResults()
            .find(
                req => req.definition.order === selectedRequirement.definition.order + 1,
            )?.definition;

        return (
            <RequirementView
                deps={props.deps}
                requirement={selectedRequirement.definition}
                assessmentsProvider={props.deps.assessmentsProvider}
                assessmentNavState={props.assessmentNavState}
                instancesMap={props.assessmentData.generatedAssessmentInstancesMap}
                isRequirementEnabled={props.selectedRequirementIsEnabled}
                isRequirementScanned={selectedRequirement.data.isStepScanned}
                assessmentInstanceTableHandler={props.assessmentInstanceTableHandler}
                featureFlagStoreData={props.featureFlagStoreData}
                pathSnippetStoreData={props.pathSnippetStoreData}
                scanningInProgress={props.scanningInProgress}
                manualRequirementResultMap={props.assessmentData.manualTestStepResultMap}
                assessmentDefaultMessageGenerator={props.assessmentDefaultMessageGenerator}
                assessmentData={props.assessmentData}
                currentTarget={props.currentTarget}
                prevTarget={props.prevTarget}
                nextRequirement={nextRequirement}
            />
        );
    },
);
