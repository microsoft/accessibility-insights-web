// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    createAutomatedChecksInitialAssessmentTestData,
    createInitialAssessmentTestData,
} from 'background/create-initial-assessment-test-data';
import { flatMap } from 'lodash';

import { ManualTestStatus, TestStepData } from '../../../../common/types/manual-test-status';
import {
    GeneratedAssessmentInstance,
    ManualTestStepResult,
} from '../../../../common/types/store-data/assessment-result-data';
import { CreateTestAssessmentProvider } from '../../common/test-assessment-provider';

describe('createInitialAssessmentTestData', () => {
    const assessmentsProvider = CreateTestAssessmentProvider();
    const knownTestIds = assessmentsProvider.all().map(test => test.key);
    const knownRequirementIds = flatMap(assessmentsProvider.all(), test =>
        test.requirements.map(step => step.key),
    );
    const knownRequirement1 = knownRequirementIds[0];
    const knownRequirement2 = knownRequirementIds[1];
    const knownRequirement3 = knownRequirementIds[2];
    const unknownRequirement: string = 'unknown-requirement';

    it('outputs generatedAssessmentInstancesMaps filtered to results for known requirements only', () => {
        const persistedMap = {
            id1: createGeneratedAssessmentInstance('id1', [knownRequirement1, unknownRequirement]),
            id2: createGeneratedAssessmentInstance('id2', [unknownRequirement]),
        };
        const expectedMap = {
            id1: createGeneratedAssessmentInstance('id1', [knownRequirement1]),
        };

        const actual = createInitialAssessmentTestData(
            assessmentsProvider.forKey(knownTestIds[0]),
            {
                fullAxeResultsMap: null,
                generatedAssessmentInstancesMap: persistedMap,
                manualTestStepResultMap: {},
                testStepStatus: {},
            },
        );

        expect(actual.generatedAssessmentInstancesMap).toEqual(expectedMap);
    });

    it('outputs manualTestStepResultMap entries for only known assessments, propagating results for the persisted ones', () => {
        const persistedMap = {
            [knownRequirement1]: createManualRequirementResult(
                knownRequirement1,
                ManualTestStatus.FAIL,
            ),
            [unknownRequirement]: createManualRequirementResult(
                unknownRequirement,
                ManualTestStatus.FAIL,
            ),
        };
        const expectedMap = {
            [knownRequirement1]: createManualRequirementResult(
                knownRequirement1,
                ManualTestStatus.FAIL,
            ),
            [knownRequirement2]: createManualRequirementResult(
                knownRequirement2,
                ManualTestStatus.UNKNOWN,
            ),
            [knownRequirement3]: createManualRequirementResult(
                knownRequirement3,
                ManualTestStatus.UNKNOWN,
            ),
        };

        const actual = createInitialAssessmentTestData(
            assessmentsProvider.forKey(knownTestIds[0]),
            {
                fullAxeResultsMap: null,
                generatedAssessmentInstancesMap: {},
                manualTestStepResultMap: persistedMap,
                testStepStatus: {},
            },
        );

        expect(actual.manualTestStepResultMap).toEqual(expectedMap);
    });

    it('outputs testStepStatus entries for known assessments, propagating the persisted ones', () => {
        const persistedTestStepStatus = {
            [knownRequirement1]: createRequirementResult(true, ManualTestStatus.FAIL),
            [unknownRequirement]: createRequirementResult(true, ManualTestStatus.PASS),
        };
        const expectedTestStepStatus = {
            [knownRequirement1]: createRequirementResult(true, ManualTestStatus.FAIL),
            [knownRequirement2]: createDefaultRequirementResult(),
            [knownRequirement3]: createDefaultRequirementResult(),
        };

        const actual = createInitialAssessmentTestData(
            assessmentsProvider.forKey(knownTestIds[0]),
            {
                fullAxeResultsMap: null,
                generatedAssessmentInstancesMap: {},
                manualTestStepResultMap: {},
                testStepStatus: persistedTestStepStatus,
            },
        );

        expect(actual.testStepStatus).toEqual(expectedTestStepStatus);
    });
});

