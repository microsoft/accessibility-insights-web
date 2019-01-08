// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IAssessmentData } from '../../../common/types/store-data/iassessment-result-data';
import { BaseDataBuilder } from './base-data-builder';

export class AssessmentDataBuilder extends BaseDataBuilder<IAssessmentData> {
    constructor() {
        super();
        this.data.fullAxeResultsMap = null;
        this.data.testStepStatus = null;
    }
}
