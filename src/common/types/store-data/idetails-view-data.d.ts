// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DetailsViewRightContentPanelType } from '../../../DetailsView/components/left-nav/details-view-right-content-panel-type';
import { CurrentPanel } from './current-panel';

// tslint:disable-next-line:interface-name
export interface IDetailsViewData {
    detailsViewRightContentPanel: DetailsViewRightContentPanelType;
    currentPanel: CurrentPanel;
    contentPath: string;
}
