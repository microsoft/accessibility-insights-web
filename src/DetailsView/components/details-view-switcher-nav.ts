// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    AssessmentLeftNavHamburgerButton,
    ExpandCollpaseLeftNavButtonProps,
    FastPassLeftNavHamburgerButton,
    MediumPassLeftNavHamburgerButton,
} from 'common/components/expand-collapse-left-nav-hamburger-button';
import {
    AssessmentFunctionalitySwitcher,
    SharedAssessmentObjects,
} from 'DetailsView/assessment-functionality-switcher';
import { AssessmentCommandBar } from 'DetailsView/components/assessment-command-bar';
import { AutomatedChecksCommandBar } from 'DetailsView/components/automated-checks-command-bar';
import {
    CommandBarProps,
    LoadAssessmentButtonFactory,
    ReportExportDialogFactory,
    SaveAssessmentButtonFactory,
} from 'DetailsView/components/details-view-command-bar';
import {
    getAssessmentStoreData,
    getQuickAssessStoreData,
    GetSelectedAssessmentStoreData,
} from 'DetailsView/components/left-nav/get-selected-assessment-store-data';
import {
    MediumPassLeftNav,
    MediumPassLeftNavDeps,
    MediumPassLeftNavProps,
} from 'DetailsView/components/left-nav/medium-pass-left-nav';
import {
    getLoadButtonForAssessment,
    getNullLoadButton,
} from 'DetailsView/components/load-assessment-button-factory';
import { MediumPassCommandBar } from 'DetailsView/components/medium-pass-command-bar';
import {
    overviewHeadingIntroTextForAssessment,
    overviewHeadingIntroTextForQuickAssess,
} from 'DetailsView/components/overview-content/overview-heading-intro-text';
import {
    getReportExportDialogForAssessment,
    getReportExportDialogForFastPass,
    getReportExportDialogForMediumPass,
} from 'DetailsView/components/report-export-dialog-factory';
import {
    GetRequirementViewComponentConfiguration,
    getRequirementViewComponentConfigurationForAssessment,
    getRequirementViewComponentConfigurationForQuickAssess,
    getRequirementViewComponentConfigurationForFastPass,
} from 'DetailsView/components/requirement-view-component-configuration';
import {
    getNullSaveButton,
    getSaveButtonForAssessment,
} from 'DetailsView/components/save-assessment-button-factory';
import {
    ShouldShowReportExportButton,
    shouldShowReportExportButtonForAssessment,
    shouldShowReportExportButtonForFastpass,
    shouldShowReportExportButtonForMediumPass,
} from 'DetailsView/components/should-show-report-export-button';
import {
    AssessmentStartOverFactory,
    FastpassStartOverFactory,
    StartOverComponentFactory,
} from 'DetailsView/components/start-over-component-factory';
import {
    assessmentWarningConfiguration,
    fastpassWarningConfiguration,
    WarningConfiguration,
} from 'DetailsView/components/warning-configuration';
import { ReactFCWithDisplayName } from '../../common/react/named-fc';
import { DetailsViewPivotType } from '../../common/types/store-data/details-view-pivot-type';
import { VisualizationType } from '../../common/types/visualization-type';
import {
    AssessmentLeftNav,
    AssessmentLeftNavDeps,
    AssessmentLeftNavProps,
} from './left-nav/assessment-left-nav';
import {
    FastPassLeftNav,
    FastPassLeftNavDeps,
    FastPassLeftNavProps,
} from './left-nav/fast-pass-left-nav';
import {
    getAssessmentSelectedDetailsView,
    getFastPassSelectedDetailsView,
    getQuickAssessSelectedDetailsView,
    GetSelectedDetailsViewProps,
} from './left-nav/get-selected-details-view';

export type LeftNavDeps = AssessmentLeftNavDeps & FastPassLeftNavDeps & MediumPassLeftNavDeps;
export type LeftNavProps = AssessmentLeftNavProps & FastPassLeftNavProps & MediumPassLeftNavProps;
type InternalLeftNavProps = AssessmentLeftNavProps | FastPassLeftNavProps | MediumPassLeftNavProps;

export type GetSharedAssessmentFunctionalityObjects = (
    switcher: AssessmentFunctionalitySwitcher,
) => SharedAssessmentObjects;

export type DetailsViewSwitcherNavConfiguration = Readonly<{
    CommandBar: ReactFCWithDisplayName<CommandBarProps>;
    ReportExportDialogFactory: ReportExportDialogFactory;
    shouldShowReportExportButton: ShouldShowReportExportButton;
    SaveAssessmentButton: SaveAssessmentButtonFactory;
    LoadAssessmentButton: LoadAssessmentButtonFactory;
    StartOverComponentFactory: StartOverComponentFactory;
    LeftNav: ReactFCWithDisplayName<LeftNavProps>;
    getSelectedDetailsView: (props: GetSelectedDetailsViewProps) => VisualizationType;
    warningConfiguration: WarningConfiguration;
    leftNavHamburgerButton: ReactFCWithDisplayName<ExpandCollpaseLeftNavButtonProps>;
    getSharedAssessmentFunctionalityObjects: GetSharedAssessmentFunctionalityObjects;
    getSelectedAssessmentStoreData: GetSelectedAssessmentStoreData;
    getRequirementViewComponentConfiguration: GetRequirementViewComponentConfiguration;
    overviewHeadingIntroText: string;
}>;

