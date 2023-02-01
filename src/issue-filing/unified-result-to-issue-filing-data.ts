// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    TargetAppData,
    UnifiedResult,
    UnifiedRule,
} from 'common/types/store-data/unified-data-interface';

import { CreateIssueDetailsTextData } from '../common/types/create-issue-details-text-data';

export class UnifiedResultToIssueFilingDataConverter {
    public convert(
        result: UnifiedResult,
        rule: UnifiedRule,
        targetApp: TargetAppData,
    ): CreateIssueDetailsTextData {
        return {
            rule: {
                description: rule.description,
                id: rule.id,
                url: rule.url,
                guidance: rule.guidance,
            },
            targetApp: {
                name: targetApp.name,
                url: targetApp.url,
            },
            element: {
                identifier: result.identifiers.identifier,
                conciseName: result.identifiers.conciseName,
            },
            howToFixSummary: result.resolution.howToFixSummary,
            snippet: result.descriptors.snippet,
            relatedPaths: result.descriptors.relatedCssSelectors,
        };
    }
}
