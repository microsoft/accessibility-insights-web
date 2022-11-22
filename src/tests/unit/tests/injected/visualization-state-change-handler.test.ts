// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Requirement } from 'assessments/types/requirement';
import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';
import { TargetPageStoreData } from 'injected/client-store-listener';
import { UpdateVisualization } from 'injected/target-page-visualization-updater';
import { VisualizationStateChangeHandler } from 'injected/visualization-state-change-handler';
import { IMock, It, Mock, Times } from 'typemoq';

describe('VisualizationStateChangeHandler', () => {
    let configFactoryMock: IMock<VisualizationConfigurationFactory>;
    let visualizationUpdaterMock: IMock<UpdateVisualization>;
    let storeDataStub: TargetPageStoreData;
    let testSubject: VisualizationStateChangeHandler;

    beforeEach(() => {
        visualizationUpdaterMock = Mock.ofType<UpdateVisualization>();
        configFactoryMock = Mock.ofType<VisualizationConfigurationFactory>();
        storeDataStub = { assessmentStoreData: {} } as TargetPageStoreData;
        testSubject = new VisualizationStateChangeHandler(
            visualizationUpdaterMock.object,
            configFactoryMock.object,
        );
    });

    test('visualization is updated, with requirement passed', async () => {
        const requirementConfigStub = {
            key: 'some requirement',
        } as Requirement;
        configFactoryMock
            .setup(m => m.forEachConfig(It.isAny()))
            .callback(async givenCallback => {
                givenCallback(null, -1, requirementConfigStub);
            });

        await testSubject.updateVisualizationsWithStoreData(storeDataStub);

        visualizationUpdaterMock.verify(
            m => m(-1, requirementConfigStub.key, storeDataStub),
            Times.once(),
        );
    });

    test('visualization is updated, without requirement passed', async () => {
        configFactoryMock
            .setup(m => m.forEachConfig(It.isAny()))
            .callback(async givenCallback => {
                givenCallback(null, -1);
            });

        await testSubject.updateVisualizationsWithStoreData(storeDataStub);

        visualizationUpdaterMock.verify(m => m(-1, undefined, storeDataStub), Times.once());
    });

    test('no assessment store data', async () => {
        await testSubject.updateVisualizationsWithStoreData({} as TargetPageStoreData);

        visualizationUpdaterMock.verify(m => m(It.isAny(), It.isAny(), It.isAny()), Times.never());
    });
});
