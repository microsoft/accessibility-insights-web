// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';
import { InspectMode } from '../../common/types/store-data/inspect-modes';
import { BaseActionPayload } from './action-payloads';

export interface InspectPayload extends BaseActionPayload {
    inspectMode: InspectMode;
}

export class InspectActions {
    public readonly changeInspectMode = new Action<InspectPayload>();
    public readonly getCurrentState = new Action<void>();
    public readonly setHoveredOverSelector = new Action<string[]>();
}
