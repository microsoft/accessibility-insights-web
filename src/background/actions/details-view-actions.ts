// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SyncAction } from 'common/flux/sync-action';
import { DetailsViewRightContentPanelType } from '../../DetailsView/components/left-nav/details-view-right-content-panel-type';

export class DetailsViewActions {
    public readonly setSelectedDetailsViewRightContentPanel =
        new SyncAction<DetailsViewRightContentPanelType>();
    public readonly getCurrentState = new SyncAction();
}
