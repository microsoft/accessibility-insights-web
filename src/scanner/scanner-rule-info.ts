// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HyperlinkDefinition } from 'common/types/hyperlink-definition';

export interface ScannerRuleInfo {
    id: string;
    help: string;
    url?: string;
    a11yCriteria: HyperlinkDefinition[];
}

export interface ScannerRuleInfoMap {
    [ruleId: string]: ScannerRuleInfo;
}
