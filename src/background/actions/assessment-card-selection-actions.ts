// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AsyncAction } from 'common/flux/async-action';
import {
    AssessmentCardSelectionPayload,
    AssessmentCardToggleVisualHelperPayload,
    AssessmentExpandCollapsePayload,
    AssessmentNavigateToNewCardsViewPayload,
    RuleExpandCollapsePayload,
} from './action-payloads';

export class AssessmentCardSelectionActions {
    public readonly getCurrentState = new AsyncAction();
    public readonly navigateToNewCardsView =
        new AsyncAction<AssessmentNavigateToNewCardsViewPayload>();
    public readonly toggleRuleExpandCollapse = new AsyncAction<RuleExpandCollapsePayload>();
    public readonly toggleCardSelection = new AsyncAction<AssessmentCardSelectionPayload>();
    public readonly collapseAllRules = new AsyncAction<AssessmentExpandCollapsePayload>();
    public readonly expandAllRules = new AsyncAction<AssessmentExpandCollapsePayload>();
    public readonly toggleVisualHelper = new AsyncAction<AssessmentCardToggleVisualHelperPayload>();
    public readonly resetFocusedIdentifier = new AsyncAction<AssessmentCardSelectionPayload>();
}
