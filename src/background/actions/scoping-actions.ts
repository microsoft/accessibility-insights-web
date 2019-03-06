// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from '../../common/flux/action';
import { BaseActionPayload } from './action-payloads';

// tslint:disable-next-line:interface-name
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
