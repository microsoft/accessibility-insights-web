// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { SyncAction } from 'common/flux/sync-action';
import { TabStopRequirementId } from 'types/tab-stop-requirement-info';

export interface EditExistingFailureInstancePayload {
    instanceId: string;
    requirementId: TabStopRequirementId;
    description: string;
}

export class TabStopsViewActions {
    public readonly createNewFailureInstancePanel = new SyncAction<string>();
    public readonly editExistingFailureInstance =
        new SyncAction<EditExistingFailureInstancePayload>();
    public readonly dismissPanel = new SyncAction<void>();
    public readonly updateDescription = new SyncAction<string>();
}
