// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';
import { BaseActionPayload } from './action-payloads';

export interface ScopingPayload extends BaseActionPayload {
    inputType: string;
    selector: string[];
}

export class ScopingActions {
    public readonly addSelector = new Action<ScopingPayload>();
    public readonly deleteSelector = new Action<ScopingPayload>();
    public readonly getCurrentState = new Action<void>();
}
