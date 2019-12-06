// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isEmpty } from 'lodash';

import { GeneratedAssessmentInstance } from '../common/types/store-data/assessment-result-data';
import { DictionaryStringTo } from '../types/common-types';

export class AssessmentDataRemover {
    public deleteDataFromGeneratedMapWithStepKey(
        instancesMap: DictionaryStringTo<GeneratedAssessmentInstance>,
        step: string,
    ): void {
        Object.keys(instancesMap).forEach(key => {
            const generatedAssessmentInstance = instancesMap[key];
            delete generatedAssessmentInstance.testStepResults[step];
            if (isEmpty(generatedAssessmentInstance.testStepResults)) {
                delete instancesMap[key];
            }
        });
    }
}
