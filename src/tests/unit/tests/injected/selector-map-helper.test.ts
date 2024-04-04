// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AutomatedChecks } from 'assessments/automated-checks/assessment';
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';
import { FeatureFlags } from 'common/feature-flags';
import {
    ConvertAssessmentStoreDataToScanNodeResultsCallback,
    ConvertUnifiedStoreDataToScanNodeResultsCallback,
    ScanNodeResult,
} from 'common/store-data-to-scan-node-result-converter';
import { CardSelectionStoreData } from 'common/types/store-data/card-selection-store-data';
import { ManualTestStatus } from 'common/types/store-data/manual-test-status';
import { UnifiedResult, UnifiedRule } from 'common/types/store-data/unified-data-interface';
import { GetElementBasedViewModelCallback } from 'injected/element-based-view-model-creator';
import { AssessmentVisualizationInstance } from 'injected/frameCommunicators/html-element-axe-results-helper';
import { SelectorToVisualizationMap } from 'injected/selector-to-visualization-map';
import { GetVisualizationInstancesForTabStops } from 'injected/visualization/get-visualization-instances-for-tab-stops';
import { exampleUnifiedResult } from 'tests/unit/tests/common/components/cards/sample-view-model-data';
import { IMock, It, Mock, MockBehavior } from 'typemoq';
import {
    AssessmentData,
    AssessmentStoreData,
    GeneratedAssessmentInstance,
    InstanceIdToInstanceDataMap,
    TestStepResult,
} from '../../../../common/types/store-data/assessment-result-data';
import { VisualizationType } from '../../../../common/types/visualization-type';
import {
    SelectorMapHelper,
    VisualizationRelatedStoreData,
} from '../../../../injected/selector-map-helper';
import { VisualizationScanResultStoreDataBuilder } from '../../common/visualization-scan-result-store-data-builder';

