// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AsyncAction } from 'common/flux/async-action';
import { InspectMode } from '../../common/types/store-data/inspect-modes';
import { BaseActionPayload } from './action-payloads';

export interface InspectPayload extends BaseActionPayload {
    inspectMode: InspectMode;
}

export class InspectActions {
    public readonly changeInspectMode = new AsyncAction<InspectPayload>();
    public readonly getCurrentState = new AsyncAction<void>();
    public readonly setHoveredOverSelector = new AsyncAction<string[]>();
}
