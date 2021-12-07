// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Action } from 'common/flux/action';
import { ScanCompletedPayload } from 'injected/analyzers/analyzer';
import { TabStopRequirementId } from 'types/tab-stop-requirement-info';

export interface EditExistingFailureInstancePayload {
    instanceId: string;
    requirementId: TabStopRequirementId;
    description: string;
}

export class TabStopsViewActions {
    public readonly scanCompleted = new Action<ScanCompletedPayload<any>>();
    public readonly createNewFailureInstancePanel = new Action<string>();
    public readonly editExistingFailureInstance = new Action<EditExistingFailureInstancePayload>();
    public readonly dismissPanel = new Action<void>();
    public readonly updateDescription = new Action<string>();
}
