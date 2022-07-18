// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DetailsViewRightContentPanelType } from 'common/types/store-data/details-view-right-content-panel-type';
import { ReactFCWithDisplayName } from '../../common/react/named-fc';
import { DetailsViewPivotType } from '../../common/types/details-view-pivot-type';
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

export type DetailsRightPanelConfiguration = Readonly<{
    RightPanel: ReactFCWithDisplayName<RightPanelProps>;
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

const detailsViewTypeContentMap: {
    [key in DetailsViewRightContentPanelType]: DetailsRightPanelConfiguration;
} = {
    Overview: {
        RightPanel: OverviewContainer,
        GetTitle: getOverviewTitle,
        GetLeftNavSelectedKey: getOverviewKey,
        GetStartOverContextualMenuItemKeys: () => ['assessment'],
    },
    TestView: {
        RightPanel: TestViewContainer,
        GetTitle: getTestViewTitle,
        GetLeftNavSelectedKey: getTestViewKey,
        GetStartOverContextualMenuItemKeys: () => ['assessment', 'test'],
    },
};

export const GetDetailsRightPanelConfiguration: GetDetailsRightPanelConfiguration = (
    props: GetDetailsRightPanelConfigurationProps,
) => {
    if (props.selectedDetailsViewPivot === DetailsViewPivotType.assessment) {
        return detailsViewTypeContentMap[props.detailsViewRightContentPanel];
    }

    return detailsViewTypeContentMap.TestView;
};
