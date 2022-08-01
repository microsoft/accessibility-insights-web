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

    public itemSelected = async (itemKey: LeftNavItemKey) => {
        await this.leftNavActions.itemSelected.invoke(itemKey);
        await this.cardSelectionActions.navigateToNewCardsView.invoke(null);
    };

    public setLeftNavVisible = async (value: boolean) =>
        await this.leftNavActions.setLeftNavVisible.invoke(value);
}
