// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';
import { InjectedDialogOpenPayload } from './action-payloads';

export class InjectedDialogActions {
    public readonly openDialog = new Action<InjectedDialogOpenPayload>();
    public readonly closeDialog = new Action<void>();
    public readonly getCurrentState = new Action<void>();
}
