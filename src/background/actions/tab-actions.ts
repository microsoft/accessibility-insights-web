// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';
import { Tab } from 'common/itab';

export class TabActions {
    public readonly newTabCreated = new Action<Tab>();
    public readonly getCurrentState = new Action();
    public readonly injectedScripts = new Action();
    public readonly tabRemove = new Action();
    public readonly existingTabUpdated = new Action<Tab>();
    public readonly tabVisibilityChange = new Action<boolean>();
}
