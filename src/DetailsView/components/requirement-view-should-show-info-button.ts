// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AutomatedChecks } from 'assessments/automated-checks/assessment';

export type ShouldShowInfoButton = (requirementKey: string) => boolean;

export function shouldShowInfoButtonForAssessment(): boolean {
    return true;
}

export function shouldShowInfoButtonForQuickAssess(requirementKey: string): boolean {
    if (requirementKey === AutomatedChecks.key) {
        return true;
    }
    return false;
}
