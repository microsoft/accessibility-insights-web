// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ReactSFCWithDisplayName } from '../../common/react/named-sfc';
import { DetailsViewPivotType } from '../../common/types/details-view-pivot-type';
import { BasicCommandBar, CommandBarProps, CommandBarWithExportAndStartOver } from './command-bars';
import { AssessmentLeftNavV2, AssessmentLeftNavV2Deps, AssessmentLeftNavV2Props } from './left-nav/assessment-left-nav-v2';
import { FastPassLeftNav, FastPassLeftNavDeps, FastPassLeftNavProps } from './left-nav/fast-pass-left-nav';
import { LeftNavLinkBuilder, LeftNavLinkBuilderDeps } from './left-nav/left-nav-link-builder';
import { NavLinkHandler } from './left-nav/nav-link-handler';

export type GetLeftNavDeps = {
    navLinkHandler: NavLinkHandler,
    leftNavLinkBuilder: LeftNavLinkBuilder,
} & LeftNavLinkBuilderDeps;

export type LeftNavDeps = AssessmentLeftNavV2Deps & FastPassLeftNavDeps;
export type LeftNavProps = AssessmentLeftNavV2Props & FastPassLeftNavProps;
type InternalLeftNavProps = AssessmentLeftNavV2Props | FastPassLeftNavProps;

export type DetailsViewSwitcherNavConfiguration = Readonly<{
    CommandBar: ReactSFCWithDisplayName<CommandBarProps>,
    LeftNav: ReactSFCWithDisplayName<LeftNavProps>;
}>;

type InternalDetailsViewSwitcherNavConfiguration = Readonly<{
    CommandBar: ReactSFCWithDisplayName<CommandBarProps>,
    LeftNav: ReactSFCWithDisplayName<InternalLeftNavProps>,
}>;

export type GetDetailsSwitcherNavConfigurationProps = {
    selectedDetailsViewPivot: DetailsViewPivotType,
};

const detailsViewSwitcherNavs: { [key in DetailsViewPivotType]: InternalDetailsViewSwitcherNavConfiguration } = {
    [DetailsViewPivotType.assessment]: {
        CommandBar: CommandBarWithExportAndStartOver,
        LeftNav: AssessmentLeftNavV2,
    },
    [DetailsViewPivotType.fastPass]: {
        CommandBar: BasicCommandBar,
        LeftNav: FastPassLeftNav,
    },
    [DetailsViewPivotType.allTest]: {
        CommandBar: BasicCommandBar,
        LeftNav: null,
    },
};

export type GetDetailsSwitcherNavConfiguration = (props: GetDetailsSwitcherNavConfigurationProps) => DetailsViewSwitcherNavConfiguration;
export const GetDetailsSwitcherNavConfiguration: GetDetailsSwitcherNavConfiguration = (props: GetDetailsSwitcherNavConfigurationProps) => {
    return detailsViewSwitcherNavs[props.selectedDetailsViewPivot] as DetailsViewSwitcherNavConfiguration;
};