describe('SelectorMapHelperTest', () => {
    let testSubject: SelectorMapHelper;
    let getElementBasedViewModelMock: IMock<GetElementBasedViewModelCallback>;
    let getVisualizationInstancesForTabStopsMock: IMock<
        typeof GetVisualizationInstancesForTabStops
    >;
    let visualizationConfigurationFactoryMock: IMock<VisualizationConfigurationFactory>;
    let convertUnifiedStoreDataForScanNodeResultsCallbackMock: IMock<ConvertUnifiedStoreDataToScanNodeResultsCallback>;
    let convertAssessmentStoreDataForScanNodeResultsCallbackMock: IMock<ConvertAssessmentStoreDataToScanNodeResultsCallback>;

    const adHocVisualizationTypes = [
        VisualizationType.Headings,
        VisualizationType.Landmarks,
        VisualizationType.Color,
    ];

    const unifiedAdHocVisualizationTypes = [
        VisualizationType.Issues,
        VisualizationType.NeedsReview,
    ];

    const assessmentTestsUsingElementBasedViewModels = [VisualizationType.AutomatedChecks];

    beforeEach(() => {
        visualizationConfigurationFactoryMock = Mock.ofType<VisualizationConfigurationFactory>();
        getElementBasedViewModelMock = Mock.ofType<GetElementBasedViewModelCallback>();
        getVisualizationInstancesForTabStopsMock =
            Mock.ofType<typeof GetVisualizationInstancesForTabStops>();
        convertUnifiedStoreDataForScanNodeResultsCallbackMock =
            Mock.ofType<ConvertUnifiedStoreDataToScanNodeResultsCallback>(
                undefined,
                MockBehavior.Strict,
            );
        convertAssessmentStoreDataForScanNodeResultsCallbackMock =
            Mock.ofType<ConvertAssessmentStoreDataToScanNodeResultsCallback>(
                undefined,
                MockBehavior.Strict,
            );
        testSubject = new SelectorMapHelper(
            visualizationConfigurationFactoryMock.object,
            getElementBasedViewModelMock.object,
            getVisualizationInstancesForTabStopsMock.object,
            convertUnifiedStoreDataForScanNodeResultsCallbackMock.object,
            convertAssessmentStoreDataForScanNodeResultsCallbackMock.object,
        );
    });

    test('constructor', () => {
        expect(new SelectorMapHelper(null, null, null)).toBeDefined();
    });

    adHocVisualizationTypes.forEach(visualizationType => {
        test(`getSelectorMap: ${VisualizationType[visualizationType]}`, () => {
            const selectorMap = { key1: { target: ['element1'] } };
            const state = new VisualizationScanResultStoreDataBuilder()
                .withSelectorMap(visualizationType, selectorMap)
                .build();
            const storeData: VisualizationRelatedStoreData = {
                visualizationScanResultStoreData: state,
            } as unknown as VisualizationRelatedStoreData;
            expect(testSubject.getSelectorMap(visualizationType, null, storeData)).toEqual(
                selectorMap,
            );
        });
    });

    unifiedAdHocVisualizationTypes.forEach(visualizationType => {
        test(`getState: ${VisualizationType[visualizationType]}`, () => {
            const selectorMap = {
                key1: { target: ['element1'] } as AssessmentVisualizationInstance,
            };
            const rulesStub: UnifiedRule[] = [{ id: 'some rule' } as UnifiedRule];
            const resultsStub: UnifiedResult[] = [exampleUnifiedResult];
            const unifiedScanData = {
                rules: rulesStub,
                results: resultsStub,
            };
            const needsReviewScanData = {
                rules: rulesStub,
                results: resultsStub,
            };
            const storeData: VisualizationRelatedStoreData = {
                unifiedScanResultStoreData: unifiedScanData,
                cardSelectionStoreData: {},
                needsReviewScanResultStoreData: needsReviewScanData,
                needsReviewCardSelectionStoreData: {},
            } as VisualizationRelatedStoreData;

            const scanResultsNodesStub = [];
            convertUnifiedStoreDataForScanNodeResultsCallbackMock
                .setup(m => m(It.isAny()))
                .returns(() => scanResultsNodesStub);
            getElementBasedViewModelMock
                .setup(gebvm =>
                    gebvm(scanResultsNodesStub, storeData.cardSelectionStoreData, undefined),
                )
                .returns(() => selectorMap);

            expect(testSubject.getSelectorMap(visualizationType, null, storeData)).toEqual(
                selectorMap,
            );
        });
    });

    assessmentTestsUsingElementBasedViewModels.forEach(visualizationType => {
        test(`getState: ${VisualizationType[visualizationType]}`, () => {
            const testKey = AutomatedChecks.key;
            const selectorMap = {
                automatedChecks: { target: ['element1'] } as AssessmentVisualizationInstance,
            };
            const assessmentStoreDataStub = {} as AssessmentStoreData;
            const assessmentCardSelectionStoreDataStub = {} as CardSelectionStoreData;

            const storeData: VisualizationRelatedStoreData = {
                assessmentStoreData: assessmentStoreDataStub,
                assessmentCardSelectionStoreData: {
                    [testKey]: assessmentCardSelectionStoreDataStub,
                },
                featureFlagStoreData: { [FeatureFlags.automatedChecks]: true },
            } as unknown as VisualizationRelatedStoreData;

            setupVisualizationConfigurationFactory(null, null, visualizationType, testKey);
            const scanResultsNodesStub = [
                { uid: 'failing-result-id', status: 'fail' },
                { uid: 'non-failing-result-id', status: 'pass' },
            ] as ScanNodeResult[];
            const failingScanResultsNodes = [scanResultsNodesStub[0]];
            convertAssessmentStoreDataForScanNodeResultsCallbackMock
                .setup(m =>
                    m(assessmentStoreDataStub, testKey, assessmentCardSelectionStoreDataStub),
                )
                .returns(() => scanResultsNodesStub);
            getElementBasedViewModelMock
                .setup(gebvm =>
                    gebvm(failingScanResultsNodes, assessmentCardSelectionStoreDataStub),
                )
                .returns(() => selectorMap);

            expect(testSubject.getSelectorMap(visualizationType, null, storeData)).toEqual(
                selectorMap,
            );
        });
    });

    test('getState: tabStops', () => {
        const visualizationType = VisualizationType.TabStops;
        const state = new VisualizationScanResultStoreDataBuilder().build();
        state.tabStops.tabbedElements = [];
        const expectedResults = {
            'some;target': null,
        } as SelectorToVisualizationMap;
        const storeData: VisualizationRelatedStoreData = {
            visualizationScanResultStoreData: state,
        } as VisualizationRelatedStoreData;

        getVisualizationInstancesForTabStopsMock
            .setup(m => m(state.tabStops))
            .returns(() => expectedResults);

        expect(testSubject.getSelectorMap(visualizationType, null, storeData)).toEqual(
            expectedResults,
        );
    });

    test('getState for assessment, selector map is not null', () => {
        const visualizationType: number = -1;
        const assessmentKeyStub = 'some assessment key';
        const stepKey = 'some step';
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
            [assessmentKeyStub]: {
                target: ['element2'],
                testStepResults: {
                    [stepKey]: {
                        status: ManualTestStatus.FAIL,
                        isVisualizationEnabled: true,
                    } as TestStepResult,
                },
                html: 'html',
                propertyBag: {},
            } as GeneratedAssessmentInstance,
        };
        const assessmentDataStub = {
            generatedAssessmentInstancesMap: selectorMap,
        } as AssessmentData;
        const assessmentsData: {
            [key: string]: AssessmentData;
        } = {
            [assessmentKeyStub]: assessmentDataStub,
        };
        const state = {
            assessments: assessmentsData,
        } as AssessmentStoreData;
        const storeData: VisualizationRelatedStoreData = {
            assessmentStoreData: state,
            featureFlagStoreData: { [FeatureFlags.automatedChecks]: false },
        } as unknown as VisualizationRelatedStoreData;

        setupVisualizationConfigurationFactory(state, assessmentDataStub, visualizationType);
        const result = testSubject.getSelectorMap(visualizationType, stepKey, storeData);

        const expectedSelectedMap = {
            [assessmentKeyStub]: {
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
        const visualizationType: number = -1;
        const assessmentKeyStub = 'some assessment key';
        const stepKey = 'some step';
        const selectorMap = null;
        const assessmentDataStub = {
            generatedAssessmentInstancesMap: selectorMap,
        } as AssessmentData;
        const assessmentsData: {
            [key: string]: AssessmentData;
        } = {
            [assessmentKeyStub]: assessmentDataStub,
        };
        const state = {
            assessments: assessmentsData,
        } as AssessmentStoreData;

        setupVisualizationConfigurationFactory(state, assessmentDataStub, visualizationType);
        const storeData: VisualizationRelatedStoreData = {
            assessmentStoreData: state,
            featureFlagStoreData: { [FeatureFlags.automatedChecks]: false },
        } as unknown as VisualizationRelatedStoreData;

        const result = testSubject.getSelectorMap(visualizationType, stepKey, storeData);

        expect(result).toBeNull();
    });

    function setupVisualizationConfigurationFactory(
        state: AssessmentStoreData,
        assessmentData: AssessmentData,
        visualizationType: VisualizationType,
        key: string = null,
    ): void {
        const getAssessmentDataMock = Mock.ofType<(storeData: AssessmentStoreData) => void>();
        getAssessmentDataMock.setup(m => m(state)).returns(() => assessmentData);
        visualizationConfigurationFactoryMock
            .setup(m => m.getConfiguration(visualizationType))
            .returns(() => {
                return {
                    getAssessmentData: getAssessmentDataMock.object,
                    key,
                } as VisualizationConfiguration;
            });
    }
});
