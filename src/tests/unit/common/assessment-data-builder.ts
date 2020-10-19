// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentData } from '../../../common/types/store-data/assessment-result-data';
import { BaseDataBuilder } from './base-data-builder';

export class AssessmentDataBuilder extends BaseDataBuilder<AssessmentData> {
    constructor() {
        super();
        this.data.fullAxeResultsMap = {};
        this.data.testStepStatus = {};
    }
}
