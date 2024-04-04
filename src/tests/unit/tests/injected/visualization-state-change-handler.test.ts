// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Requirement } from 'assessments/types/requirement';
import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';
import { AssessmentCardSelectionStoreData } from 'common/types/store-data/assessment-card-selection-store-data';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { DetailsViewPivotType } from 'common/types/store-data/details-view-pivot-type';
import {
    DetailsViewSwitcherNavConfiguration,
    GetDetailsSwitcherNavConfiguration,
} from 'DetailsView/components/details-view-switcher-nav';
import { GetSelectedAssessmentCardSelectionStoreData } from 'DetailsView/components/left-nav/get-selected-assessment-card-selection-store-data';
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
    let assessmentCardSelectionStoreDataStub: AssessmentCardSelectionStoreData;

    beforeEach(() => {
        visualizationUpdaterMock = Mock.ofType<UpdateVisualization>();
        configFactoryMock = Mock.ofType<VisualizationConfigurationFactory>();
        storeDataStub = {
            assessmentStoreData: { assessmentNavState: { selectedTestSubview: 'sub-view-1' } },
            quickAssessStoreData: { assessmentNavState: { selectedTestSubview: 'sub-view-2' } },
            assessmentCardSelectionStoreData: {},
            quickAssessCardSelectionStoreData: {},
            visualizationStoreData: { selectedDetailsViewPivot: DetailsViewPivotType.fastPass },
        } as TargetPageStoreData;
        assessmentStoreDataStub = {
            assessmentNavState: { selectedTestSubview: 'some test sub view' },
        } as AssessmentStoreData;
        assessmentCardSelectionStoreDataStub = {} as AssessmentCardSelectionStoreData;
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

        setupSwitcherNavConfiguration(
            storeDataStub,
            assessmentStoreDataStub,
            assessmentCardSelectionStoreDataStub,
        );
        await testSubject.updateVisualizationsWithStoreData(storeDataStub);

        const expectedStoreData = {
            ...storeDataStub,
            assessmentStoreData: assessmentStoreDataStub,
        } as TargetPageStoreData;

        const type1: number = -1;
        visualizationUpdaterMock.verify(
            m => m(type1, requirementConfigStub.key, It.isValue(expectedStoreData)),
            Times.once(),
        );
    });

    test('visualization is updated, without requirement passed', async () => {
        configFactoryMock
            .setup(m => m.forEachConfig(It.isAny()))
            .callback(async givenCallback => {
                givenCallback(null, -1);
            });

        setupSwitcherNavConfiguration(
            storeDataStub,
            assessmentStoreDataStub,
            assessmentCardSelectionStoreDataStub,
        );
        await testSubject.updateVisualizationsWithStoreData(storeDataStub);

        const expectedStoreData = {
            ...storeDataStub,
            assessmentStoreData: assessmentStoreDataStub,
        } as TargetPageStoreData;

        const type2: number = -1;
        visualizationUpdaterMock.verify(
            m => m(type2, undefined, It.isValue(expectedStoreData)),
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
        returnedAssessmentCardSelectionData: AssessmentCardSelectionStoreData,
    ): void {
        const getSelectedAssessmentStoreDataMock = Mock.ofType<GetSelectedAssessmentStoreData>();
        const getSelectedAssessmentCardSelectionStoreDataMock =
            Mock.ofType<GetSelectedAssessmentCardSelectionStoreData>();
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
                    getSelectedAssessmentCardSelectionStoreData:
                        getSelectedAssessmentCardSelectionStoreDataMock.object,
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

        getSelectedAssessmentCardSelectionStoreDataMock
            .setup(m =>
                m(
                    It.isObjectWith({
                        quickAssessCardSelectionStoreData:
                            storeData.quickAssessCardSelectionStoreData,
                        assessmentCardSelectionStoreData:
                            storeData.assessmentCardSelectionStoreData,
                    }),
                ),
            )
            .returns(() => returnedAssessmentCardSelectionData);
    }
});
