// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AsyncAction } from 'common/flux/async-action';
import { CardSelectionPayload, RuleExpandCollapsePayload } from './action-payloads';

export class CardSelectionActions {
    public readonly getCurrentState = new AsyncAction();
    public readonly navigateToNewCardsView = new AsyncAction();
    public readonly toggleRuleExpandCollapse = new AsyncAction<RuleExpandCollapsePayload>();
    public readonly toggleCardSelection = new AsyncAction<CardSelectionPayload>();
    public readonly collapseAllRules = new AsyncAction();
    public readonly expandAllRules = new AsyncAction();
    public readonly toggleVisualHelper = new AsyncAction();
    public readonly resetFocusedIdentifier = new AsyncAction();
}
