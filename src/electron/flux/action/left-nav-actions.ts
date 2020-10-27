// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';
import { LeftNavItemKey } from 'electron/types/left-nav-item-key';

export class LeftNavActions {
    public readonly itemSelected = new Action<LeftNavItemKey>();
    public readonly setLeftNavVisible = new Action<boolean>();
}
