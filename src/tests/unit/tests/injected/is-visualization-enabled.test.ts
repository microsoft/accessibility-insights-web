// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TestMode } from 'common/configs/test-mode';
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import { ScanData, VisualizationStoreData } from 'common/types/store-data/visualization-store-data';
import { IMock, Mock } from 'typemoq';

import {
    isVisualizationEnabled,
    IsVisualizationEnabledCallback,
} from '../../../../injected/is-visualization-enabled';

describe('isVisualizationEnabled', () => {
    let visualizationConfigurationMock: IMock<VisualizationConfiguration>;
    let visualizationState: VisualizationStoreData;
    let assessmentState: AssessmentStoreData;
    let tabState: TabStoreData;
    let stepStub: string;
    let testSubject: IsVisualizationEnabledCallback;
    let scanDataStub: ScanData;

    beforeEach(() => {
        visualizationConfigurationMock = Mock.ofType<VisualizationConfiguration>();
        visualizationState = {
            tests: {},
        } as VisualizationStoreData;
        scanDataStub = {} as ScanData;
        stepStub = 'some step';

        visualizationConfigurationMock
            .setup(config => config.getStoreData(visualizationState.tests))
            .returns(() => scanDataStub);

        testSubject = isVisualizationEnabled;
    });

    test('testStatus is false', () => {
        visualizationConfigurationMock
            .setup(config => config.getTestStatus(scanDataStub, stepStub))
            .returns(() => false);

        expect(
            testSubject(
                visualizationConfigurationMock.object,
                stepStub,
                visualizationState,
                assessmentState,
                tabState,
            ),
        ).toEqual(false);
    });

    test('testStatus is true & is not an assessment test', () => {
        visualizationConfigurationMock
            .setup(config => config.getTestStatus(scanDataStub, stepStub))
            .returns(() => true);
        visualizationConfigurationMock
            .setup(config => config.testMode)
            .returns(() => TestMode.Adhoc);

        expect(
            testSubject(
                visualizationConfigurationMock.object,
                stepStub,
                visualizationState,
                assessmentState,
                tabState,
            ),
        ).toEqual(true);
    });

    test('testStatus is true & is an assessment test and there is no persisted tab info', () => {
        visualizationConfigurationMock
            .setup(config => config.getTestStatus(scanDataStub, stepStub))
            .returns(() => true);
        visualizationConfigurationMock
            .setup(config => config.testMode)
            .returns(() => TestMode.Assessments);

        assessmentState = {
            persistedTabInfo: null,
        } as AssessmentStoreData;

        expect(
            testSubject(
                visualizationConfigurationMock.object,
                stepStub,
                visualizationState,
                assessmentState,
                tabState,
            ),
        ).toEqual(true);
    });

    test('testStatus is true & is an assessment test and persisted tab does not match tabState', () => {
        visualizationConfigurationMock
            .setup(config => config.getTestStatus(scanDataStub, stepStub))
            .returns(() => true);
        visualizationConfigurationMock
            .setup(config => config.testMode)
            .returns(() => TestMode.Assessments);

        assessmentState = {
            persistedTabInfo: {
                id: 1,
            },
        } as AssessmentStoreData;

        tabState = {
            id: 2,
        } as TabStoreData;

        expect(
            testSubject(
                visualizationConfigurationMock.object,
                stepStub,
                visualizationState,
                assessmentState,
                tabState,
            ),
        ).toEqual(false);
    });

    test('testStatus is true & is an assessment test and persisted tab does match tabState', () => {
        visualizationConfigurationMock
            .setup(config => config.getTestStatus(scanDataStub, stepStub))
            .returns(() => true);
        visualizationConfigurationMock
            .setup(config => config.testMode)
            .returns(() => TestMode.Assessments);

        assessmentState = {
            persistedTabInfo: {
                id: 1,
            },
        } as AssessmentStoreData;

        tabState = {
            id: 1,
        } as TabStoreData;

        expect(
            testSubject(
                visualizationConfigurationMock.object,
                stepStub,
                visualizationState,
                assessmentState,
                tabState,
            ),
        ).toEqual(true);
    });
});
