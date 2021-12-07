// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export type NeedsReviewCardSelectionData = { [resultInstanceUid: string]: boolean };

export interface RuleExpandCollapseData {
    isExpanded: boolean;
    cards: NeedsReviewCardSelectionData;
}

export interface RuleExpandCollapseDataDictionary {
    [ruleId: string]: RuleExpandCollapseData;
}

export interface NeedsReviewCardSelectionStoreData {
    rules: RuleExpandCollapseDataDictionary;
    visualHelperEnabled: boolean;
    focusedResultUid: string | null;
}
