// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AutomatedChecks } from 'assessments/automated-checks/assessment';

export type ShouldShowRequirementContextBox = (requirementKey: string) => boolean;

export function shouldShowRequirementContextBoxForAssessment(): boolean {
    return false;
}

export function shouldShowRequirementContextBoxForQuickAssess(requirementKey: string): boolean {
    if (requirementKey === AutomatedChecks.key) {
        return false;
    }
    return true;
}
