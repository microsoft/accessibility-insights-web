// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseDataBuilder } from './base-data-builder';
import { IAssessmentData } from '../../common/types/store-data/iassessment-result-data';

export class AssessmentDataBuilder extends BaseDataBuilder<IAssessmentData> {
    constructor() {
        super();
        this.data.fullAxeResultsMap = null;
        this.data.testStepStatus = null;
    }
}
