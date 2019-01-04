// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseActionPayload } from './action-payloads';
import { Action } from '../../common/flux/action';
import { InspectMode } from '../inspect-modes';

export interface IInspectPayload extends BaseActionPayload {
    inspectMode: InspectMode;
}

export class InspectActions {
    public readonly changeInspectMode = new Action<IInspectPayload>();
    public readonly getCurrentState = new Action<void>();
    public readonly setHoveredOverSelector = new Action<string[]>();
}
