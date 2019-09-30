// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export interface CardSelectionData {
    resultInstanceUid: string;
    isSelected: boolean;
}

export interface RuleExpandCollapseData {
    ruleId: string;
    isExpanded: boolean;
    cards: CardSelectionData[];
}

export interface CardSelectionStoreData {
    rules: RuleExpandCollapseData[];
}
