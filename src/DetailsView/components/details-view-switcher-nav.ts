// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ReactFCWithDisplayName } from '../../common/react/named-fc';
import { DetailsViewPivotType } from '../../common/types/details-view-pivot-type';
import { VisualizationType } from '../../common/types/visualization-type';
import { CommandBarProps, CommandBarWithExportAndStartOver, CommandBarWithOptionalExportAndStartOver } from './command-bars';
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
    LeftNav: ReactFCWithDisplayName<LeftNavProps>;
    getSelectedDetailsView: (props: GetSelectedDetailsViewProps) => VisualizationType;
}>;

type InternalDetailsViewSwitcherNavConfiguration = Readonly<{
    CommandBar: ReactFCWithDisplayName<CommandBarProps>;
    LeftNav: ReactFCWithDisplayName<InternalLeftNavProps>;
    getSelectedDetailsView: (props: GetSelectedDetailsViewProps) => VisualizationType;
}>;

export type GetDetailsSwitcherNavConfigurationProps = {
    selectedDetailsViewPivot: DetailsViewPivotType;
};

const detailsViewSwitcherNavs: { [key in DetailsViewPivotType]: InternalDetailsViewSwitcherNavConfiguration } = {
    [DetailsViewPivotType.assessment]: {
        CommandBar: CommandBarWithExportAndStartOver,
        LeftNav: AssessmentLeftNav,
        getSelectedDetailsView: getAssessmentSelectedDetailsView,
    },
    [DetailsViewPivotType.fastPass]: {
        CommandBar: CommandBarWithOptionalExportAndStartOver,
        LeftNav: FastPassLeftNav,
        getSelectedDetailsView: getFastPassSelectedDetailsView,
    },
    [DetailsViewPivotType.allTest]: {
        CommandBar: null,
        LeftNav: null,
        getSelectedDetailsView: null,
    },
};

export type GetDetailsSwitcherNavConfiguration = (props: GetDetailsSwitcherNavConfigurationProps) => DetailsViewSwitcherNavConfiguration;

export const GetDetailsSwitcherNavConfiguration: GetDetailsSwitcherNavConfiguration = (props: GetDetailsSwitcherNavConfigurationProps) => {
    return detailsViewSwitcherNavs[props.selectedDetailsViewPivot] as DetailsViewSwitcherNavConfiguration;
};
