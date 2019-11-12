// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentCommandBar } from 'DetailsView/components/assessment-command-bar';
import { AutomatedChecksCommandBar } from 'DetailsView/components/automated-checks-command-bar';
import {
    CommandBarProps,
    ReportExportComponentPropertyFactory,
    StartOverComponentPropertyFactory,
} from 'DetailsView/components/details-view-command-bar';
import {
    getReportExportComponentPropsForAssessment,
    getReportExportComponentPropsForFastPass,
} from 'DetailsView/components/report-export-component-props-factory';
import {
    getStartOverComponentPropsForAssessment,
    getStartOverComponentPropsForFastPass,
} from 'DetailsView/components/start-over-component-props-factory';
import { ReactFCWithDisplayName } from '../../common/react/named-fc';
import { DetailsViewPivotType } from '../../common/types/details-view-pivot-type';
import { VisualizationType } from '../../common/types/visualization-type';
import { AssessmentLeftNav, AssessmentLeftNavDeps, AssessmentLeftNavProps } from './left-nav/assessment-left-nav';
import { FastPassLeftNav, FastPassLeftNavDeps, FastPassLeftNavProps } from './left-nav/fast-pass-left-nav';
import {
    getAssessmentSelectedDetailsView,
    getFastPassSelectedDetailsView,
    GetSelectedDetailsViewProps,
} from './left-nav/get-selected-details-view';
import { LeftNavLinkBuilder, LeftNavLinkBuilderDeps } from './left-nav/left-nav-link-builder';
import { NavLinkHandler } from './left-nav/nav-link-handler';

export type GetLeftNavDeps = {
    navLinkHandler: NavLinkHandler;
    leftNavLinkBuilder: LeftNavLinkBuilder;
} & LeftNavLinkBuilderDeps;

export type LeftNavDeps = AssessmentLeftNavDeps & FastPassLeftNavDeps;
export type LeftNavProps = AssessmentLeftNavProps & FastPassLeftNavProps;
type InternalLeftNavProps = AssessmentLeftNavProps | FastPassLeftNavProps;

export type DetailsViewSwitcherNavConfiguration = Readonly<{
    CommandBar: ReactFCWithDisplayName<CommandBarProps>;
    ReportExportComponentPropertyFactory: ReportExportComponentPropertyFactory;
    StartOverComponentPropertyFactory: StartOverComponentPropertyFactory;
    LeftNav: ReactFCWithDisplayName<LeftNavProps>;
    getSelectedDetailsView: (props: GetSelectedDetailsViewProps) => VisualizationType;
}>;

type InternalDetailsViewSwitcherNavConfiguration = Readonly<{
    CommandBar: ReactFCWithDisplayName<CommandBarProps>;
    ReportExportComponentPropertyFactory: ReportExportComponentPropertyFactory;
    StartOverComponentPropertyFactory: StartOverComponentPropertyFactory;
    LeftNav: ReactFCWithDisplayName<InternalLeftNavProps>;
    getSelectedDetailsView: (props: GetSelectedDetailsViewProps) => VisualizationType;
}>;

export type GetDetailsSwitcherNavConfigurationProps = {
    selectedDetailsViewPivot: DetailsViewPivotType;
};

const detailsViewSwitcherNavs: { [key in DetailsViewPivotType]: InternalDetailsViewSwitcherNavConfiguration } = {
    [DetailsViewPivotType.assessment]: {
        CommandBar: AssessmentCommandBar,
        ReportExportComponentPropertyFactory: getReportExportComponentPropsForAssessment,
        StartOverComponentPropertyFactory: getStartOverComponentPropsForAssessment,
        LeftNav: AssessmentLeftNav,
        getSelectedDetailsView: getAssessmentSelectedDetailsView,
    },
    [DetailsViewPivotType.fastPass]: {
        CommandBar: AutomatedChecksCommandBar,
        ReportExportComponentPropertyFactory: getReportExportComponentPropsForFastPass,
        StartOverComponentPropertyFactory: getStartOverComponentPropsForFastPass,
        LeftNav: FastPassLeftNav,
        getSelectedDetailsView: getFastPassSelectedDetailsView,
    },
    [DetailsViewPivotType.allTest]: {
        CommandBar: null,
        ReportExportComponentPropertyFactory: null,
        StartOverComponentPropertyFactory: null,
        LeftNav: null,
        getSelectedDetailsView: null,
    },
};

export type GetDetailsSwitcherNavConfiguration = (props: GetDetailsSwitcherNavConfigurationProps) => DetailsViewSwitcherNavConfiguration;

export const GetDetailsSwitcherNavConfiguration: GetDetailsSwitcherNavConfiguration = (props: GetDetailsSwitcherNavConfigurationProps) => {
    return detailsViewSwitcherNavs[props.selectedDetailsViewPivot] as DetailsViewSwitcherNavConfiguration;
};
