// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export interface RuleExpandCollapseData {
    isExpanded: boolean;
    cards: { [resultInstanceUid: string]: boolean };
}

export interface CardSelectionStoreData {
    rules: { [ruleId: string]: RuleExpandCollapseData };
}
