// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InitialAssessmentStoreDataGenerator } from '../../../../background/intial-assessment-store-data-generator';
import { ITestStepData } from '../../../../common/types/manual-test-status';
import {
    IAssessmentData,
    IAssessmentStoreData,
    IGeneratedAssessmentInstance,
    IManualTestStepResult,
} from '../../../../common/types/store-data/iassessment-result-data';
import { CreateTestAssessmentProvider } from '../../common/test-assessment-provider';




describe('InitialAssessmentStoreDataGeneratorTest', () => {
    const assesssmentsProvider = CreateTestAssessmentProvider();
    const targetTab = { id: 1, url: 'url', title: 'title' };
    const generator = new InitialAssessmentStoreDataGenerator(assesssmentsProvider);
    const userInpuut = 10;
    let knownTestIds: string[];
    const knownRequirementIds: string[] = [];
    const unknownRequirementIds: string[] = ['unknown-requirement-1', 'unknown-requirement-2'];
    let defaultState;
    let defaultStatus;
    let unknownRequirement1;
    let knownRequirement1;
    let knownRequirement2;
    let knownRequirement3;
    let instanceDataWithKnownRequirementResult;
    let instanceDataWithOnlyKnownRequirementResult;
    let instanceDataWithoutKnownRequirementResult;
    let knownManualRequirementResult;
    let unknownManualRequirementResult;


    beforeAll(() => {
        knownTestIds = assesssmentsProvider.all().map(test => test.key);
        assesssmentsProvider.all().forEach(test => {
            test.steps.forEach(requirement => {
                knownRequirementIds.push(requirement.key);
            });
        });
        defaultState = generator.generateInitalState();
        defaultStatus = 1;
        knownRequirement1 = knownRequirementIds[0];
        unknownRequirement1 = unknownRequirementIds[0];
        knownRequirement2 = knownRequirementIds[1];
        knownRequirement3 = knownRequirementIds[2];
        instanceDataWithKnownRequirementResult = createInstance('id1', [knownRequirement1, unknownRequirement1]);
        instanceDataWithOnlyKnownRequirementResult = createInstance('id1', [knownRequirement1]);
        instanceDataWithoutKnownRequirementResult = createInstance('id2', [unknownRequirement1]);
        knownManualRequirementResult = createManualRequirementResult(knownRequirement1, userInpuut);
        unknownManualRequirementResult = createManualRequirementResult(unknownRequirement1, userInpuut);

    });

    it('get the default state', () => {
        const defaultState = generator.generateInitalState();
        expect(defaultState).toEqual(defaultTestState);
    });

    it('generateInitalState with persisitedData, where assessments is null', () => {
        const defaultState = generator.generateInitalState();
        const persisted: IAssessmentStoreData = {
            targetTab,
            assessmentNavState: {
                selectedTestStep: 'invalid-step',
                selectedTestType: -100,
            },
            assessments: null,
        };
        const expected: IAssessmentStoreData = {
            targetTab,
            assessmentNavState: defaultState.assessmentNavState,
            assessments: defaultState.assessments,
        };
        expect(generator.generateInitalState(persisted)).toEqual(expected);
    });

    it('generateInitalState with persisitedData, where assessments is empty', () => {
        const defaultState = generator.generateInitalState();
        const persisted: IAssessmentStoreData = {
            targetTab,
            assessmentNavState: {
                selectedTestStep: 'invalid-step',
                selectedTestType: -100,
            },
            assessments: {},
        };
        const expected: IAssessmentStoreData = {
            targetTab,
            assessmentNavState: defaultState.assessmentNavState,
            assessments: defaultState.assessments,
        };
        expect(generator.generateInitalState(persisted)).toEqual(expected);
    });

    it('verify targetTab and assessmentNavState', () => {
        const persistedTestData1: IAssessmentData = {
            fullAxeResultsMap: null,
            generatedAssessmentInstancesMap: {
                id1: instanceDataWithKnownRequirementResult,
                id2: instanceDataWithoutKnownRequirementResult,
            },
            manualTestStepResultMap: {},
            testStepStatus: {},
        };

        const persisted: IAssessmentStoreData = {
            targetTab,
            assessmentNavState: {
                selectedTestStep: 'invalid-step',
                selectedTestType: -100,
            },
            assessments: {
                [knownTestIds[0]]: persistedTestData1,
            },
        };
        const actual = generator.generateInitalState(persisted);

        expect(actual.targetTab).toEqual(persisted.targetTab);
        expect(actual.assessmentNavState).toEqual(defaultState.assessmentNavState);
    });

    it('verify generatedAssessmentInstancesMap', () => {
        const persistedTestData1: IAssessmentData = {
            fullAxeResultsMap: null,
            generatedAssessmentInstancesMap: {
                id1: instanceDataWithKnownRequirementResult,
                id2: instanceDataWithoutKnownRequirementResult,
            },
            manualTestStepResultMap: {},
            testStepStatus: {},
        };

        const persisted: IAssessmentStoreData = {
            targetTab,
            assessmentNavState: {
                selectedTestStep: 'invalid-step',
                selectedTestType: -100,
            },
            assessments: {
                [knownTestIds[0]]: persistedTestData1,
            },
        };
        const expectedGeneratedMap = {
            id1: instanceDataWithOnlyKnownRequirementResult,
        };

        const actual = generator.generateInitalState(persisted);

        expect(actual.assessments[knownTestIds[0]].generatedAssessmentInstancesMap).toEqual(expectedGeneratedMap);
    });

    it('verify manualTestStepResultMap', () => {
        const persistedTestData1: IAssessmentData = {
            fullAxeResultsMap: null,
            generatedAssessmentInstancesMap: {},
            manualTestStepResultMap: {
                [knownRequirement1]: knownManualRequirementResult,
                [unknownRequirement1]: unknownManualRequirementResult,
            },
            testStepStatus: {},
        };

        const persisted: IAssessmentStoreData = {
            targetTab,
            assessmentNavState: {
                selectedTestStep: 'invalid-step',
                selectedTestType: -100,
            },
            assessments: {
                [knownTestIds[0]]: persistedTestData1,
            },
        };
        const expectedMap = {
            [knownRequirement1]: knownManualRequirementResult,
            [knownRequirement2]: createManualRequirementResult(knownRequirement2, defaultStatus),
            [knownRequirement3]: createManualRequirementResult(knownRequirement3, defaultStatus),
        };

        const actual = generator.generateInitalState(persisted);

        expect(actual.assessments[knownTestIds[0]].manualTestStepResultMap).toEqual(expectedMap);
    });

    it('verify testStepStatus', () => {
        const persistedTestData1: IAssessmentData = {
            fullAxeResultsMap: null,
            generatedAssessmentInstancesMap: {},
            manualTestStepResultMap: {},
            testStepStatus: {
                [knownRequirement1]: createRequirementResult(true, 2),
                [unknownRequirement1]: createRequirementResult(true, 3),
            },
        };

        const persisted: IAssessmentStoreData = {
            targetTab,
            assessmentNavState: {
                selectedTestStep: 'invalid-step',
                selectedTestType: -100,
            },
            assessments: {
                [knownTestIds[0]]: persistedTestData1,
            },
        };
        const expectedMap = {
            [knownRequirement1]: createRequirementResult(true, 2),
            [knownRequirement2]: creaetDefaultRequirementResult(),
            [knownRequirement3]: creaetDefaultRequirementResult(),
        };

        const actual = generator.generateInitalState(persisted);

        expect(actual.assessments[knownTestIds[0]].testStepStatus).toEqual(expectedMap);
    });
});

