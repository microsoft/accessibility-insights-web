// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as _ from 'lodash';

import { DictionaryStringTo } from '../types/common-types';
import { IGeneratedAssessmentInstance } from './../common/types/store-data/iassessment-result-data.d';

export class AssessmentDataRemover {
    public deleteDataFromGeneratedMapWithStepKey(instancesMap: DictionaryStringTo<IGeneratedAssessmentInstance>, step: string): void {
        Object.keys(instancesMap).forEach(key => {
            const generatedAssessmentInstance = instancesMap[key];
            delete generatedAssessmentInstance.testStepResults[step];
            if (_.isEmpty(generatedAssessmentInstance.testStepResults)) {
                delete instancesMap[key];
            }
        });
    }
}
