// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AndroidSetupActions } from 'electron/flux/action/android-setup-actions';

export class AndroidSetupActionCreator {
    constructor(private readonly setupActions: AndroidSetupActions) {}

    public cancel = () => {
        this.setupActions.cancel.invoke();
    };
}
