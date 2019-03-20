// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { flatMap } from 'lodash';
import { InitialAssessmentStoreDataGenerator } from '../../../../background/intial-assessment-store-data-generator';
import { ManualTestStatus, TestStepData } from '../../../../common/types/manual-test-status';
import {
    IAssessmentStoreData,
    IGeneratedAssessmentInstance,
    IManualTestStepResult,
} from '../../../../common/types/store-data/iassessment-result-data';
import { VisualizationType } from '../../../../common/types/visualization-type';
import { CreateTestAssessmentProvider } from '../../common/test-assessment-provider';

describe('InitialAssessmentStoreDataGenerator.generateInitialState', () => {
    const assesssmentsProvider = CreateTestAssessmentProvider();
    const generator = new InitialAssessmentStoreDataGenerator(assesssmentsProvider);

    const defaultState = generator.generateInitialState();

    const validTargetTab = { id: 1, url: 'url', title: 'title', appRefreshed: false };
    const knownTestIds = assesssmentsProvider.all().map(test => test.key);
    const knownTestType = assesssmentsProvider.all()[0].type;
    const unknownTestType = -100 as VisualizationType;
    const knownRequirementIds = flatMap(assesssmentsProvider.all(), test => test.steps.map(step => step.key));
    const knownRequirement1 = knownRequirementIds[0];
    const knownRequirement2 = knownRequirementIds[1];
    const knownRequirement3 = knownRequirementIds[2];
    const unknownRequirement: string = 'unknown-requirement';

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
                persistedTabInfo: { ...validTargetTab, appRefreshed: persistedAppRefreshed },
                assessmentNavState: null,
                assessments: null,
            });

            expect(generatedState.persistedTabInfo.appRefreshed).toBe(true);
        },
    );

    it('outputs persistedTabInfo properties other than appRefreshed as they appeared in persistedData', () => {
        const generatedState = generator.generateInitialState({
            persistedTabInfo: validTargetTab,
            assessmentNavState: null,
            assessments: null,
        });

        const { appRefreshed, ...tabInfoPropertiesThatShouldPropagate } = validTargetTab;
        expect(generatedState.persistedTabInfo).toMatchObject(tabInfoPropertiesThatShouldPropagate);
    });

    it.each`
        selectedTestStep      | selectedTestType
        ${unknownRequirement} | ${unknownTestType}
        ${unknownRequirement} | ${knownTestType}
        ${knownRequirement1}  | ${unknownTestType}
        ${knownRequirement1}  | ${knownTestType}
    `(
        'outputs the first test/step for assessmentNavState regardless of the persisted state ($selectedTestStep/$selectedTestType)',
        ({ selectedTestStep, selectedTestType }) => {
            const generatedState = generator.generateInitialState({
                assessmentNavState: {
                    selectedTestStep,
                    selectedTestType,
                },
            } as IAssessmentStoreData);

            expect(generatedState.assessmentNavState).toEqual(defaultState.assessmentNavState);
        },
    );

    it('outputs generatedAssessmentInstancesMaps filtered to results for known requirements only', () => {
        const persistedMap = {
            id1: createGeneratedAssessmentInstance('id1', [knownRequirement1, unknownRequirement]),
            id2: createGeneratedAssessmentInstance('id2', [unknownRequirement]),
        };
        const expectedMap = {
            id1: createGeneratedAssessmentInstance('id1', [knownRequirement1]),
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

    it('outputs manualTestStepResultMap entries for only known assessments, propagating results for the persisted ones', () => {
        const persistedMap = {
            [knownRequirement1]: createManualRequirementResult(knownRequirement1, ManualTestStatus.FAIL),
            [unknownRequirement]: createManualRequirementResult(unknownRequirement, ManualTestStatus.FAIL),
        };
        const expectedMap = {
            [knownRequirement1]: createManualRequirementResult(knownRequirement1, ManualTestStatus.FAIL),
            [knownRequirement2]: createManualRequirementResult(knownRequirement2, ManualTestStatus.UNKNOWN),
            [knownRequirement3]: createManualRequirementResult(knownRequirement3, ManualTestStatus.UNKNOWN),
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
            [knownRequirement1]: createRequirementResult(true, ManualTestStatus.FAIL),
            [unknownRequirement]: createRequirementResult(true, ManualTestStatus.PASS),
        };
        const expectedTestStepStatus = {
            [knownRequirement1]: createRequirementResult(true, ManualTestStatus.FAIL),
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
});

function createDefaultRequirementResult(): TestStepData {
    return createRequirementResult(false, ManualTestStatus.UNKNOWN);
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

function createGeneratedAssessmentInstance(instanceId: string, requirementIds: string[]): IGeneratedAssessmentInstance {
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