type InternalDetailsViewSwitcherNavConfiguration = Omit<
    DetailsViewSwitcherNavConfiguration,
    'LeftNav'
> & {
    LeftNav: ReactFCWithDisplayName<InternalLeftNavProps>;
};

export type GetDetailsSwitcherNavConfigurationProps = {
    selectedDetailsViewPivot: DetailsViewPivotType;
};

const detailsViewSwitcherNavs: {
    [key in DetailsViewPivotType]: InternalDetailsViewSwitcherNavConfiguration;
} = {
    [DetailsViewPivotType.assessment]: {
        CommandBar: AssessmentCommandBar,
        ReportExportDialogFactory: getReportExportDialogForAssessment,
        shouldShowReportExportButton: shouldShowReportExportButtonForAssessment,
        SaveAssessmentButton: getSaveButtonForAssessment,
        LoadAssessmentButton: getLoadButtonForAssessment,
        StartOverComponentFactory: AssessmentStartOverFactory,
        LeftNav: AssessmentLeftNav,
        getSelectedDetailsView: getAssessmentSelectedDetailsView,
        warningConfiguration: assessmentWarningConfiguration,
        leftNavHamburgerButton: AssessmentLeftNavHamburgerButton,
        getSharedAssessmentFunctionalityObjects: switcher => switcher.getAssessmentObjects(),
        getSelectedAssessmentStoreData: getAssessmentStoreData,
        getRequirementViewComponentConfiguration:
            getRequirementViewComponentConfigurationForAssessment,
        overviewHeadingIntroText: overviewHeadingIntroTextForAssessment,
    },
    [DetailsViewPivotType.mediumPass]: {
        CommandBar: MediumPassCommandBar,
        ReportExportDialogFactory: getReportExportDialogForMediumPass,
        shouldShowReportExportButton: shouldShowReportExportButtonForMediumPass,
        SaveAssessmentButton: getNullSaveButton,
        LoadAssessmentButton: getNullLoadButton,
        StartOverComponentFactory: AssessmentStartOverFactory,
        LeftNav: MediumPassLeftNav,
        getSelectedDetailsView: getQuickAssessSelectedDetailsView,
        warningConfiguration: assessmentWarningConfiguration,
        leftNavHamburgerButton: MediumPassLeftNavHamburgerButton,
        getSharedAssessmentFunctionalityObjects: switcher => switcher.getQuickAssessObjects(),
        getSelectedAssessmentStoreData: getQuickAssessStoreData,
        shouldShowQuickAssessRequirementView: true,
        getRequirementViewComponentConfiguration:
            getRequirementViewComponentConfigurationForQuickAssess,
        overviewHeadingIntroText: overviewHeadingIntroTextForQuickAssess,
    },
    [DetailsViewPivotType.fastPass]: {
        CommandBar: AutomatedChecksCommandBar,
        ReportExportDialogFactory: getReportExportDialogForFastPass,
        shouldShowReportExportButton: shouldShowReportExportButtonForFastpass,
        SaveAssessmentButton: getNullSaveButton,
        LoadAssessmentButton: getNullLoadButton,
        StartOverComponentFactory: FastpassStartOverFactory,
        LeftNav: FastPassLeftNav,
        getSelectedDetailsView: getFastPassSelectedDetailsView,
        warningConfiguration: fastpassWarningConfiguration,
        leftNavHamburgerButton: FastPassLeftNavHamburgerButton,
        getSharedAssessmentFunctionalityObjects: switcher => switcher.getAssessmentObjects(),
        getRequirementViewComponentConfiguration:
            getRequirementViewComponentConfigurationForFastPass,
        overviewHeadingIntroText: null,
        // Getting assessmentStoreData is default behavior
        getSelectedAssessmentStoreData: getAssessmentStoreData,
    },
};

export type GetDetailsSwitcherNavConfiguration = (
    props: GetDetailsSwitcherNavConfigurationProps,
) => DetailsViewSwitcherNavConfiguration;

export const GetDetailsSwitcherNavConfiguration: GetDetailsSwitcherNavConfiguration = (
    props: GetDetailsSwitcherNavConfigurationProps,
) => {
    return detailsViewSwitcherNavs[
        props.selectedDetailsViewPivot
    ] as DetailsViewSwitcherNavConfiguration;
};
