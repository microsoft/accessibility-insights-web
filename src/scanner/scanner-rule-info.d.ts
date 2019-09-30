// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HyperlinkDefinition } from 'views/content/content-page';

export interface ScannerRuleInfo {
    id: string;
    help: string;
    url: string;
    a11yCriteria: HyperlinkDefinition[];
}
