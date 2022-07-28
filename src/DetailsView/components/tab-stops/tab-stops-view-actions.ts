// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AsyncAction } from 'common/flux/async-action';
import { TabStopRequirementId } from 'types/tab-stop-requirement-info';

export interface EditExistingFailureInstancePayload {
    instanceId: string;
    requirementId: TabStopRequirementId;
    description: string;
}

export class TabStopsViewActions {
    public readonly createNewFailureInstancePanel = new AsyncAction<string>();
    public readonly editExistingFailureInstance =
        new AsyncAction<EditExistingFailureInstancePayload>();
    public readonly dismissPanel = new AsyncAction<void>();
    public readonly updateDescription = new AsyncAction<string>();
}
