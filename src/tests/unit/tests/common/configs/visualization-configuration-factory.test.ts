// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { each } from 'lodash';
import { VisualizationConfigurationFactory } from '../../../../../common/configs/visualization-configuration-factory';
import { EnumHelper } from '../../../../../common/enum-helper';
import {
    AssessmentData,
    AssessmentStoreData,
    PersistedTabInfo,
} from '../../../../../common/types/store-data/assessment-result-data';
import {
    ScanData,
    VisualizationStoreData,
} from '../../../../../common/types/store-data/visualization-store-data';
import { VisualizationType } from '../../../../../common/types/visualization-type';
import { VisualizationStoreDataBuilder } from '../../../common/visualization-store-data-builder';

describe('VisualizationConfigurationFactoryTest', () => {
    const testObject = new VisualizationConfigurationFactory();

    test('get config for unsupported type', () => {
        const invalidType = -1 as VisualizationType;
        const action = () => {
            testObject.getConfiguration(invalidType);
        };

        expect(action).toThrowError(`Unsupported type: ${invalidType}`);
    });

    test('getStoreData for color', () => {
        const visualizationType = VisualizationType.Color;
        const getExpectedData: (data: VisualizationStoreData) => ScanData = data =>
            data.tests.adhoc.color;

        testGetStoreData(visualizationType, getExpectedData);
    });

    test('getStoreData for headings', () => {
        const visualizationType = VisualizationType.Headings;
        const getExpectedData: (data: VisualizationStoreData) => ScanData = data =>
            data.tests.adhoc.headings;

        testGetStoreData(visualizationType, getExpectedData);
    });

    test('getStoreData for headingsAssessment', () => {
        const visualizationType = VisualizationType.HeadingsAssessment;
        const getExpectedData: (data: VisualizationStoreData) => ScanData = data =>
            data.tests.assessments.headingsAssessment;

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
        const getExpectedData: (data: VisualizationStoreData) => ScanData = data =>
            data.tests.adhoc.issues;

        testGetStoreData(visualizationType, getExpectedData);
    });

    test('getStoreData for landmarks', () => {
        const visualizationType = VisualizationType.Landmarks;
        const getExpectedData: (data: VisualizationStoreData) => ScanData = data =>
            data.tests.adhoc.landmarks;

        testGetStoreData(visualizationType, getExpectedData);
    });

    test('getStoreData for tabStops', () => {
        const visualizationType = VisualizationType.TabStops;
        const getExpectedData: (data: VisualizationStoreData) => ScanData = data =>
            data.tests.adhoc.tabStops;

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

    test('get chrome commands to visualization type maps', () => {
        const result = testObject.getChromeCommandToVisualizationTypeMap();

        const types = EnumHelper.getNumericValues<VisualizationType>(VisualizationType);

        each(types, visualizationType => {
            const configuration = testObject.getConfiguration(visualizationType);

            if (configuration.chromeCommand != null) {
                expect(visualizationType).toBe(result[configuration.chromeCommand]);
            } else {
                expect(result[visualizationType]).toBeUndefined();
            }
        });
    });

    test('getConfiguration', () => {
        const types = EnumHelper.getNumericValues<VisualizationType>(VisualizationType);

        types.forEach(visualizationType => {
            const configuration = testObject.getConfiguration(visualizationType);

            expect(configuration).toBeDefined();
        });
    });

    test('getConfigurationByKey for visualizations', () => {
        const keys = ['color', 'headings', 'landmarks', 'tabStops', 'issues'];

        keys.forEach(key => {
            const configuration = testObject.getConfigurationByKey(key);

            expect(configuration).toBeDefined();
            expect(configuration.key).toBe(key);
        });
    });

    function testDisplayableData(visualizationType: VisualizationType): void {
        const configuration = testObject.getConfiguration(visualizationType);
        const displayableData = configuration.displayableData;

        expect(displayableData).toBeDefined();
    }

    function testGetStoreData(
        visualizationType: VisualizationType,
        getExpectedData: (data: VisualizationStoreData) => ScanData,
    ): void {
        const data = new VisualizationStoreDataBuilder().withEnable(visualizationType).build();

        const configuration = testObject.getConfiguration(visualizationType);

        const scanData = configuration.getStoreData(data.tests);

        const expected = getExpectedData(data);

        expect(scanData).toEqual(expected);
    }
});
