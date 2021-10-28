// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export interface CollapsibleComponentMessageCreator {
    toggleRuleExpandCollapse: (ruleId: string, event: React.SyntheticEvent) => void;
}
