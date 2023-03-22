// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { SupportedMouseEvent } from 'common/telemetry-data-factory';

export interface CardSelectionMessageCreator {
    toggleCardSelection: (
        ruleId: string,
        resultInstanceUid: string,
        event: React.SyntheticEvent,
    ) => void;
    toggleRuleExpandCollapse: (ruleId: string, event: React.SyntheticEvent) => void;
    collapseAllRules: (event: SupportedMouseEvent) => void;
    expandAllRules: (event: SupportedMouseEvent) => void;
    toggleVisualHelper: (event: SupportedMouseEvent) => void;
}
