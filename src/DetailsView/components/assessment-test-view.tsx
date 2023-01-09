// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { BannerWarnings } from 'DetailsView/components/banner-warnings';
import { DetailsViewSwitcherNavConfiguration } from 'DetailsView/components/details-view-switcher-nav';
import {
    GettingStartedView,
    GettingStartedViewDeps,
} from 'DetailsView/components/getting-started-view';
import { RequirementView, RequirementViewDeps } from 'DetailsView/components/requirement-view';
import { ScanIncompleteWarningDeps } from 'DetailsView/components/scan-incomplete-warning';
import {
    TargetChangeDialog,
    TargetChangeDialogDeps,
} from 'DetailsView/components/target-change-dialog';
import * as React from 'react';
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

export type AssessmentTestViewDeps = {
    getProvider: () => AssessmentsProvider;
} & ScanIncompleteWarningDeps &
    TargetChangeDialogDeps &
    GettingStartedViewDeps &
    RequirementViewDeps;

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
        const assessment = deps.getProvider().forType(assessmentNavState.selectedTestType);
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

        const isGettingStartedSelected =
            assessmentNavState.selectedTestSubview === gettingStartedSubview;

        const requirementViewComponentConfiguration =
            props.switcherNavConfiguration.getRequirementViewComponentConfiguration();

        return (
            <>
                <BannerWarnings
                    deps={deps}
                    warnings={assessmentData.scanIncompleteWarnings}
                    warningConfiguration={props.switcherNavConfiguration.warningConfiguration}
                    test={assessmentNavState.selectedTestType}
                    visualizationStoreData={props.visualizationStoreData}
                />
                <TargetChangeDialog deps={deps} prevTab={prevTarget} newTab={currentTarget} />
                {isGettingStartedSelected ? (
                    <GettingStartedView deps={deps} assessment={assessment} />
                ) : (
                    <RequirementView
                        deps={deps}
                        assessmentNavState={assessmentNavState}
                        isRequirementEnabled={selectedRequirementIsEnabled}
                        assessmentInstanceTableHandler={props.assessmentInstanceTableHandler}
                        featureFlagStoreData={props.featureFlagStoreData}
                        pathSnippetStoreData={props.pathSnippetStoreData}
                        scanningInProgress={scanningInProgress}
                        assessmentData={assessmentData}
                        currentTarget={currentTarget}
                        prevTarget={prevTarget}
                        requirementViewComponentConfiguration={
                            requirementViewComponentConfiguration
                        }
                    />
                )}
            </>
        );
    },
);
