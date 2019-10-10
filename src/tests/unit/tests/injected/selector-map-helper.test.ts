// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';

import { ManualTestStatus } from '../../../../common/types/manual-test-status';
import {
    AssessmentStoreData,
    GeneratedAssessmentInstance,
    InstanceIdToInstanceDataMap,
    TestStepResult,
} from '../../../../common/types/store-data/assessment-result-data';
import { VisualizationType } from '../../../../common/types/visualization-type';
import { SelectorMapHelper } from '../../../../injected/selector-map-helper';
import { CreateTestAssessmentProvider } from '../../common/test-assessment-provider';
import { VisualizationScanResultStoreDataBuilder } from '../../common/visualization-scan-result-store-data-builder';

describe('SelectorMapHelperTest', () => {
    let assessmentsProvider: AssessmentsProvider;
    let testSubject: SelectorMapHelper;
    const adHocVisualizationTypes = [VisualizationType.Headings, VisualizationType.Landmarks, VisualizationType.Color];
    beforeEach(() => {
        assessmentsProvider = CreateTestAssessmentProvider();

        testSubject = new SelectorMapHelper(assessmentsProvider);
    });

    test('constructor', () => {
        expect(new SelectorMapHelper(null)).toBeDefined();
    });

    adHocVisualizationTypes.forEach(visualizationType => {
        test(`getSelectorMap: ${VisualizationType[visualizationType]}`, () => {
            const selectorMap = { key1: { target: ['element1'] } };
            const state = new VisualizationScanResultStoreDataBuilder().withSelectorMap(visualizationType, selectorMap).build();

            expect(testSubject.getSelectorMap(visualizationType, state, null, null, null)).toEqual(selectorMap);
        });
    });

    test('getState: issues', () => {
        const selectorMap = { key1: { target: ['element1'] } };
        const state = new VisualizationScanResultStoreDataBuilder().withIssuesSelectedTargets(selectorMap as any).build();

        expect(testSubject.getSelectorMap(VisualizationType.Issues, state, null, null, null)).toEqual(selectorMap);
    });

    test('getState: tabStops', () => {
        const visualizationType = VisualizationType.TabStops;
        const state = new VisualizationScanResultStoreDataBuilder().build();

        state.tabStops.tabbedElements = [];

        expect(testSubject.getSelectorMap(visualizationType, state, null, null, null)).toEqual([]);
    });

    test('getState for assessment, selector map is not null', () => {
        const assessment = assessmentsProvider.all()[0];
        const visualizationType = assessment.visualizationType;
        const firstStep = assessment.requirements[0];

        const selectorMap: InstanceIdToInstanceDataMap = {
            key1: {
                target: ['element1'],
                testStepResults: {
                    step1: {
                        status: ManualTestStatus.FAIL,
                        isVisualizationEnabled: true,
                    } as TestStepResult,
                },
                ruleResults: null,
                html: null,
            } as GeneratedAssessmentInstance,
            [assessment.key]: {
                target: ['element2'],
                testStepResults: {
                    [firstStep.key]: {
                        status: ManualTestStatus.FAIL,
                        isVisualizationEnabled: true,
                    } as TestStepResult,
                },
                html: 'html',
                propertyBag: {},
            } as GeneratedAssessmentInstance,
        };

        const state = {
            assessments: {
                [assessment.key]: {
                    generatedAssessmentInstancesMap: selectorMap,
                },
            },
            assessmentNavState: {
                selectedTestStep: firstStep.key,
            },
        } as AssessmentStoreData;

        const result = testSubject.getSelectorMap(visualizationType, null, state, null, null);

        const expectedSelectedMap = {
            [assessment.key]: {
                isFailure: true,
                isVisualizationEnabled: true,
                propertyBag: {},
                target: ['element2'],
                ruleResults: null,
            },
        };

        expect(result).toEqual(expectedSelectedMap);
    });

    test('getState for assessment: selectorMap null', () => {
        const assessment = assessmentsProvider.all()[0];
        const visualizationType = assessment.visualizationType;
        const firstStep = assessment.requirements[0];

        const selectorMap = null;
        const state = {
            assessments: {
                [assessment.key]: {
                    generatedAssessmentInstancesMap: selectorMap,
                },
            },
            assessmentNavState: {
                selectedTestStep: firstStep.key,
            },
        } as AssessmentStoreData;

        const result = testSubject.getSelectorMap(visualizationType, null, state, null, null);

        expect(result).toBeNull();
    });
});
