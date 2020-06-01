// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';
import { NextStepPayload } from 'electron/flux/action/android-setup-payloads';

export class AndroidSetupActions {
    public readonly next = new Action<NextStepPayload>();
}
