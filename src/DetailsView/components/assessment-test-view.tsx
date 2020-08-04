// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentDefaultMessageGenerator } from 'assessments/assessment-default-message-generator';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { DetailsViewSwitcherNavConfiguration } from 'DetailsView/components/details-view-switcher-nav';
import {
    ReflowAssessmentView,
    ReflowAssessmentViewDeps,
} from 'DetailsView/components/reflow-assessment-view';
import {
    ScanIncompleteWarning,
    ScanIncompleteWarningDeps,
} from 'DetailsView/components/scan-incomplete-warning';
import * as React from 'react';
import { AssessmentTestResult } from '../../common/assessment/assessment-test-result';
import { VisualizationConfiguration } from '../../common/configs/visualization-configuration';
import { NamedFC } from '../../common/react/named-fc';
import { AssessmentStoreData } from '../../common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from '../../common/types/store-data/feature-flag-store-data';
import { PathSnippetStoreData } from '../../common/types/store-data/path-snippet-store-data';
import { TabStoreData } from '../../common/types/store-data/tab-store-data';
import { VisualizationStoreData } from '../../common/types/store-data/visualization-store-data';
import { AssessmentInstanceTableHandler } from '../handlers/assessment-instance-table-handler';

export type AssessmentTestViewDeps = ReflowAssessmentViewDeps &
    ScanIncompleteWarningDeps & {
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
        const isScanning: boolean = props.visualizationStoreData.scanning !== null;
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

        return (
            <>
                <ScanIncompleteWarning
                    deps={deps}
                    warnings={assessmentData.scanIncompleteWarnings}
                    warningConfiguration={props.switcherNavConfiguration.warningConfiguration}
                    test={assessmentNavState.selectedTestType}
                />
                <ReflowAssessmentView
                    deps={deps}
                    currentTarget={currentTarget}
                    prevTarget={prevTarget}
                    scanningInProgress={isScanning}
                    selectedRequirementIsEnabled={selectedRequirementIsEnabled}
                    assessmentNavState={assessmentNavState}
                    assessmentData={assessmentData}
                    assessmentDefaultMessageGenerator={deps.assessmentDefaultMessageGenerator}
                    assessmentTestResult={assessmentTestResult}
                    assessmentInstanceTableHandler={props.assessmentInstanceTableHandler}
                    featureFlagStoreData={props.featureFlagStoreData}
                    pathSnippetStoreData={props.pathSnippetStoreData}
                />
            </>
        );
    },
);
