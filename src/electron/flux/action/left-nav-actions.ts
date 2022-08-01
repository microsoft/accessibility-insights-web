// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AsyncAction } from 'common/flux/async-action';
import { LeftNavItemKey } from 'electron/types/left-nav-item-key';

export class LeftNavActions {
    public readonly itemSelected = new AsyncAction<LeftNavItemKey>();
    public readonly setLeftNavVisible = new AsyncAction<boolean>();
}
