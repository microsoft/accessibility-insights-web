// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DetailsViewRightContentPanelType } from '../../../DetailsView/components/left-nav/details-view-right-content-panel-type';

// tslint:disable-next-line:interface-name
export interface IDetailsViewData {
    detailsViewRightContentPanel: DetailsViewRightContentPanelType;
    currentPanel: ICurrentPanel;
    contentPath: string;
}

// tslint:disable-next-line:interface-name
export interface ICurrentPanel {
    isPreviewFeaturesOpen: boolean;
    isScopingOpen: boolean;
    isContentOpen: boolean;
    isSettingsOpen: boolean;
}
