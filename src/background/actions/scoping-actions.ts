// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AsyncAction } from 'common/flux/async-action';
import { BaseActionPayload } from './action-payloads';

export interface ScopingPayload extends BaseActionPayload {
    inputType: string;
    selector: string[];
}

export class ScopingActions {
    public readonly addSelector = new AsyncAction<ScopingPayload>();
    public readonly deleteSelector = new AsyncAction<ScopingPayload>();
    public readonly getCurrentState = new AsyncAction<void>();
}
