// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CardSelectionStoreData } from 'common/types/store-data/card-selection-store-data';

export interface AssessmentCardSelectionStoreData {
    [testKey: string]: CardSelectionStoreData;
}

export interface AssessmentCardSelectionInfo {
    [testKey: string]: AssessmentRuleInstances;
}

export type AssessmentRuleInstances = {
    [ruleId: string]: InstanceUids;
};

type InstanceUids = string[];
