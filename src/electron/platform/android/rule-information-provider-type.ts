// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { RuleInformation } from './rule-information';

export interface RuleInformationProviderType {
    getRuleInformation(ruleId: string): RuleInformation | null;
}
