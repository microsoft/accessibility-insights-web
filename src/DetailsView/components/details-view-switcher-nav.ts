// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    AssessmentLeftNavHamburgerButton,
    ExpandCollpaseLeftNavButtonProps,
    FastPassLeftNavHamburgerButton,
} from 'common/components/expand-collapse-left-nav-hamburger-button';
import { AssessmentCommandBar } from 'DetailsView/components/assessment-command-bar';
import { AutomatedChecksCommandBar } from 'DetailsView/components/automated-checks-command-bar';
import {
    CommandBarProps,
    LoadAssessmentButtonFactory,
    ReportExportDialogFactory,
    SaveAssessmentButtonFactory,
} from 'DetailsView/components/details-view-command-bar';
import {
    getLoadButtonForAssessment,
    getLoadButtonForFastPass,
} from 'DetailsView/components/load-assessment-button-factory';
import {
    getReportExportDialogForAssessment,
    getReportExportDialogForFastPass,
} from 'DetailsView/components/report-export-dialog-factory';
import {
    getSaveButtonForAssessment,
    getSaveButtonForFastPass,
} from 'DetailsView/components/save-assessment-button-factory';
import {
    ShouldShowReportExportButton,
    shouldShowReportExportButtonForAssessment,
    shouldShowReportExportButtonForFastpass,
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
import { DetailsViewPivotType } from '../../common/types/details-view-pivot-type';
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
    GetSelectedDetailsViewProps,
} from './left-nav/get-selected-details-view';

export type LeftNavDeps = AssessmentLeftNavDeps & FastPassLeftNavDeps;
export type LeftNavProps = AssessmentLeftNavProps & FastPassLeftNavProps;
type InternalLeftNavProps = AssessmentLeftNavProps | FastPassLeftNavProps;

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
}>;

type InternalDetailsViewSwitcherNavConfiguration = Readonly<{
    CommandBar: ReactFCWithDisplayName<CommandBarProps>;
    ReportExportDialogFactory: ReportExportDialogFactory;
    shouldShowReportExportButton: ShouldShowReportExportButton;
    SaveAssessmentButton: SaveAssessmentButtonFactory;
    LoadAssessmentButton: LoadAssessmentButtonFactory;
    StartOverComponentFactory: StartOverComponentFactory;
    LeftNav: ReactFCWithDisplayName<InternalLeftNavProps>;
    getSelectedDetailsView: (props: GetSelectedDetailsViewProps) => VisualizationType;
    warningConfiguration: WarningConfiguration;
    leftNavHamburgerButton: ReactFCWithDisplayName<ExpandCollpaseLeftNavButtonProps>;
}>;

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
    },
    [DetailsViewPivotType.fastPass]: {
        CommandBar: AutomatedChecksCommandBar,
        ReportExportDialogFactory: getReportExportDialogForFastPass,
        shouldShowReportExportButton: shouldShowReportExportButtonForFastpass,
        SaveAssessmentButton: getSaveButtonForFastPass,
        LoadAssessmentButton: getLoadButtonForFastPass,
        StartOverComponentFactory: FastpassStartOverFactory,
        LeftNav: FastPassLeftNav,
        getSelectedDetailsView: getFastPassSelectedDetailsView,
        warningConfiguration: fastpassWarningConfiguration,
        leftNavHamburgerButton: FastPassLeftNavHamburgerButton,
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
