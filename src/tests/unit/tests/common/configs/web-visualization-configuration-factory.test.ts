// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Assessments } from 'assessments/assessments';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';
import { Requirement } from 'assessments/types/requirement';
import { TestMode } from 'common/configs/test-mode';
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { WebVisualizationConfigurationFactory } from 'common/configs/web-visualization-configuration-factory';
import { forOwn } from 'lodash';
import { IMock, It, Mock, Times } from 'typemoq';
import { DictionaryNumberTo } from 'types/common-types';
import {
    AssessmentData,
    AssessmentStoreData,
    PersistedTabInfo,
} from '../../../../../common/types/store-data/assessment-result-data';
import {
    ScanData,
    TestsEnabledState,
    TestsScanData,
} from '../../../../../common/types/store-data/visualization-store-data';
import { VisualizationType } from '../../../../../common/types/visualization-type';

describe('WebVisualizationConfigurationFactory', () => {
    let testObject: WebVisualizationConfigurationFactory;

    let mediumPassProviderMock: IMock<AssessmentsProvider>;

    beforeEach(() => {
        mediumPassProviderMock = Mock.ofType<AssessmentsProvider>();
        mediumPassProviderMock.setup(m => m.isValidType(It.isAny())).returns(() => false);
        testObject = new WebVisualizationConfigurationFactory(
            Assessments,
            mediumPassProviderMock.object,
        );
    });

    test('get config for unsupported type', () => {
        const invalidType = -1 as VisualizationType;
        const action = () => {
            testObject.getConfiguration(invalidType);
        };

        expect(action).toThrowError(`Unsupported type: ${invalidType}`);
    });

    test('getStoreData for color', () => {
        const visualizationType = VisualizationType.Color;
        const getExpectedData: (data: TestsEnabledState) => ScanData = data => data.adhoc.color;

        testGetStoreData(visualizationType, getExpectedData);
    });

    test('getStoreData for headings', () => {
        const visualizationType = VisualizationType.Headings;
        const getExpectedData: (data: TestsEnabledState) => ScanData = data => data.adhoc.headings;

        testGetStoreData(visualizationType, getExpectedData);
    });

    test('getStoreData for headingsAssessment', () => {
        const visualizationType = VisualizationType.HeadingsAssessment;
        const getExpectedData: (data: TestsEnabledState) => ScanData = data =>
            data.assessments.headingsAssessment;

        testGetStoreData(visualizationType, getExpectedData);
    });

    test('setAssessmentData for headingsAssessment', () => {
        const visualizationType = VisualizationType.HeadingsAssessment;
        const testData: AssessmentStoreData = {
            persistedTabInfo: {} as PersistedTabInfo,
            assessments: {
                headings: {
                    fullAxeResultsMap: null,
                    generatedAssessmentInstancesMap: null,
                } as AssessmentData,
            },
            assessmentNavState: null,
            resultDescription: '',
        };
        const selectorMap = {
            selector: {},
        };
        const instanceMap = {
            selector: {},
        };
        const configuration = testObject.getConfiguration(visualizationType);
        configuration.setAssessmentData(testData, selectorMap, instanceMap);
        expect(testData.assessments.headings.fullAxeResultsMap).toEqual(selectorMap);
    });

    test('getStoreData for issues', () => {
        const visualizationType = VisualizationType.Issues;
        const getExpectedData: (data: TestsEnabledState) => ScanData = data => data.adhoc.issues;

        testGetStoreData(visualizationType, getExpectedData);
    });

    test('getStoreData for landmarks', () => {
        const visualizationType = VisualizationType.Landmarks;
        const getExpectedData: (data: TestsEnabledState) => ScanData = data => data.adhoc.landmarks;

        testGetStoreData(visualizationType, getExpectedData);
    });

    test('getStoreData for tabStops', () => {
        const visualizationType = VisualizationType.TabStops;
        const getExpectedData: (data: TestsEnabledState) => ScanData = data => data.adhoc.tabStops;

        testGetStoreData(visualizationType, getExpectedData);
    });

    test('displayableData for color', () => {
        testDisplayableData(VisualizationType.Color);
    });

    test('displayableData for headings', () => {
        testDisplayableData(VisualizationType.Headings);
    });

    test('displayableData for headings', () => {
        testDisplayableData(VisualizationType.HeadingsAssessment);
    });

    test('displayableData for issues', () => {
        testDisplayableData(VisualizationType.Issues);
    });

    test('displayableData for landmarks', () => {
        testDisplayableData(VisualizationType.Landmarks);
    });

    test('displayableData for tabStops', () => {
        testDisplayableData(VisualizationType.TabStops);
    });

    test('getChromeCommandToVisualizationTypeMap', () => {
        const result = testObject.getChromeCommandToVisualizationTypeMap();
        expect(result).toMatchSnapshot();
    });

    test('getChromeCommandToVisualizationTypeMap where a config does not have a chrome command', () => {
        const configurationByTypeStub = {
            [VisualizationType.Color]: {} as VisualizationConfiguration,
        } as DictionaryNumberTo<VisualizationConfiguration>;
        (testObject as any).configurationByType = {
            ...(testObject as any).configurationByType,
            ...configurationByTypeStub,
        };
        const result = testObject.getChromeCommandToVisualizationTypeMap();
        expect(result).toMatchSnapshot();
    });

    test('forEachConfig', () => {
        const assessmentProviderMock = Mock.ofType<AssessmentsProvider>();
        const mediumPassProviderMock = Mock.ofType<AssessmentsProvider>();
        const callbackMock =
            Mock.ofType<
                (
                    config: VisualizationConfiguration,
                    type: VisualizationType,
                    requirementConfig?: Requirement,
                ) => void
            >();

        testObject = new WebVisualizationConfigurationFactory(
            assessmentProviderMock.object,
            mediumPassProviderMock.object,
        );
        const assessmentStubs = [getAssessmentStub('a-1', -1), getAssessmentStub('a-2', -2)];
        const mediumPassStubs = [getAssessmentStub('mp-1', -3), getAssessmentStub('mp-2', -4)];

        mediumPassProviderMock.setup(mock => mock.all()).returns(() => mediumPassStubs);
        assessmentProviderMock.setup(mock => mock.all()).returns(() => assessmentStubs);

        testObject.forEachConfig(callbackMock.object);

        verifyEachProviderConfigIsCalled(callbackMock, assessmentStubs, TestMode.Assessments);
        verifyEachProviderConfigIsCalled(callbackMock, mediumPassStubs, TestMode.MediumPass);
        forOwn(
            (testObject as any).configurationByType,
            (config: VisualizationConfiguration, key: string) => {
                const type = Number(key);
                callbackMock.verify(m => m(config, type), Times.once());
            },
        );
    });

    function getAssessmentStub(title: string, visualizationType: VisualizationType): Assessment {
        const requirementsStub = [
            {
                key: 'req-1',
            },
            {
                key: 'req-2',
            },
        ] as Requirement[];
        return {
            title,
            visualizationType,
            requirements: requirementsStub,
            getVisualizationConfiguration: () => {},
        } as Assessment;
    }

    function verifyEachProviderConfigIsCalled(
        callbackMock: IMock<
            (
                config: VisualizationConfiguration,
                type: VisualizationType,
                requirementConfig?: Requirement,
            ) => void
        >,
        assessmentStubs: Readonly<Assessment>[],
        testMode: TestMode,
    ) {
        assessmentStubs.forEach(stub => {
            stub.requirements.forEach(reqStub =>
                callbackMock.verify(
                    m =>
                        m(
                            It.isObjectWith(getAssessmentDefaults(stub.title, testMode)),
                            stub.visualizationType,
                            reqStub,
                        ),
                    Times.once(),
                ),
            );
        });
    }

    test('getConfiguration for mediumPass', () => {
        const type = VisualizationType.HeadingsAssessment;
        const requirementKey = 'some requirement key';
        const visualizationKeyStub = 'some key';
        const assessmentStub = {
            title: 'some title',
            getVisualizationConfiguration: () => ({ key: visualizationKeyStub }),
            requirements: [
                {
                    key: requirementKey,
                },
            ],
        } as Assessment;
        const testData = {
            [TestMode.MediumPass]: {
                [visualizationKeyStub]: {
                    enabled: true,
                },
            } as TestsScanData,
        } as TestsEnabledState;
        const expectedDefaults = getAssessmentDefaults(assessmentStub.title, TestMode.MediumPass);
        const expected = {
            ...assessmentStub.getVisualizationConfiguration(),
            ...expectedDefaults,
        };
        mediumPassProviderMock.reset();
        mediumPassProviderMock.setup(m => m.isValidType(type)).returns(() => true);
        mediumPassProviderMock.setup(m => m.forType(type)).returns(() => assessmentStub);

        const returnedConfiguration = testObject.getConfiguration(type);
        expect(returnedConfiguration).toMatchObject(expected);
        expect(returnedConfiguration.getIdentifier(requirementKey)).toEqual(
            `${TestMode.MediumPass}-${requirementKey}`,
        );
        expect(returnedConfiguration.getStoreData(testData)).toEqual(
            testData.mediumPass[visualizationKeyStub],
        );
    });

    test('getConfigurationByKey for adhoc visualizations', () => {
        const keys = ['color', 'headings', 'landmarks', 'tabStops', 'issues'];

        keys.forEach(key => {
            const configuration = testObject.getConfigurationByKey(key);

            expect(configuration).toBeDefined();
            expect(configuration.key).toBe(key);
        });
    });

    // This is important for any data structure which assumes it's safe to use configIds as keys
    test("manually specified visualizaton keys don't overlap with requirement visualization keys", () => {
        for (const assessment of Assessments.all()) {
            const assessmentConfig = testObject.getConfiguration(assessment.visualizationType);
            for (const requirement of assessment.requirements) {
                const requirementVisualizationKey = assessmentConfig.getIdentifier(requirement.key);
                const correspondingManuallyKeyedConfiguration = testObject.getConfigurationByKey(
                    requirementVisualizationKey,
                );

                expect(correspondingManuallyKeyedConfiguration).toBeUndefined();
            }
        }
    });

    function testDisplayableData(visualizationType: VisualizationType): void {
        const configuration = testObject.getConfiguration(visualizationType);
        const displayableData = configuration.displayableData;

        expect(displayableData).toBeDefined();
    }

    function testGetStoreData(
        visualizationType: VisualizationType,
        getExpectedData: (data: TestsEnabledState) => ScanData,
    ): void {
        const configuration = testObject.getConfiguration(visualizationType);
        const data = {
            [configuration.testMode]: {
                [configuration.key]: {
                    enabled: true,
                },
            },
        } as any;
        const scanData = configuration.getStoreData(data);

        const expected = getExpectedData(data);

        expect(scanData).toEqual(expected);
    }

    function getAssessmentDefaults(
        expectedDisplayableTitle: string,
        testMode: TestMode,
    ): Partial<VisualizationConfiguration> {
        return {
            testMode,
            chromeCommand: null,
            launchPanelDisplayOrder: null,
            adhocToolsPanelDisplayOrder: null,
            displayableData: {
                title: expectedDisplayableTitle,
                noResultsFound: null,
                enableMessage: null,
                toggleLabel: null,
                linkToDetailsViewText: null,
            },
            shouldShowExportReport: null,
        };
    }
});
