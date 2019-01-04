// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DecoratedAxeNodeResult } from '../../injected/scanner-utils';

export interface CreateIssueDetailsTextData {
    pageTitle: string;
    pageUrl: string;
    ruleResult: DecoratedAxeNodeResult;
}