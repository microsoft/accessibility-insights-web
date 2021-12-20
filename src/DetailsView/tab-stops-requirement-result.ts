// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TabStopRequirementId } from 'types/tab-stop-requirement-info';

export interface TabStopsRequirementResultInstance {
    id: string;
    description: string;
}
export interface TabStopsRequirementResult {
    id: TabStopRequirementId;
    description: string;
    name: string;
    instances: TabStopsRequirementResultInstance[];
    isExpanded: boolean;
}
