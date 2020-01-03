// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CreateIssueDetailsTextData } from '../common/types/create-issue-details-text-data';
import { DecoratedAxeNodeResult } from '../injected/scanner-utils';

export class AxeResultToIssueFilingDataConverter {
    constructor(private readonly shortenSelector: (selector: string) => string) {}

    public convert(
        result: DecoratedAxeNodeResult,
        pageTitle: string,
        pageUrl: string,
    ): CreateIssueDetailsTextData {
        return {
            rule: {
                description: result.help,
                id: result.ruleId,
                url: result.helpUrl,
                guidance: result.guidanceLinks,
            },
            targetApp: {
                name: pageTitle,
                url: pageUrl,
            },
            element: {
                identifier: result.selector,
                conciseName: this.shortenSelector(result.selector),
            },
            howToFixSummary: result.failureSummary,
            snippet: result.html,
        };
    }
}