describe('createAutomatedChecksInitialAssessmentTestData', () => {
    const assessmentsProvider = CreateTestAssessmentProvider();
    const knownTestIds = assessmentsProvider.all().map(test => test.key);
    const knownRequirementIds = flatMap(assessmentsProvider.all(), test =>
        test.requirements.map(step => step.key),
    );
    const knownRequirement1 = knownRequirementIds[0];
    const knownRequirement2 = knownRequirementIds[1];
    const knownRequirement3 = knownRequirementIds[2];
    const unknownRequirement: string = 'unknown-requirement';

    it('outputs default data when persisted data is null', () => {
        const persistedMap = null;
        const expectedTestStepStatus = {
            [knownRequirement1]: createDefaultRequirementResult(),
            [knownRequirement2]: createDefaultRequirementResult(),
            [knownRequirement3]: createDefaultRequirementResult(),
        };
        const expectedManual = {
            [knownRequirement1]: createManualRequirementResult(
                knownRequirement1,
                ManualTestStatus.UNKNOWN,
            ),
            [knownRequirement2]: createManualRequirementResult(
                knownRequirement2,
                ManualTestStatus.UNKNOWN,
            ),
            [knownRequirement3]: createManualRequirementResult(
                knownRequirement3,
                ManualTestStatus.UNKNOWN,
            ),
        };
        const actual = createAutomatedChecksInitialAssessmentTestData(
            assessmentsProvider.forKey(knownTestIds[0]),
            {
                fullAxeResultsMap: null,
                generatedAssessmentInstancesMap: persistedMap,
                manualTestStepResultMap: {},
                testStepStatus: {},
            },
        );

        expect(actual.generatedAssessmentInstancesMap).toEqual(null);
        expect(actual.manualTestStepResultMap).toEqual(expectedManual);
        expect(actual.testStepStatus).toEqual(expectedTestStepStatus);
    });

    it('outputs persisted data when all requirements have been scanned', () => {
        const persistedTestStepStatus = {
            [knownRequirement1]: createRequirementResult(true, ManualTestStatus.FAIL),
            [knownRequirement2]: createRequirementResult(true, ManualTestStatus.PASS),
            [knownRequirement3]: createRequirementResult(true, ManualTestStatus.PASS),
        };
        const expectedTestStepStatus = {
            [knownRequirement1]: createRequirementResult(true, ManualTestStatus.FAIL),
            [knownRequirement2]: createRequirementResult(true, ManualTestStatus.PASS),
            [knownRequirement3]: createRequirementResult(true, ManualTestStatus.PASS),
        };
        const persistedManual = {
            [knownRequirement1]: createManualRequirementResult(
                knownRequirement1,
                ManualTestStatus.FAIL,
            ),
        };
        const expectedManual = {
            [knownRequirement1]: createManualRequirementResult(
                knownRequirement1,
                ManualTestStatus.FAIL,
            ),
            [knownRequirement2]: createManualRequirementResult(
                knownRequirement2,
                ManualTestStatus.UNKNOWN,
            ),
            [knownRequirement3]: createManualRequirementResult(
                knownRequirement3,
                ManualTestStatus.UNKNOWN,
            ),
        };
        const persistedGenerated = {
            id1: createGeneratedAssessmentInstance('id1', [knownRequirement1, unknownRequirement]),
        };
        const expectedGenerated = {
            id1: createGeneratedAssessmentInstance('id1', [knownRequirement1]),
        };

        const actual = createAutomatedChecksInitialAssessmentTestData(
            assessmentsProvider.forKey(knownTestIds[0]),
            {
                fullAxeResultsMap: null,
                generatedAssessmentInstancesMap: persistedGenerated,
                manualTestStepResultMap: persistedManual,
                testStepStatus: persistedTestStepStatus,
            },
        );

        expect(actual.manualTestStepResultMap).toEqual(expectedManual);
        expect(actual.generatedAssessmentInstancesMap).toEqual(expectedGenerated);
        expect(actual.testStepStatus).toEqual(expectedTestStepStatus);
    });

    it('outputs default data when all requirements have not been scanned', () => {
        const persistedTestStepStatus = {
            [knownRequirement1]: createRequirementResult(false, ManualTestStatus.FAIL),
            [knownRequirement2]: createRequirementResult(true, ManualTestStatus.PASS),
            [knownRequirement3]: createRequirementResult(true, ManualTestStatus.PASS),
        };
        const expectedTestStepStatus = {
            [knownRequirement1]: createDefaultRequirementResult(),
            [knownRequirement2]: createDefaultRequirementResult(),
            [knownRequirement3]: createDefaultRequirementResult(),
        };
        const persistedManual = {
            [knownRequirement1]: createManualRequirementResult(
                knownRequirement1,
                ManualTestStatus.FAIL,
            ),
        };
        const expectedManual = {
            [knownRequirement1]: createManualRequirementResult(
                knownRequirement1,
                ManualTestStatus.UNKNOWN,
            ),
            [knownRequirement2]: createManualRequirementResult(
                knownRequirement2,
                ManualTestStatus.UNKNOWN,
            ),
            [knownRequirement3]: createManualRequirementResult(
                knownRequirement3,
                ManualTestStatus.UNKNOWN,
            ),
        };
        const persistedGenerated = {
            id1: createGeneratedAssessmentInstance('id1', [knownRequirement1, unknownRequirement]),
        };
        const expectedGenerated = null;

        const actual = createAutomatedChecksInitialAssessmentTestData(
            assessmentsProvider.forKey(knownTestIds[0]),
            {
                fullAxeResultsMap: null,
                generatedAssessmentInstancesMap: persistedGenerated,
                manualTestStepResultMap: persistedManual,
                testStepStatus: persistedTestStepStatus,
            },
        );

        expect(actual.manualTestStepResultMap).toEqual(expectedManual);
        expect(actual.generatedAssessmentInstancesMap).toEqual(expectedGenerated);
        expect(actual.testStepStatus).toEqual(expectedTestStepStatus);
    });
});

function createRequirementResult(isScanned: boolean, stepResult: number): TestStepData {
    return {
        isStepScanned: isScanned,
        stepFinalResult: stepResult,
    };
}

function createDefaultRequirementResult(): TestStepData {
    return createRequirementResult(false, ManualTestStatus.UNKNOWN);
}

function createManualRequirementResult(
    requirementId: string,
    status: number,
): ManualTestStepResult {
    return {
        id: requirementId,
        instances: [],
        status: status,
    };
}

function createGeneratedAssessmentInstance(
    instanceId: string,
    requirementIds: string[],
): GeneratedAssessmentInstance {
    const instanceData = {
        target: [],
        html: 'html',
        testStepResults: {},
    };
    requirementIds.forEach(requirementId => {
        instanceData.testStepResults[requirementId] = {
            id: instanceId,
        };
    });

    return instanceData;
}
