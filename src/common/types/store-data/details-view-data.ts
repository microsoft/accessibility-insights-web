// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DetailsViewRightContentPanelType } from '../../../DetailsView/components/left-nav/details-view-right-content-panel-type';
import { CurrentPanel } from './current-panel';

export interface DetailsViewData {
    detailsViewRightContentPanel: DetailsViewRightContentPanelType;
    currentPanel: CurrentPanel;
    contentPath: string;
}
