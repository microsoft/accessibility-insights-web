// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { SupportedMouseEvent } from 'common/telemetry-data-factory';

export interface CardSelectionMessageCreator {
    toggleCardSelection: (
        ruleId: string,
        resultInstanceUid: string,
        event: React.SyntheticEvent,
        testKey?: string,
    ) => void;
    toggleRuleExpandCollapse: (
        ruleId: string,
        event: React.SyntheticEvent,
        testKey?: string,
    ) => void;
    collapseAllRules: (event: SupportedMouseEvent, testKey?: string) => void;
    expandAllRules: (event: SupportedMouseEvent, testKey?: string) => void;
    toggleVisualHelper: (event: SupportedMouseEvent, testKey?: string) => void;
}
