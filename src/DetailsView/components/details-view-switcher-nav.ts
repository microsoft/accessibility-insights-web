// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    AssessmentLeftNavHamburgerButton,
    ExpandCollpaseLeftNavButtonProps,
    FastPassLeftNavHamburgerButton,
    QuickAssessLeftNavHamburgerButton,
} from 'common/components/expand-collapse-left-nav-hamburger-button';
import { getNullComponent } from 'common/components/null-component';
import {
    assessmentLinkDataSource,
    quickAssessLinkDataSource,
} from 'common/constants/link-data-sources';
import { HyperlinkDefinition } from 'common/types/hyperlink-definition';
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
    TransferToAssessmentButtonFactory,
} from 'DetailsView/components/details-view-command-bar';
import {
    getAssessmentCardSelectionStoreData,
    getQuickAssessCardSelectionStoreData,
    GetSelectedAssessmentCardSelectionStoreData,
} from 'DetailsView/components/left-nav/get-selected-assessment-card-selection-store-data';
import {
    getAssessmentStoreData,
    getQuickAssessStoreData,
    GetSelectedAssessmentStoreData,
} from 'DetailsView/components/left-nav/get-selected-assessment-store-data';
import {
    QuickAssessLeftNav,
    QuickAssessLeftNavDeps,
    QuickAssessLeftNavProps,
} from 'DetailsView/components/left-nav/quick-assess-left-nav';
import {
    getLoadButtonForAssessment,
    getNullLoadButton,
} from 'DetailsView/components/load-assessment-button-factory';
import {
    OverviewHeadingIntroFactory,
    getOverviewHeadingIntroForAssessment,
} from 'DetailsView/components/overview-content/overview-heading-intro';
import {
    OverviewHelpSectionAboutFactory,
    getOverviewHelpSectionAboutForQuickAssess,
} from 'DetailsView/components/overview-content/overview-help-section-about';
import { QuickAssessCommandBar } from 'DetailsView/components/quick-assess-command-bar';
import {
    getReportExportDialogForAssessment,
    getReportExportDialogForFastPass,
    getReportExportDialogForQuickAssess,
} from 'DetailsView/components/report-export-dialog-factory';
import {
    GetRequirementViewComponentConfiguration,
    getRequirementViewComponentConfigurationForAssessment,
    getRequirementViewComponentConfigurationForFastPass,
    getRequirementViewComponentConfigurationForQuickAssess,
} from 'DetailsView/components/requirement-view-component-configuration';
import {
    getNullSaveButton,
    getSaveButtonForAssessment,
} from 'DetailsView/components/save-assessment-button-factory';
import {
    ShouldShowReportExportButton,
    shouldShowReportExportButtonForAssessment,
    shouldShowReportExportButtonForFastpass,
    shouldShowReportExportButtonForQuickAssess,
} from 'DetailsView/components/should-show-report-export-button';
import {
    AssessmentStartOverFactory,
    FastpassStartOverFactory,
    QuickAssessStartOverFactory,
    StartOverComponentFactory,
} from 'DetailsView/components/start-over-component-factory';
import { getTransferToAssessmentButton } from 'DetailsView/components/transfer-to-assessment-button';
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

export type LeftNavDeps = AssessmentLeftNavDeps & FastPassLeftNavDeps & QuickAssessLeftNavDeps;
export type LeftNavProps = AssessmentLeftNavProps & FastPassLeftNavProps & QuickAssessLeftNavProps;
type InternalLeftNavProps = AssessmentLeftNavProps | FastPassLeftNavProps | QuickAssessLeftNavProps;

export type GetSharedAssessmentFunctionalityObjects = (
    switcher: AssessmentFunctionalitySwitcher,
) => SharedAssessmentObjects;

