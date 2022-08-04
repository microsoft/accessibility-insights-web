// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AsyncAction } from 'common/flux/async-action';
import { Tab } from 'common/types/store-data/itab';

export class TabActions {
    public readonly newTabCreated = new AsyncAction<Tab>();
    public readonly getCurrentState = new AsyncAction();
    public readonly tabRemove = new AsyncAction();
    public readonly existingTabUpdated = new AsyncAction<Tab>();
    public readonly tabVisibilityChange = new AsyncAction<boolean>();
}
