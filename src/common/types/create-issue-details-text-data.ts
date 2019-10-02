// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DecoratedAxeNodeResult } from '../../injected/scanner-utils';
import { EnvironmentInfo } from '../environment-info-provider';
import { UnifiedRule } from './store-data/unified-data-interface';

export interface CreateIssueDetailsTextData {
    rule: UnifiedRule; // uses every part of rule in bug filing
    targetApp: {
        name: string;
        url?: string;
    };
    // everything below this line needs to be
    // computed from the unified result
    element: {
        id: string;
        idDisplayName: string;
        shortId: string;
    };
    howToFixSummary: string;
    snippet?: string;
}
