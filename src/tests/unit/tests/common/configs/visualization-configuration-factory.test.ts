// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as _ from 'lodash';

import { VisualizationConfigurationFactory } from '../../../../../common/configs/visualization-configuration-factory';
import { EnumHelper } from '../../../../../common/enum-helper';
import { IAssessmentData, IAssessmentStoreData } from '../../../../../common/types/store-data/iassessment-result-data';
import { IScanData, IVisualizationStoreData } from '../../../../../common/types/store-data/ivisualization-store-data';
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
        const type = VisualizationType.Color;
        const getExpectedData: (data: IVisualizationStoreData) => IScanData = data => data.tests.adhoc.color;

        testGetStoreData(type, getExpectedData);
    });

    test('getStoreData for headings', () => {
        const type = VisualizationType.Headings;
        const getExpectedData: (data: IVisualizationStoreData) => IScanData = data => data.tests.adhoc.headings;

        testGetStoreData(type, getExpectedData);
    });

    test('getStoreData for headingsAssessment', () => {
        const type = VisualizationType.HeadingsAssessment;
        const getExpectedData: (data: IVisualizationStoreData) => IScanData = data => data.tests.assessments.headingsAssessment;

        testGetStoreData(type, getExpectedData);
    });

    test('setAssessmentData for headingsAssessment', () => {
        const type = VisualizationType.HeadingsAssessment;
        const testData: IAssessmentStoreData = {
            targetTab: {
                id: 1,
                url: 'url',
                title: 'title',
            },
            assessments: {
                headings: {
                    fullAxeResultsMap: null,
                    generatedAssessmentInstancesMap: null,
                } as IAssessmentData,
            },
            assessmentNavState: null,
        };
        const selectorMap = {
            selector: {},
        };
        const instanceMap = {
            selector: {},
        };
        const configuration = testObject.getConfiguration(type);
        configuration.setAssessmentData(testData, selectorMap, instanceMap);
        expect(testData.assessments.headings.fullAxeResultsMap).toEqual(selectorMap);
    });

    test('getStoreData for issues', () => {
        const type = VisualizationType.Issues;
        const getExpectedData: (data: IVisualizationStoreData) => IScanData = data => data.tests.adhoc.issues;

        testGetStoreData(type, getExpectedData);
    });

    test('getStoreData for landmarks', () => {
        const type = VisualizationType.Landmarks;
        const getExpectedData: (data: IVisualizationStoreData) => IScanData = data => data.tests.adhoc.landmarks;

        testGetStoreData(type, getExpectedData);
    });

    test('getStoreData for tabStops', () => {
        const type = VisualizationType.TabStops;
        const getExpectedData: (data: IVisualizationStoreData) => IScanData = data => data.tests.adhoc.tabStops;

        testGetStoreData(type, getExpectedData);
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

        _.each(types, type => {
            const configuration = testObject.getConfiguration(type);

            if (configuration.chromeCommand != null) {
                expect(type).toBe(result[configuration.chromeCommand]);
            } else {
                expect(result[type]).toBeUndefined();
            }
        });
    });

    test('getConfiguration', () => {
        const types = EnumHelper.getNumericValues<VisualizationType>(VisualizationType);

        types.forEach(type => {
            const configuration = testObject.getConfiguration(type);

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

    function testDisplayableData(type: VisualizationType): void {
        const configuration = testObject.getConfiguration(type);
        const displayableData = configuration.displayableData;

        expect(displayableData).toBeDefined();
    }

    function testGetStoreData(type: VisualizationType, getExpectedData: (data: IVisualizationStoreData) => IScanData): void {
        const data = new VisualizationStoreDataBuilder().withEnable(type).build();

        const configuration = testObject.getConfiguration(type);

        const scanData = configuration.getStoreData(data.tests);

        const expected = getExpectedData(data);

        expect(scanData).toEqual(expected);
    }
});
