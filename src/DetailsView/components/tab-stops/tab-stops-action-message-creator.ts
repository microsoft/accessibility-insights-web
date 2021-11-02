// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { SupportedMouseEvent } from 'common/telemetry-data-factory';
import { TabStopRequirementStatus } from 'common/types/store-data/visualization-scan-result-data';

export interface TabStopsActionMessageCreator {
    onUndoClicked: (ev: SupportedMouseEvent, requirementId: string) => void;
    onRequirementStatusChange: (
        ev: SupportedMouseEvent,
        requirementId: string,
        newStatus: TabStopRequirementStatus,
    ) => void;
    onAddFailureInstance: (ev: SupportedMouseEvent, requirementId: string) => void;
}
