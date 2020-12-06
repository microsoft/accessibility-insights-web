// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AssessmentStoreData } from "common/types/store-data/assessment-result-data";

export type VersionedAssessmentData = {
    version: number;
    assessmentData: AssessmentStoreData
};
