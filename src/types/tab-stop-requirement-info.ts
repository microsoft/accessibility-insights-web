// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export type TabStopRequirementId =
    | 'keyboard-navigation'
    | 'keyboard-traps'
    | 'focus-indicator'
    | 'tab-order'
    | 'input-focus';

export type TabStopRequirementInfo = {
    [requirementId in TabStopRequirementId]: {
        name: string;
        description: string;
    };
};