export type DetailsViewSwitcherNavConfiguration = Readonly<{
    CommandBar: ReactFCWithDisplayName<CommandBarProps>;
    ReportExportDialogFactory: ReportExportDialogFactory;
    shouldShowReportExportButton: ShouldShowReportExportButton;
    SaveAssessmentButton: SaveAssessmentButtonFactory;
    LoadAssessmentButton: LoadAssessmentButtonFactory;
    TransferToAssessmentButton: TransferToAssessmentButtonFactory;
    StartOverComponentFactory: StartOverComponentFactory;
    LeftNav: ReactFCWithDisplayName<LeftNavProps>;
    getSelectedDetailsView: (props: GetSelectedDetailsViewProps) => VisualizationType;
    warningConfiguration: WarningConfiguration;
    leftNavHamburgerButton: ReactFCWithDisplayName<ExpandCollpaseLeftNavButtonProps>;
    getSharedAssessmentFunctionalityObjects: GetSharedAssessmentFunctionalityObjects;
    getSelectedAssessmentStoreData: GetSelectedAssessmentStoreData;
    getSelectedAssessmentCardSelectionStoreData: GetSelectedAssessmentCardSelectionStoreData;
    getRequirementViewComponentConfiguration: GetRequirementViewComponentConfiguration;
    getOverviewHeadingIntro: OverviewHeadingIntroFactory;
    linkDataSource: HyperlinkDefinition[] | null;
    getOverviewHelpSectionAbout: OverviewHelpSectionAboutFactory;
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
        TransferToAssessmentButton: getNullComponent,
        StartOverComponentFactory: AssessmentStartOverFactory,
        LeftNav: AssessmentLeftNav,
        getSelectedDetailsView: getAssessmentSelectedDetailsView,
        warningConfiguration: assessmentWarningConfiguration,
        leftNavHamburgerButton: AssessmentLeftNavHamburgerButton,
        getSharedAssessmentFunctionalityObjects: switcher => switcher.getAssessmentObjects(),
        getSelectedAssessmentStoreData: getAssessmentStoreData,
        getSelectedAssessmentCardSelectionStoreData: getAssessmentCardSelectionStoreData,
        getRequirementViewComponentConfiguration:
            getRequirementViewComponentConfigurationForAssessment,
        getOverviewHeadingIntro: getOverviewHeadingIntroForAssessment,
        linkDataSource: assessmentLinkDataSource,
        getOverviewHelpSectionAbout: getNullComponent,
    },
    [DetailsViewPivotType.quickAssess]: {
        CommandBar: QuickAssessCommandBar,
        ReportExportDialogFactory: getReportExportDialogForQuickAssess,
        shouldShowReportExportButton: shouldShowReportExportButtonForQuickAssess,
        SaveAssessmentButton: getNullSaveButton,
        LoadAssessmentButton: getNullLoadButton,
        TransferToAssessmentButton: getTransferToAssessmentButton,
        StartOverComponentFactory: QuickAssessStartOverFactory,
        LeftNav: QuickAssessLeftNav,
        getSelectedDetailsView: getQuickAssessSelectedDetailsView,
        warningConfiguration: assessmentWarningConfiguration,
        leftNavHamburgerButton: QuickAssessLeftNavHamburgerButton,
        getSharedAssessmentFunctionalityObjects: switcher => switcher.getQuickAssessObjects(),
        getSelectedAssessmentStoreData: getQuickAssessStoreData,
        getSelectedAssessmentCardSelectionStoreData: getQuickAssessCardSelectionStoreData,
        getRequirementViewComponentConfiguration:
            getRequirementViewComponentConfigurationForQuickAssess,
        getOverviewHeadingIntro: getNullComponent,
        linkDataSource: quickAssessLinkDataSource,
        getOverviewHelpSectionAbout: getOverviewHelpSectionAboutForQuickAssess,
    },
    [DetailsViewPivotType.fastPass]: {
        CommandBar: AutomatedChecksCommandBar,
        ReportExportDialogFactory: getReportExportDialogForFastPass,
        shouldShowReportExportButton: shouldShowReportExportButtonForFastpass,
        SaveAssessmentButton: getNullSaveButton,
        LoadAssessmentButton: getNullLoadButton,
        TransferToAssessmentButton: getNullComponent,
        StartOverComponentFactory: FastpassStartOverFactory,
        LeftNav: FastPassLeftNav,
        getSelectedDetailsView: getFastPassSelectedDetailsView,
        warningConfiguration: fastpassWarningConfiguration,
        leftNavHamburgerButton: FastPassLeftNavHamburgerButton,
        getSharedAssessmentFunctionalityObjects: switcher => switcher.getAssessmentObjects(),
        getRequirementViewComponentConfiguration:
            getRequirementViewComponentConfigurationForFastPass,
        getOverviewHeadingIntro: getNullComponent,
        // Getting assessmentStoreData and assessmentCardSelectionStoreData is default behavior
        getSelectedAssessmentStoreData: getAssessmentStoreData,
        getSelectedAssessmentCardSelectionStoreData: getAssessmentCardSelectionStoreData,
        linkDataSource: null,
        getOverviewHelpSectionAbout: getNullComponent,
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
