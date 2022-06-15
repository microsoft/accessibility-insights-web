// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CapturedInstanceActionType } from 'common/types/captured-instance-action-type';
import { TabStopRequirementId } from 'types/tab-stop-requirement-info';

export interface FailureInstanceState {
    isPanelOpen: boolean;
    selectedRequirementId: TabStopRequirementId | null;
    selectedInstanceId: string | null;
    description: string | null;
    actionType: CapturedInstanceActionType;
}

export interface TabStopsViewStoreData {
    failureInstanceState: FailureInstanceState;
}
