// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export type CardSelectionData = { [resultInstanceUid: string]: boolean };

export interface RuleExpandCollapseData {
    isExpanded: boolean;
    cards: CardSelectionData;
}

export interface RuleExpandCollapseDataDictionary {
    [ruleId: string]: RuleExpandCollapseData;
}

export interface CardSelectionStoreData {
    rules: RuleExpandCollapseDataDictionary | null;
    visualHelperEnabled: boolean;
    focusedResultUid: string | null;
}
