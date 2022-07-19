// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CurrentPanel } from './current-panel';
import { DetailsViewRightContentPanelType } from './details-view-right-content-panel-type';

export interface DetailsViewStoreData {
    detailsViewRightContentPanel: DetailsViewRightContentPanelType;
    currentPanel: CurrentPanel;
    contentPath: string | null;
    contentTitle: string | null;
}
