// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SyncAction } from 'common/flux/sync-action';
import { InspectMode } from '../inspect-modes';
import { BaseActionPayload } from './action-payloads';

export interface InspectPayload extends BaseActionPayload {
    inspectMode: InspectMode;
}

export class InspectActions {
    public readonly changeInspectMode = new SyncAction<InspectPayload>();
    public readonly getCurrentState = new SyncAction<void>();
    public readonly setHoveredOverSelector = new SyncAction<string[]>();
}
