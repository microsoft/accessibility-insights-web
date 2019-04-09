// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentDataRemover } from '../../../../background/assessment-data-remover';
import { IGeneratedAssessmentInstance, ITestStepResult } from '../../../../common/types/store-data/assessment-result-data';
import { DictionaryStringTo } from '../../../../types/common-types';

describe('AssessmentDataRemoverTest', () => {
    const instanceKey = 'instance-key-1';
    const selectedStep = 'selectedStep';
    const anotherStep = 'anotherStep';

    test('deleteDataFromGeneratedMapWithStepKey: only delete one test step result entry', () => {
        const instanceMap = getInstanceMapWitMultipleTestStepResults();
        new AssessmentDataRemover().deleteDataFromGeneratedMapWithStepKey(instanceMap, selectedStep);
        expect(instanceMap[instanceKey].testStepResults[anotherStep]).toBeDefined();
    });

    test('deleteDataFromGeneratedMapWithStepKey: delete the instance in the instance map', () => {
        const instanceMap = getInstanceMapWithOnlyOneTestStepResult();
        new AssessmentDataRemover().deleteDataFromGeneratedMapWithStepKey(instanceMap, selectedStep);
        expect(instanceMap[instanceKey]).toBeUndefined();
    });

    function getInstanceMapWithOnlyOneTestStepResult(): DictionaryStringTo<IGeneratedAssessmentInstance> {
        return {
            [instanceKey]: {
                testStepResults: {
                    [selectedStep]: {
                        status: 2,
                    } as ITestStepResult,
                },
                target: null,
                html: null,
                propertyBag: null,
            } as IGeneratedAssessmentInstance,
        };
    }

    function getInstanceMapWitMultipleTestStepResults(): DictionaryStringTo<IGeneratedAssessmentInstance> {
        return {
            [instanceKey]: {
                testStepResults: {
                    [selectedStep]: {
                        status: 2,
                    } as ITestStepResult,
                    [anotherStep]: {
                        status: 1,
                    } as ITestStepResult,
                },
                target: null,
                html: null,
                propertyBag: null,
            } as IGeneratedAssessmentInstance,
        };
    }
});
