// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InitialAssessmentStoreDataGenerator } from '../../../../background/intial-assessment-store-data-generator';
import { TestStepData } from '../../../../common/types/manual-test-status';
import {
    IAssessmentData,
    IAssessmentStoreData,
    IGeneratedAssessmentInstance,
    IManualTestStepResult,
    AssessmentNavState,
} from '../../../../common/types/store-data/iassessment-result-data';
import { CreateTestAssessmentProvider } from '../../common/test-assessment-provider';

describe('InitialAssessmentStoreDataGenerator.generateInitialState', () => {
    const assesssmentsProvider = CreateTestAssessmentProvider();

    const targetTab = { id: 1, url: 'url', title: 'title', appRefreshed: false };
    const generator = new InitialAssessmentStoreDataGenerator(assesssmentsProvider);
    const userInput = 10;
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
        defaultState = generator.generateInitialState();
        defaultStatus = 1;
        knownRequirement1 = knownRequirementIds[0];
        unknownRequirement1 = unknownRequirementIds[0];
        knownRequirement2 = knownRequirementIds[1];
        knownRequirement3 = knownRequirementIds[2];
        instanceDataWithKnownRequirementResult = createInstance('id1', [knownRequirement1, unknownRequirement1]);
        instanceDataWithOnlyKnownRequirementResult = createInstance('id1', [knownRequirement1]);
        instanceDataWithoutKnownRequirementResult = createInstance('id2', [unknownRequirement1]);
        knownManualRequirementResult = createManualRequirementResult(knownRequirement1, userInput);
        unknownManualRequirementResult = createManualRequirementResult(unknownRequirement1, userInput);
    });

    it('generates the pinned default state from assessmentsProvider data when no persistedData is provided', () => {
        expect(defaultState).toMatchSnapshot();
    });

    it.each([[undefined], [null], [{}]])('outputs default assessment data if persistedData.assessments is %p', persistedAssessments => {
        const generatedState = generator.generateInitialState({
            assessments: persistedAssessments,
        } as IAssessmentStoreData);

        expect(generatedState.assessments).toEqual(defaultState.assessments);
    });

    it.each([[undefined], [null]])('propagates unspecified persistedTabInfo values as-is', persistedTabInfo => {
        const generatedState = generator.generateInitialState({
            persistedTabInfo,
        } as IAssessmentStoreData);

        expect(generatedState.persistedTabInfo).toEqual(persistedTabInfo);
    });

    it.each([[undefined], [true], [false]])(
        'outputs persistedTabInfo.appRefreshed as true even if it was set to %p in input persistedData',
        persistedAppRefreshed => {
            const generatedState = generator.generateInitialState({
                persistedTabInfo: { ...targetTab, appRefreshed: persistedAppRefreshed },
                assessmentNavState: null,
                assessments: null,
            });

            expect(generatedState.persistedTabInfo.appRefreshed).toBe(true);
        },
    );

    it('outputs persistedTabInfo properties other than appRefreshed as they appeared in persistedData', () => {
        const generatedState = generator.generateInitialState({
            persistedTabInfo: targetTab,
            assessmentNavState: null,
            assessments: null,
        });

        const { appRefreshed, ...tabInfoPropertiesThatShouldPropagate } = targetTab;
        expect(generatedState.persistedTabInfo).toMatchObject(tabInfoPropertiesThatShouldPropagate);
    });

    // prettier-ignore
    it.each`
        selectedTestStep         | selectedTestType
        ${'invalid-step'}        | ${-100}
        ${'invalid-step'}        | ${-1}
        ${'assessment-1-step-1'} | ${-100}
        ${'assessment-1-step-1'} | ${-1}
        ${'assessment-1-step-2'} | ${-1}
        ${'assessment-2-step-1'} | ${-2}
        ${'assessment-2-step-2'} | ${-2}
    `(
        'outputs the first test/step for assessmentNavState regardless of the persisted state ($selectedTestStep/$selectedTestType)',
        ({selectedTestStep, selectedTestType}) => {
            const generatedState = generator.generateInitialState({
                assessmentNavState: {
                    selectedTestStep,
                    selectedTestType,
                },
            } as IAssessmentStoreData);

            expect(generatedState.assessmentNavState).toEqual(defaultState.assessmentNavState);
        },
    );

    it.todo('outputs default/empty assessment data for new test types missing from persisted data');
    it.todo('outputs default/empty assessment data for new test steps missing from persisted data');
    it.todo('omits persisted assessment data for test types that are unknown to the assessment provider');
    it.todo('omits persisted assessment data for test steps that are unknown to the assessment provider');

    it('outputs generatedAssessmentInstancesMaps filtered to results for recognized requirements only', () => {
        const persistedMap = {
            id1: instanceDataWithKnownRequirementResult,
            id2: instanceDataWithoutKnownRequirementResult,
        };
        const expectedMap = {
            id1: instanceDataWithOnlyKnownRequirementResult,
        };

        const actual = generator.generateInitialState({
            assessments: {
                [knownTestIds[0]]: {
                    fullAxeResultsMap: null,
                    generatedAssessmentInstancesMap: persistedMap,
                    manualTestStepResultMap: {},
                    testStepStatus: {},
                },
            },
        } as IAssessmentStoreData);

        expect(actual.assessments[knownTestIds[0]].generatedAssessmentInstancesMap).toEqual(expectedMap);
    });

    it('outputs manualTestStepResultMap entries for known assessments, propagating the persisted ones', () => {
        const persistedMap = {
            [knownRequirement1]: knownManualRequirementResult,
            [unknownRequirement1]: unknownManualRequirementResult,
        };
        const expectedMap = {
            [knownRequirement1]: knownManualRequirementResult,
            [knownRequirement2]: createManualRequirementResult(knownRequirement2, defaultStatus),
            [knownRequirement3]: createManualRequirementResult(knownRequirement3, defaultStatus),
        };

        const actual = generator.generateInitialState({
            assessments: {
                [knownTestIds[0]]: {
                    fullAxeResultsMap: null,
                    generatedAssessmentInstancesMap: {},
                    manualTestStepResultMap: persistedMap,
                    testStepStatus: {},
                },
            },
        } as IAssessmentStoreData);

        expect(actual.assessments[knownTestIds[0]].manualTestStepResultMap).toEqual(expectedMap);
    });

    it('outputs testStepStatus entries for known assessments, propagating the persisted ones', () => {
        const persistedTestStepStatus = {
            [knownRequirement1]: createRequirementResult(true, 2),
            [unknownRequirement1]: createRequirementResult(true, 3),
        };
        const expectedTestStepStatus = {
            [knownRequirement1]: createRequirementResult(true, 2),
            [knownRequirement2]: createDefaultRequirementResult(),
            [knownRequirement3]: createDefaultRequirementResult(),
        };

        const actual = generator.generateInitialState({
            assessments: {
                [knownTestIds[0]]: {
                    fullAxeResultsMap: null,
                    generatedAssessmentInstancesMap: {},
                    manualTestStepResultMap: {},
                    testStepStatus: persistedTestStepStatus,
                },
            },
        } as IAssessmentStoreData);

        expect(actual.assessments[knownTestIds[0]].testStepStatus).toEqual(expectedTestStepStatus);
    });

function createDefaultRequirementResult(): TestStepData {
    return createRequirementResult(false, 1);
}

function createRequirementResult(isScanned: boolean, stepResult: number): TestStepData {
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