function creaetDefaultRequirementResult() {
    return createRequirementResult(false, 1);
}

function createRequirementResult(isScanned: boolean, stepResult: number): ITestStepData {
    return {
        isStepScanned: isScanned,
        stepFinalResult: stepResult,
    };
}

function createManualRequirementResult(requirementId: string, status: number): IManualTestStepResult {
    return {
        id: requirementId,
        instances: [],
        status: status,
    };
}

function createInstance(instanceId: string, requirementIds: string[]): IGeneratedAssessmentInstance {
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

const defaultTestState: IAssessmentStoreData = {
    assessmentNavState: {
        selectedTestStep: 'assessment-1-step-1',
        selectedTestType: -1,
    },
    assessments: {
        'assessment-1': {
            fullAxeResultsMap: null,
            generatedAssessmentInstancesMap: null,
            manualTestStepResultMap: {
                'assessment-1-step-1': {
                    id: 'assessment-1-step-1',
                    instances: [],
                    status: 1,
                },
                'assessment-1-step-2': {
                    id: 'assessment-1-step-2',
                    instances: [],
                    status: 1,
                },
                'assessment-1-step-3': {
                    id: 'assessment-1-step-3',
                    instances: [],
                    status: 1,
                },
            },
            testStepStatus: {
                'assessment-1-step-1': {
                    isStepScanned: false,
                    stepFinalResult: 1,
                },
                'assessment-1-step-2': {
                    isStepScanned: false,
                    stepFinalResult: 1,
                },
                'assessment-1-step-3': {
                    isStepScanned: false,
                    stepFinalResult: 1,
                },
            },
        },
        'assessment-2': {
            fullAxeResultsMap: null,
            generatedAssessmentInstancesMap: null,
            manualTestStepResultMap: {
                'assessment-2-step-1': {
                    id: 'assessment-2-step-1',
                    instances: [],
                    status: 1,
                },
                'assessment-2-step-2': {
                    id: 'assessment-2-step-2',
                    instances: [],
                    status: 1,
                },
            },
            testStepStatus: {
                'assessment-2-step-1': {
                    isStepScanned: false,
                    stepFinalResult: 1,
                },
                'assessment-2-step-2': {
                    isStepScanned: false,
                    stepFinalResult: 1,
                },
            },
        },
    },
    targetTab: null,
};
