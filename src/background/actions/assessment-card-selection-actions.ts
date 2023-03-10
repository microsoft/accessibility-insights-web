// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AsyncAction } from 'common/flux/async-action';
import {
    AssessmentCardSelectionPayload,
    RuleExpandCollapsePayload,
    AssessmentExpandCollapsePayload,
} from './action-payloads';

export class AssessmentCardSelectionActions {
    public readonly getCurrentState = new AsyncAction();
    public readonly navigateToNewCardsView = new AsyncAction<AssessmentCardSelectionPayload>();
    public readonly toggleRuleExpandCollapse = new AsyncAction<RuleExpandCollapsePayload>();
    public readonly toggleCardSelection = new AsyncAction<AssessmentCardSelectionPayload>();
    public readonly collapseAllRules = new AsyncAction<AssessmentExpandCollapsePayload>();
    public readonly expandAllRules = new AsyncAction<AssessmentExpandCollapsePayload>();
    public readonly toggleVisualHelper = new AsyncAction<AssessmentCardSelectionPayload>();
    public readonly resetFocusedIdentifier = new AsyncAction<AssessmentCardSelectionPayload>();
}
