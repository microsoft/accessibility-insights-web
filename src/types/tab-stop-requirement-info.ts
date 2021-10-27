// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export const TabStopRequirementIds = [
    'keyboard-navigation',
    'keyboard-traps',
    'focus-indicator',
    'tab-order',
    'input-focus',
] as const;

export type TabStopRequirementId = typeof TabStopRequirementIds[number];

export type TabStopRequirementInfo = {
    [requirementId in TabStopRequirementId]: {
        name: string;
        description: string;
    };
};
