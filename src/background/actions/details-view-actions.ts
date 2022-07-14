// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';
import { DetailsViewRightContentPanelType } from '../../common/types/store-data/details-view-right-content-panel-type';

export class DetailsViewActions {
    public readonly setSelectedDetailsViewRightContentPanel =
        new Action<DetailsViewRightContentPanelType>();
    public readonly getCurrentState = new Action();
}
