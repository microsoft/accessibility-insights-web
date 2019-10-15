// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from '../../common/flux/action';
import { CardSelectionPayload, RuleExpandCollapsePayload } from './action-payloads';

export class CardSelectionActions {
    public readonly getCurrentState = new Action();
    public readonly toggleRuleExpandCollapse = new Action<RuleExpandCollapsePayload>();
    public readonly toggleCardSelection = new Action<CardSelectionPayload>();
    public readonly collapseAllRules = new Action();
}
