// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DetailsViewRightContentPanelType } from '../../../DetailsView/components/left-nav/details-view-right-content-panel-type';

export interface IDetailsViewData {
    detailsViewRightContentPanel: DetailsViewRightContentPanelType;
    currentPanel: ICurrentPanel;
    contentPath: string;
}

export interface ICurrentPanel {
    isPreviewFeaturesOpen: boolean;
    isScopingOpen: boolean;
    isContentOpen: boolean;
    isSettingsOpen: boolean;
}
