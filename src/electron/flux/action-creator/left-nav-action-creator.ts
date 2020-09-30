// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { LeftNavActions } from 'electron/flux/action/left-nav-actions';
import { LeftNavItemKey } from 'electron/types/left-nav-item-key';

export class LeftNavActionCreator {
    constructor(private readonly actions: LeftNavActions) {}

    public itemSelected = (itemKey: LeftNavItemKey) => this.actions.itemSelected.invoke(itemKey);
}
