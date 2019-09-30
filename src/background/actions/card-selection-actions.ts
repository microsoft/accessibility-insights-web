// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from '../../common/flux/action';

export class CardSelectionActions {
    public readonly toggleRuleExpandCollapse = new Action();
    public readonly toggleCardSelection = new Action();
    public readonly collapseAllRules = new Action();
}
