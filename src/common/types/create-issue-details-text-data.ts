// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GuidanceLink } from '../../scanner/rule-to-links-mappings';

export interface CreateIssueDetailsTextData {
    rule: {
        id: string;
        description: string;
        url: string;
        guidance: GuidanceLink[];
    };
    targetApp: {
        name: string;
        url?: string;
    };
    element: {
        identifier: string;
        conciseName: string;
    };
    howToFixSummary: string;
    snippet?: string;
}
