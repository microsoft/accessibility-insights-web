// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentDefaultMessageGenerator } from 'assessments/assessment-default-message-generator';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { RequirementResult } from 'common/assessment/requirement';
import { DetailsViewSwitcherNavConfiguration } from 'DetailsView/components/details-view-switcher-nav';
import {
    GettingStartedView,
    GettingStartedViewDeps,
} from 'DetailsView/components/getting-started-view';
import { RequirementView, RequirementViewDeps } from 'DetailsView/components/requirement-view';
import {
    ScanIncompleteWarning,
    ScanIncompleteWarningDeps,
} from 'DetailsView/components/scan-incomplete-warning';
import {
    TargetChangeDialog,
    TargetChangeDialogDeps,
} from 'DetailsView/components/target-change-dialog';
import * as React from 'react';
import { AssessmentTestResult } from '../../common/assessment/assessment-test-result';
import { VisualizationConfiguration } from '../../common/configs/visualization-configuration';
import { NamedFC } from '../../common/react/named-fc';
import {
    AssessmentStoreData,
    gettingStartedSubview,
} from '../../common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from '../../common/types/store-data/feature-flag-store-data';
import { PathSnippetStoreData } from '../../common/types/store-data/path-snippet-store-data';
import { TabStoreData } from '../../common/types/store-data/tab-store-data';
import { VisualizationStoreData } from '../../common/types/store-data/visualization-store-data';
import { AssessmentInstanceTableHandler } from '../handlers/assessment-instance-table-handler';

export type AssessmentTestViewDeps = ScanIncompleteWarningDeps &
    TargetChangeDialogDeps &
    GettingStartedViewDeps &
    RequirementViewDeps & {
        assessmentsProvider: AssessmentsProvider;
        assessmentDefaultMessageGenerator: AssessmentDefaultMessageGenerator;
    };

export interface AssessmentTestViewProps {
    deps: AssessmentTestViewDeps;
    tabStoreData: TabStoreData;
    assessmentStoreData: AssessmentStoreData;
    pathSnippetStoreData: PathSnippetStoreData;
    visualizationStoreData: VisualizationStoreData;
    assessmentInstanceTableHandler: AssessmentInstanceTableHandler;
    configuration: VisualizationConfiguration;
    featureFlagStoreData: FeatureFlagStoreData;
    switcherNavConfiguration: DetailsViewSwitcherNavConfiguration;
}

export const AssessmentTestView = NamedFC<AssessmentTestViewProps>(
    'AssessmentTestView',
    ({ deps, ...props }) => {
        const scanningInProgress: boolean = props.visualizationStoreData.scanning !== null;
        const assessmentNavState = props.assessmentStoreData.assessmentNavState;
        const scanData = props.configuration.getStoreData(props.visualizationStoreData.tests);
        const assessmentData = props.configuration.getAssessmentData(props.assessmentStoreData);
        const prevTarget = props.assessmentStoreData.persistedTabInfo;
        const selectedRequirementIsEnabled = props.configuration.getTestStatus(
            scanData,
            assessmentNavState.selectedTestSubview,
        );
        const currentTarget = {
            id: props.tabStoreData.id,
            url: props.tabStoreData.url,
            title: props.tabStoreData.title,
        };
        const assessmentTestResult = new AssessmentTestResult(
            deps.assessmentsProvider,
            assessmentNavState.selectedTestType,
            assessmentData,
        );
        const assessment = assessmentTestResult.definition;

        const renderGettingStartedView = () => (
            <GettingStartedView deps={deps} assessment={assessmentTestResult.definition} />
        );

        const renderRequirementView = () => {
            const selectedRequirement: RequirementResult =
                assessmentTestResult.getRequirementResult(assessmentNavState.selectedTestSubview);

            const nextRequirement = assessment.requirements.find(
                r => r.order === selectedRequirement.definition.order + 1,
            );

            return (
                <RequirementView
                    deps={deps}
                    requirement={selectedRequirement.definition}
                    assessmentsProvider={deps.assessmentsProvider}
                    assessmentNavState={assessmentNavState}
                    instancesMap={assessmentData.generatedAssessmentInstancesMap}
                    isRequirementEnabled={selectedRequirementIsEnabled}
                    isRequirementScanned={selectedRequirement.data.isStepScanned}
                    assessmentInstanceTableHandler={props.assessmentInstanceTableHandler}
                    featureFlagStoreData={props.featureFlagStoreData}
                    pathSnippetStoreData={props.pathSnippetStoreData}
                    scanningInProgress={scanningInProgress}
                    manualRequirementResultMap={assessmentData.manualTestStepResultMap}
                    assessmentDefaultMessageGenerator={deps.assessmentDefaultMessageGenerator}
                    assessmentData={assessmentData}
                    currentTarget={currentTarget}
                    prevTarget={prevTarget}
                    nextRequirement={nextRequirement}
                />
            );
        };

        const mainContent =
            assessmentNavState.selectedTestSubview === gettingStartedSubview
                ? renderGettingStartedView()
                : renderRequirementView();

        return (
            <>
                <ScanIncompleteWarning
                    deps={deps}
                    warnings={assessmentData.scanIncompleteWarnings}
                    warningConfiguration={props.switcherNavConfiguration.warningConfiguration}
                    test={assessmentNavState.selectedTestType}
                />
                <TargetChangeDialog deps={deps} prevTab={prevTarget} newTab={currentTarget} />
                {mainContent}
            </>
        );
    },
);
