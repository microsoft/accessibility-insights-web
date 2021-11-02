// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TabStopRequirementStatus } from 'common/types/store-data/visualization-scan-result-data';

export interface TabStopsActionMessageCreator {
    onUndoClicked: (requirementId: string) => void;
    onRequirementStatusChange: (requirementId: string, newStatus: TabStopRequirementStatus) => void;
    onAddFailureInstance: (requirementId: string) => void;
}
