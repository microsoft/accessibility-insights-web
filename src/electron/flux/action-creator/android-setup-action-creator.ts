// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AndroidSetupActions } from 'electron/flux/action/android-setup-actions';
import { NextStepPayload } from 'electron/flux/action/android-setup-payloads';

export class AndroidSetupActionCreator {
    constructor(private readonly setupActions: AndroidSetupActions) {}

    public next = (payload: NextStepPayload): void => {
        this.setupActions.next.invoke(payload);
    };
}
