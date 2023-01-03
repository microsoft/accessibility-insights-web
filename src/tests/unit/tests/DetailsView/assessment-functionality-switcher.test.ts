// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { DetailsViewPivotType } from 'common/types/store-data/details-view-pivot-type';
import { VisualizationStoreData } from 'common/types/store-data/visualization-store-data';
import { AssessmentActionMessageCreator } from 'DetailsView/actions/assessment-action-message-creator';
import {
    AssessmentFunctionalitySwitcher,
    NO_STORE_DATA_ERROR,
    SharedAssessmentObjects,
} from 'DetailsView/assessment-functionality-switcher';
import {
    DetailsViewSwitcherNavConfiguration,
    GetDetailsSwitcherNavConfiguration,
} from 'DetailsView/components/details-view-switcher-nav';
import {
    GetSelectedAssessmentSummaryModelFromProviderAndStatusData,
    GetSelectedAssessmentSummaryModelFromProviderAndStoreData,
} from 'DetailsView/components/left-nav/get-selected-assessment-summary-model';
import { NavLinkHandler } from 'DetailsView/components/left-nav/nav-link-handler';
import { AssessmentInstanceTableHandler } from 'DetailsView/handlers/assessment-instance-table-handler';
import { StoreMock } from 'tests/unit/mock-helpers/store-mock';
import { IMock, It, Mock } from 'typemoq';

describe(AssessmentFunctionalitySwitcher, () => {
    let visualizationStoreMock: StoreMock<VisualizationStoreData>;
    let getSwitcherNavConfigMock: IMock<GetDetailsSwitcherNavConfiguration>;
    let assessmentObjectsStub: SharedAssessmentObjects;
    let quickAssessObjectsMock: SharedAssessmentObjects;
    let testSubject: AssessmentFunctionalitySwitcher;

    beforeEach(() => {
        visualizationStoreMock = new StoreMock<VisualizationStoreData>();
        getSwitcherNavConfigMock = Mock.ofType<GetDetailsSwitcherNavConfiguration>();
        assessmentObjectsStub = {} as SharedAssessmentObjects;
        quickAssessObjectsMock = {} as SharedAssessmentObjects;
        testSubject = new AssessmentFunctionalitySwitcher(
            visualizationStoreMock.getObject(),
            assessmentObjectsStub,
            quickAssessObjectsMock,
            getSwitcherNavConfigMock.object,
        );
    });

    test('getAssessmentObjects', () => {
        expect(testSubject.getAssessmentObjects()).toEqual(assessmentObjectsStub);
    });

    test('getQuickAssessObjects', () => {
        expect(testSubject.getQuickAssessObjects()).toEqual(quickAssessObjectsMock);
    });

    const nullStoreData = null;
    const validStoreData = {
        selectedDetailsViewPivot: DetailsViewPivotType.fastPass,
    } as VisualizationStoreData;

    [nullStoreData, validStoreData].forEach(testCase => {});

    describe('error: no store data', () => {
        let storeData: VisualizationStoreData;

        beforeEach(() => {
            storeData = null;
            setupGetState(storeData);
        });

        test('getProvider', () => {
            expect(() => testSubject.getProvider()).toThrowError(NO_STORE_DATA_ERROR);
        });

        test('getAssessmentActionMessageCreator', () => {
            expect(() => testSubject.getAssessmentActionMessageCreator()).toThrowError(
                NO_STORE_DATA_ERROR,
            );
        });

        test('getNavLinkHandler', () => {
            expect(() => testSubject.getNavLinkHandler()).toThrowError(NO_STORE_DATA_ERROR);
        });

        test('getInstanceTableHandler', () => {
            expect(() => testSubject.getInstanceTableHandler());
        });

        test('getGetAssessmentSummaryModelFromProviderAndStatusData', () => {
            expect(() =>
                testSubject.getGetAssessmentSummaryModelFromProviderAndStatusData(),
            ).toThrowError(NO_STORE_DATA_ERROR);
        });

        test('getGetAssessmentSummaryModelFromProviderAndStoreData', () => {
            expect(() =>
                testSubject.getGetAssessmentSummaryModelFromProviderAndStoreData(),
            ).toThrowError(NO_STORE_DATA_ERROR);
        });
    });

    describe('store has data; return specified object', () => {
        let storeData: VisualizationStoreData;

        beforeEach(() => {
            storeData = {
                selectedDetailsViewPivot: DetailsViewPivotType.fastPass,
            } as VisualizationStoreData;
            assessmentObjectsStub = {
                provider: Mock.ofType<AssessmentsProvider>().object,
                actionMessageCreator: Mock.ofType<AssessmentActionMessageCreator>().object,
                navLinkHandler: Mock.ofType<NavLinkHandler>().object,
                instanceTableHandler: Mock.ofType<AssessmentInstanceTableHandler>().object,
                getAssessmentSummaryModelFromProviderAndStatusData:
                    Mock.ofType<GetSelectedAssessmentSummaryModelFromProviderAndStatusData>()
                        .object,
                getAssessmentSummaryModelFromProviderAndStoreData:
                    Mock.ofType<GetSelectedAssessmentSummaryModelFromProviderAndStoreData>().object,
            };
            setupSwitcherMock(storeData.selectedDetailsViewPivot);
            setupGetState(storeData);
        });

        test('getProvider', () => {
            expect(testSubject.getProvider()).toEqual(assessmentObjectsStub.provider);
        });

        test('getAssessmentActionMessageCreator', () => {
            expect(testSubject.getAssessmentActionMessageCreator()).toEqual(
                assessmentObjectsStub.actionMessageCreator,
            );
        });

        test('getNavLinkHandler', () => {
            expect(testSubject.getNavLinkHandler()).toEqual(assessmentObjectsStub.navLinkHandler);
        });

        test('getInstanceTableHandler', () => {
            expect(testSubject.getInstanceTableHandler()).toEqual(
                assessmentObjectsStub.instanceTableHandler,
            );
        });

        test('getGetAssessmentSummaryModelFromProviderAndStatusData', () => {
            expect(testSubject.getGetAssessmentSummaryModelFromProviderAndStatusData()).toEqual(
                assessmentObjectsStub.getAssessmentSummaryModelFromProviderAndStatusData,
            );
        });

        test('getGetAssessmentSummaryModelFromProviderAndStoreData', () => {
            expect(testSubject.getGetAssessmentSummaryModelFromProviderAndStoreData()).toEqual(
                assessmentObjectsStub.getAssessmentSummaryModelFromProviderAndStoreData,
            );
        });
    });

    function setupGetState(storeData: VisualizationStoreData) {
        visualizationStoreMock.setupGetState(storeData);
    }

    function setupSwitcherMock(pivot: DetailsViewPivotType) {
        const switcherConfigMock = Mock.ofType<DetailsViewSwitcherNavConfiguration>();
        getSwitcherNavConfigMock
            .setup(m => m(It.isValue({ selectedDetailsViewPivot: pivot })))
            .returns(() => switcherConfigMock.object);
        switcherConfigMock
            .setup(m => m.getSharedAssessmentFunctionalityObjects(testSubject))
            .returns(() => assessmentObjectsStub);
    }
});
