// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SyncAction } from 'common/flux/sync-action';
import { CardSelectionPayload, RuleExpandCollapsePayload } from './action-payloads';

export class CardSelectionActions {
    public readonly getCurrentState = new SyncAction();
    public readonly navigateToNewCardsView = new SyncAction();
    public readonly toggleRuleExpandCollapse = new SyncAction<RuleExpandCollapsePayload>();
    public readonly toggleCardSelection = new SyncAction<CardSelectionPayload>();
    public readonly collapseAllRules = new SyncAction();
    public readonly expandAllRules = new SyncAction();
    public readonly toggleVisualHelper = new SyncAction();
    public readonly resetFocusedIdentifier = new SyncAction();
}
