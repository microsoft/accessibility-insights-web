// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { GuidanceLink } from 'common/types/store-data/guidance-links';

export const TabStopRequirementIds = [
    'keyboard-navigation',
    'keyboard-traps',
    'focus-indicator',
    'tab-order',
    'input-focus',
] as const;

export type TabStopRequirementId = typeof TabStopRequirementIds[number];

export type TabStopRequirementInfo = {
    [requirementId in TabStopRequirementId]: TabStopRequirementContent;
};

export type TabStopRequirementContent = {
    name: string;
    description: string;
    guidance: GuidanceLink[];
};
