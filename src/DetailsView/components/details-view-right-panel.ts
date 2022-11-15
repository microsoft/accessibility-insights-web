// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsFeatureFlagFilter } from 'assessments/assessments-feature-flag-filter';
import { AssessmentsRequirementsFilter } from 'assessments/assessments-requirements-filter';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { DetailsViewRightContentPanelType } from 'common/types/store-data/details-view-right-content-panel-type';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { OverviewSummaryReportModel } from 'reports/assessment-report-model';
import { GetAssessmentSummaryModelFromProviderAndStoreData } from 'reports/get-assessment-summary-model';
import { GetQuickAssessSummaryModelFromProviderAndStoreData } from 'reports/get-quick-assess-summary-model';
import { ReactFCWithDisplayName } from '../../common/react/named-fc';
import { DetailsViewPivotType } from '../../common/types/store-data/details-view-pivot-type';
import {
    getOverviewTitle,
    getTestViewTitle,
    GetTestViewTitleProps,
} from '../handlers/get-document-title';
import {
    GetLeftNavSelectedKeyProps,
    getOverviewKey,
    getTestViewKey,
} from './left-nav/get-left-nav-selected-key';
import {
    OverviewContainer,
    OverviewContainerDeps,
    OverviewContainerProps,
} from './overview-content/overview-content-container';
import { TargetChangeDialogDeps } from './target-change-dialog';
import {
    TestViewContainer,
    TestViewContainerDeps,
    TestViewContainerProps,
} from './test-view-container';

export type DetailsViewContentDeps = OverviewContainerDeps &
    TestViewContainerDeps &
    TargetChangeDialogDeps;

export type RightPanelProps = Omit<TestViewContainerProps, 'deps'> &
    Omit<OverviewContainerProps, 'deps'> & {
        deps: OverviewContainerDeps | TestViewContainerDeps;
    };

export type GetFilteredProviderDeps = {
    assessmentsProvider: AssessmentsProvider;
    assessmentsProviderWithFeaturesEnabled: AssessmentsFeatureFlagFilter;
    assessmentsProviderForRequirements: AssessmentsRequirementsFilter;
    quickAssessRequirementKeys: string[];
};

export type GetFilteredProviderProps = {
    deps: GetFilteredProviderDeps;
    featureFlagStoreData: FeatureFlagStoreData;
};

export type GetSummaryModelFromStoreDataDeps = {
    assessmentsProvider: AssessmentsProvider;
    getAssessmentSummaryModelFromProviderAndStoreData: GetAssessmentSummaryModelFromProviderAndStoreData;
    getQuickAssessSummaryModelFromProviderAndStoreData: GetQuickAssessSummaryModelFromProviderAndStoreData;
    quickAssessRequirementKeys: string[];
};

export type GetSummaryModelFromStoreDataProps = {
    deps: GetSummaryModelFromStoreDataDeps;
    assessmentStoreData: AssessmentStoreData;
};

export type DetailsRightPanelConfiguration = Readonly<{
    RightPanel: ReactFCWithDisplayName<RightPanelProps>;
    RightPanelProps?: {
        getFilteredProvider?: (props: GetFilteredProviderProps) => AssessmentsProvider;
        getSummaryModelFromProviderAndStoreData?: (
            props: GetSummaryModelFromStoreDataProps,
        ) => OverviewSummaryReportModel;
    };
    GetTitle: (props: GetTestViewTitleProps) => string;
    GetLeftNavSelectedKey: (props: GetLeftNavSelectedKeyProps) => string;
    GetStartOverContextualMenuItemKeys: () => string[];
}>;

export type GetDetailsRightPanelConfiguration = (
    props: GetDetailsRightPanelConfigurationProps,
) => DetailsRightPanelConfiguration;
export type GetDetailsRightPanelConfigurationProps = {
    selectedDetailsViewPivot: DetailsViewPivotType;
    detailsViewRightContentPanel: DetailsViewRightContentPanelType;
};

const TestViewPanel: DetailsRightPanelConfiguration = {
    RightPanel: TestViewContainer,
    GetTitle: getTestViewTitle,
    GetLeftNavSelectedKey: getTestViewKey,
    GetStartOverContextualMenuItemKeys: () => ['assessment', 'test'],
};

const detailsViewOverviewConfiguration: {
    [key in DetailsViewPivotType]: DetailsRightPanelConfiguration;
} = {
    [DetailsViewPivotType.assessment]: {
        RightPanel: OverviewContainer,
        RightPanelProps: {
            getFilteredProvider: (props: GetFilteredProviderProps) =>
                props.deps.assessmentsProviderWithFeaturesEnabled(
                    props.deps.assessmentsProvider,
                    props.featureFlagStoreData,
                ),
            getSummaryModelFromProviderAndStoreData: (props: GetSummaryModelFromStoreDataProps) =>
                props.deps.getAssessmentSummaryModelFromProviderAndStoreData(
                    props.deps.assessmentsProvider,
                    props.assessmentStoreData,
                ),
        },
        GetTitle: getOverviewTitle,
        GetLeftNavSelectedKey: getOverviewKey,
        GetStartOverContextualMenuItemKeys: () => ['assessment'],
    },
    [DetailsViewPivotType.mediumPass]: {
        RightPanel: OverviewContainer,
        RightPanelProps: {
            getFilteredProvider: (props: GetFilteredProviderProps) =>
                props.deps.assessmentsProviderForRequirements(
                    props.deps.assessmentsProviderWithFeaturesEnabled(
                        props.deps.assessmentsProvider,
                        props.featureFlagStoreData,
                    ),
                    props.deps.quickAssessRequirementKeys,
                ),
            getSummaryModelFromProviderAndStoreData: (props: GetSummaryModelFromStoreDataProps) =>
                props.deps.getQuickAssessSummaryModelFromProviderAndStoreData(
                    props.deps.assessmentsProvider,
                    props.assessmentStoreData,
                    props.deps.quickAssessRequirementKeys,
                ),
        },
        GetTitle: getOverviewTitle,
        GetLeftNavSelectedKey: getOverviewKey,
        GetStartOverContextualMenuItemKeys: () => ['assessment'],
    },
    [DetailsViewPivotType.fastPass]: TestViewPanel,
};

export const GetDetailsRightPanelConfiguration: GetDetailsRightPanelConfiguration = (
    props: GetDetailsRightPanelConfigurationProps,
) => {
    if (props.detailsViewRightContentPanel === 'TestView') {
        return TestViewPanel;
    }
    return detailsViewOverviewConfiguration[props.selectedDetailsViewPivot];
};
