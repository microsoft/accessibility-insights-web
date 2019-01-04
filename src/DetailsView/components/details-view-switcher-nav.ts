// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ReactSFCWithDisplayName } from '../../common/react/named-sfc';
import { CommandBarProps, CommandBarWithExportAndStartOver, BasicCommandBar } from './command-bars';
import { DetailsViewPivotType } from '../../common/types/details-view-pivot-type';

export type DetailsViewSwitcherNavConfiguration = Readonly<{
    CommandBar: ReactSFCWithDisplayName<CommandBarProps>,
}>;

export type GetDetailsSwitcherNavConfiguration = (props: GetDetailsSwitcherNavConfigurationProps) => DetailsViewSwitcherNavConfiguration;
export type GetDetailsSwitcherNavConfigurationProps = {
    selectedDetailsViewPivot: DetailsViewPivotType,
};

const detailsViewSwitcherNavs: { [key in DetailsViewPivotType]: DetailsViewSwitcherNavConfiguration } = {
    [DetailsViewPivotType.assessment]: {
        CommandBar: CommandBarWithExportAndStartOver,
    },
    [DetailsViewPivotType.fastPass]: {
        CommandBar: BasicCommandBar,
    },
    [DetailsViewPivotType.allTest]: {
        CommandBar: BasicCommandBar,
    },
};

export const GetDetailsSwitcherNavConfiguration: GetDetailsSwitcherNavConfiguration = (props: GetDetailsSwitcherNavConfigurationProps) => {
    return detailsViewSwitcherNavs[props.selectedDetailsViewPivot];
};
