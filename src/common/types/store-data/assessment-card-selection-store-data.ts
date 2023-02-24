// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CardSelectionStoreData } from 'common/types/store-data/card-selection-store-data';

export interface AssessmentCardSelectionStoreData {
    [testKey: string]: CardSelectionStoreData;
}
