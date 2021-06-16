// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DetailsViewRightContentPanelType } from 'DetailsView/components/left-nav/details-view-right-content-panel-type';
import { CurrentPanel } from './current-panel';

export interface DetailsViewStoreData {
    detailsViewRightContentPanel: DetailsViewRightContentPanelType;
    currentPanel: CurrentPanel;
    contentPath: string | null;
    contentTitle: string | null;
}
