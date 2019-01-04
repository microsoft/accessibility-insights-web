// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseActionPayload } from './action-payloads';
import { Action } from '../../common/flux/action';

export interface IScopingPayload extends BaseActionPayload {
    inputType: string;
    selector: string[];
}

export class ScopingActions {
    public readonly openScopingPanel = new Action<void>();
    public readonly closeScopingPanel = new Action<void>();
    public readonly addSelector = new Action<IScopingPayload>();
    public readonly deleteSelector = new Action<IScopingPayload>();
    public readonly getCurrentState = new Action<void>();
}
