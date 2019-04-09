// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, Mock, MockBehavior } from 'typemoq';

import { AssessmentsProvider } from '../../../../assessments/types/iassessments-provider';
import { AssessmentStore } from '../../../../background/stores/assessment-store';
import { VisualizationScanResultStore } from '../../../../background/stores/visualization-scan-result-store';
import { BaseStore } from '../../../../common/base-store';
import { ManualTestStatus } from '../../../../common/types/manual-test-status';
import {
    IAssessmentStoreData,
    IGeneratedAssessmentInstance,
    ITestStepResult,
} from '../../../../common/types/store-data/assessment-result-data';
import { VisualizationScanResultData } from '../../../../common/types/store-data/visualization-scan-result-data';
import { VisualizationType } from '../../../../common/types/visualization-type';
import { AssessmentVisualizationInstance } from '../../../../injected/frameCommunicators/html-element-axe-results-helper';
import { SelectorMapHelper } from '../../../../injected/selector-map-helper';
import { DictionaryStringTo } from '../../../../types/common-types';
import { CreateTestAssessmentProvider } from '../../common/test-assessment-provider';
import { VisualizationScanResultStoreDataBuilder } from '../../common/visualization-scan-result-store-data-builder';

describe('SelectorMapHelperTest', () => {
    let scanResultStoreMock: IMock<BaseStore<VisualizationScanResultData>>;
    let assessmentStoreMock: IMock<BaseStore<IAssessmentStoreData>>;
    let assessmentsProvider: AssessmentsProvider;
    let testSelectorMap: DictionaryStringTo<IGeneratedAssessmentInstance<any, any>>;
    let expected: DictionaryStringTo<AssessmentVisualizationInstance>;
    let testSubject: SelectorMapHelper;

    beforeEach(() => {
        scanResultStoreMock = Mock.ofType(VisualizationScanResultStore, MockBehavior.Strict);
        assessmentStoreMock = Mock.ofType(AssessmentStore, MockBehavior.Strict);
        assessmentsProvider = CreateTestAssessmentProvider();
        expected = {
            key2: {
                html: 'html',
                isFailure: true,
                isVisible: true,
                isVisualizationEnabled: true,
                propertyBag: {},
                target: ['element2'],
                identifier: 'key2',
                ruleResults: null,
            },
        };
        testSelectorMap = {
            key1: {
                target: ['element1'],
                testStepResults: {
                    step1: {
                        status: ManualTestStatus.FAIL,
                        isVisualizationEnabled: true,
                        isVisible: true,
                    } as ITestStepResult,
                },
                ruleResults: null,
                html: null,
            },
            key2: {
                target: ['element2'],
                testStepResults: {
                    step2: {
                        status: ManualTestStatus.FAIL,
                        isVisualizationEnabled: true,
                        isVisible: true,
                    } as ITestStepResult,
                },
                html: 'html',
                propertyBag: {},
            },
        };

        testSubject = new SelectorMapHelper(scanResultStoreMock.object, assessmentStoreMock.object, assessmentsProvider);
    });

    test('constructor', () => {
        expect(new SelectorMapHelper(null, null, null)).toBeDefined();
    });

    test('getState: issues', () => {
        const selectorMap = { key1: { target: ['element1'] } };
        const state = new VisualizationScanResultStoreDataBuilder().withIssuesSelectedTargets(selectorMap as any).build();

        scanResultStoreMock
            .setup(ss => ss.getState())
            .returns(() => state)
            .verifiable();
        setAssessmentStore();

        testSubject.getSelectorMap(VisualizationType.Issues);

        scanResultStoreMock.verifyAll();
    });

    test('getState: headings', () => {
        const visualizationType = VisualizationType.Headings;
        const selectorMap = { key1: { target: ['element1'] } };
        const state = new VisualizationScanResultStoreDataBuilder().withSelectorMap(visualizationType, selectorMap).build();

        scanResultStoreMock
            .setup(ss => ss.getState())
            .returns(() => state)
            .verifiable();
        setAssessmentStore();

        testSubject.getSelectorMap(visualizationType);

        scanResultStoreMock.verifyAll();
    });

    test('getState: landmarks', () => {
        const visualizationType = VisualizationType.Landmarks;
        const selectorMap = { key1: { target: ['element1'] } };
        const state = new VisualizationScanResultStoreDataBuilder().withSelectorMap(visualizationType, selectorMap).build();

        scanResultStoreMock
            .setup(ss => ss.getState())
            .returns(() => state)
            .verifiable();
        setAssessmentStore();

        testSubject.getSelectorMap(visualizationType);

        scanResultStoreMock.verifyAll();
    });

    test('getState: color', () => {
        const visualizationType = VisualizationType.Color;
        const selectorMap = { key1: { target: ['element1'] } };
        const state = new VisualizationScanResultStoreDataBuilder().withSelectorMap(visualizationType, selectorMap).build();

        scanResultStoreMock
            .setup(ss => ss.getState())
            .returns(() => state)
            .verifiable();
        setAssessmentStore();

        testSubject.getSelectorMap(visualizationType);

        scanResultStoreMock.verifyAll();
    });

    test('getState: tabStops', () => {
        const visualizationType = VisualizationType.TabStops;
        const state = new VisualizationScanResultStoreDataBuilder().build();

        state.tabStops.tabbedElements = [];

        scanResultStoreMock
            .setup(ss => ss.getState())
            .returns(() => state)
            .verifiable();
        setAssessmentStore();

        testSubject.getSelectorMap(visualizationType);

        scanResultStoreMock.verifyAll();
    });

    test('getState for assessment, selector map is not null', () => {
        const assessment = assessmentsProvider.all()[0];
        const visualizationType = assessment.visualizationType;
        const firstStep = assessment.requirements[0];

        const selectorMap = {
            key1: {
                target: ['element1'],
                testStepResults: {
                    step1: {
                        status: ManualTestStatus.FAIL,
                        isVisualizationEnabled: true,
                        isVisible: true,
                    } as ITestStepResult,
                },
                ruleResults: null,
                html: null,
            },
            [assessment.key]: {
                target: ['element2'],
                testStepResults: {
                    [firstStep.key]: {
                        status: ManualTestStatus.FAIL,
                        isVisualizationEnabled: true,
                        isVisible: true,
                    } as ITestStepResult,
                },
                html: 'html',
                propertyBag: {},
            },
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
        };

        assessmentStoreMock
            .setup(ss => ss.getState())
            .returns(() => state as any)
            .verifiable();

        const result = testSubject.getSelectorMap(visualizationType);

        assessmentStoreMock.verifyAll();
        const expectedSelectedMap = {
            [assessment.key]: {
                html: 'html',
                isFailure: true,
                isVisible: true,
                isVisualizationEnabled: true,
                propertyBag: {},
                target: ['element2'],
                identifier: assessment.key,
                ruleResults: null,
            },
        };

        expect(result).toEqual(expectedSelectedMap);
        assessmentStoreMock.verifyAll();
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
        };

        assessmentStoreMock
            .setup(ss => ss.getState())
            .returns(() => state as any)
            .verifiable();

        const result = testSubject.getSelectorMap(visualizationType);

        assessmentStoreMock.verifyAll();

        expect(result).toBeNull();
    });

    function setAssessmentStore(): void {
        assessmentStoreMock.setup(a => a.getState()).verifiable();
    }

    function setScanResultStore(): void {
        scanResultStoreMock.setup(a => a.getState()).verifiable();
    }
});
