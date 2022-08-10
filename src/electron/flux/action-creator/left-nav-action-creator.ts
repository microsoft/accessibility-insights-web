// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CardSelectionActions } from 'background/actions/card-selection-actions';
import { LeftNavActions } from 'electron/flux/action/left-nav-actions';
import { LeftNavItemKey } from 'electron/types/left-nav-item-key';

export class LeftNavActionCreator {
    constructor(
        private readonly leftNavActions: LeftNavActions,
        private readonly cardSelectionActions: CardSelectionActions,
    ) {}

    public itemSelected = (itemKey: LeftNavItemKey) => {
        this.leftNavActions.itemSelected.invoke(itemKey);
        this.cardSelectionActions.navigateToNewCardsView.invoke(null);
    };

    public setLeftNavVisible = (value: boolean) =>
        this.leftNavActions.setLeftNavVisible.invoke(value);
}
