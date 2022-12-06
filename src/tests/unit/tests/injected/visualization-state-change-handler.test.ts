// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Requirement } from 'assessments/types/requirement';
import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { DetailsViewPivotType } from 'common/types/store-data/details-view-pivot-type';
import {
    DetailsViewSwitcherNavConfiguration,
    GetDetailsSwitcherNavConfiguration,
} from 'DetailsView/components/details-view-switcher-nav';
import { GetSelectedAssessmentStoreData } from 'DetailsView/components/left-nav/get-selected-assessment-store-data';
import { TargetPageStoreData } from 'injected/client-store-listener';
import { UpdateVisualization } from 'injected/target-page-visualization-updater';
import { VisualizationStateChangeHandler } from 'injected/visualization-state-change-handler';
import { IMock, It, Mock, Times } from 'typemoq';

describe('VisualizationStateChangeHandler', () => {
    let configFactoryMock: IMock<VisualizationConfigurationFactory>;
    let visualizationUpdaterMock: IMock<UpdateVisualization>;
    let storeDataStub: TargetPageStoreData;
    let testSubject: VisualizationStateChangeHandler;
    let getDetailsSwitcherNavConfigurationMock: IMock<GetDetailsSwitcherNavConfiguration>;
    let assessmentStoreDataStub: AssessmentStoreData;

    beforeEach(() => {
        visualizationUpdaterMock = Mock.ofType<UpdateVisualization>();
        configFactoryMock = Mock.ofType<VisualizationConfigurationFactory>();
        storeDataStub = {
            assessmentStoreData: { assessmentNavState: { selectedTestSubview: 'sub-view-1' } },
            quickAssessStoreData: { assessmentNavState: { selectedTestSubview: 'sub-view-2' } },
            visualizationStoreData: { selectedDetailsViewPivot: DetailsViewPivotType.fastPass },
        } as TargetPageStoreData;
        assessmentStoreDataStub = {
            assessmentNavState: { selectedTestSubview: 'some test sub view' },
        } as AssessmentStoreData;
        getDetailsSwitcherNavConfigurationMock = Mock.ofType<GetDetailsSwitcherNavConfiguration>();
        testSubject = new VisualizationStateChangeHandler(
            visualizationUpdaterMock.object,
            configFactoryMock.object,
            getDetailsSwitcherNavConfigurationMock.object,
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

        setupSwitcherNavConfiguration(storeDataStub, assessmentStoreDataStub);
        await testSubject.updateVisualizationsWithStoreData(storeDataStub);

        const expectedStoreData = {
            ...storeDataStub,
            assessmentStoreData: assessmentStoreDataStub,
        } as TargetPageStoreData;

        visualizationUpdaterMock.verify(
            m => m(-1, requirementConfigStub.key, It.isValue(expectedStoreData)),
            Times.once(),
        );
    });

    test('visualization is updated, without requirement passed', async () => {
        configFactoryMock
            .setup(m => m.forEachConfig(It.isAny()))
            .callback(async givenCallback => {
                givenCallback(null, -1);
            });

        setupSwitcherNavConfiguration(storeDataStub, assessmentStoreDataStub);
        await testSubject.updateVisualizationsWithStoreData(storeDataStub);

        const expectedStoreData = {
            ...storeDataStub,
            assessmentStoreData: assessmentStoreDataStub,
        } as TargetPageStoreData;

        visualizationUpdaterMock.verify(
            m => m(-1, undefined, It.isValue(expectedStoreData)),
            Times.once(),
        );
    });

    test('no assessment store data', async () => {
        await testSubject.updateVisualizationsWithStoreData({} as TargetPageStoreData);

        visualizationUpdaterMock.verify(m => m(It.isAny(), It.isAny(), It.isAny()), Times.never());
    });

    function setupSwitcherNavConfiguration(
        storeData: TargetPageStoreData,
        returnedAssessmentData: AssessmentStoreData,
    ): void {
        const getSelectedAssessmentStoreDataMock = Mock.ofType<GetSelectedAssessmentStoreData>();
        getDetailsSwitcherNavConfigurationMock
            .setup(m =>
                m(
                    It.isValue({
                        selectedDetailsViewPivot:
                            storeData.visualizationStoreData.selectedDetailsViewPivot,
                    }),
                ),
            )
            .returns(() => {
                return {
                    getSelectedAssessmentStoreData: getSelectedAssessmentStoreDataMock.object,
                } as DetailsViewSwitcherNavConfiguration;
            });

        getSelectedAssessmentStoreDataMock
            .setup(m =>
                m(
                    It.isObjectWith({
                        quickAssessStoreData: storeData.quickAssessStoreData,
                        assessmentStoreData: storeData.assessmentStoreData,
                    }),
                ),
            )
            .returns(() => returnedAssessmentData);
    }
});
