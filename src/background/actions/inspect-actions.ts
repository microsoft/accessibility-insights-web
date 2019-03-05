// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from '../../common/flux/action';
import { InspectMode } from '../inspect-modes';
import { BaseActionPayload } from './action-payloads';

// tslint:disable-next-line:interface-name
export interface IInspectPayload extends BaseActionPayload {
    inspectMode: InspectMode;
}

export class InspectActions {
    public readonly changeInspectMode = new Action<IInspectPayload>();
    public readonly getCurrentState = new Action<void>();
    public readonly setHoveredOverSelector = new Action<string[]>();
}
