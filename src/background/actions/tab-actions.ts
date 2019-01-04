// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from '../../common/flux/action';

import { ITab } from '../../common/itab.d';

export class TabActions {
    public readonly tabUpdate = new Action<ITab>();
    public readonly getCurrentState = new Action();
    public readonly injectedScripts = new Action();
    public readonly tabRemove = new Action();
    public readonly tabChange = new Action<ITab>();
    public readonly tabVisibilityChange = new Action<boolean>();
}
