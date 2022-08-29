// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AsyncAction } from 'common/flux/async-action';
import { DetailsViewRightContentPanelType } from '../../common/types/store-data/details-view-right-content-panel-type';

export class DetailsViewActions {
    public readonly setSelectedDetailsViewRightContentPanel =
        new AsyncAction<DetailsViewRightContentPanelType>();
    public readonly getCurrentState = new AsyncAction();
}
