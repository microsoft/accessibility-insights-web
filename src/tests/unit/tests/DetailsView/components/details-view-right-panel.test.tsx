// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { OverviewSummaryReportModel } from 'reports/assessment-report-model';
import { Mock, MockBehavior, Times } from 'typemoq';
import { DetailsViewPivotType } from '../../../../../common/types/store-data/details-view-pivot-type';
import {
    DetailsRightPanelConfiguration,
    GetDetailsRightPanelConfiguration,
} from '../../../../../DetailsView/components/details-view-right-panel';
import {
    getOverviewKey,
    getTestViewKey,
} from '../../../../../DetailsView/components/left-nav/get-left-nav-selected-key';
import { OverviewContainer } from '../../../../../DetailsView/components/overview-content/overview-content-container';
import { TestViewContainer } from '../../../../../DetailsView/components/test-view-container';
import {
    getOverviewTitle,
    getTestViewTitle,
} from '../../../../../DetailsView/handlers/get-document-title';

describe('DetailsViewRightPanelTests', () => {
    describe('GetDetailsRightPanelConfiguration', () => {
        it.each([
            DetailsViewPivotType.assessment,
            DetailsViewPivotType.mediumPass,
            DetailsViewPivotType.fastPass,
        ])(
            'GetDetailsRightPanelConfiguration for pivotType %s correctly returns Overview object',
            pivotType => {
                const testSubject = GetDetailsRightPanelConfiguration({
                    selectedDetailsViewPivot: pivotType,
                    detailsViewRightContentPanel: 'Overview',
                });
                if (pivotType === DetailsViewPivotType.fastPass) {
                    validateTestView(testSubject);
                } else {
                    validateOverview(testSubject);
                }
            },
        );

        it.each([DetailsViewPivotType.assessment, DetailsViewPivotType.mediumPass])(
            'GetDetailsRightPanelConfiguration.OverviewSummaryProps.getFilteredProvider for pivotType %s calls the correct deps functions with correct props',
            pivotType => {
                const testSubject = GetDetailsRightPanelConfiguration({
                    selectedDetailsViewPivot: pivotType,
                    detailsViewRightContentPanel: 'Overview',
                });

                validateGetFilteredProviderForPivot(pivotType, testSubject);
            },
        );

        it.each([DetailsViewPivotType.assessment, DetailsViewPivotType.mediumPass])(
            'GetDetailsRightPanelConfiguration.OverviewSummaryProps.getSummaryModelFromProviderAndStoreData for pivotType %s calls the correct deps functions with correct props',
            pivotType => {
                const testSubject = GetDetailsRightPanelConfiguration({
                    selectedDetailsViewPivot: pivotType,
                    detailsViewRightContentPanel: 'Overview',
                });

                validateGetSummaryModelFromStoreDataForPivot(pivotType, testSubject);
            },
        );
        it.each([
            DetailsViewPivotType.assessment,
            DetailsViewPivotType.mediumPass,
            DetailsViewPivotType.fastPass,
        ])(
            'GetDetailsRightPanelConfiguration for pivotType %s correctly returns TestView object',
            pivotType => {
                const testSubject = GetDetailsRightPanelConfiguration({
                    selectedDetailsViewPivot: pivotType,
                    detailsViewRightContentPanel: 'TestView',
                });

                validateTestView(testSubject);
            },
        );
        it('GetDetailsRightPanelConfiguration: return TestView object when fast pass is selected', () => {
            const testSubject = GetDetailsRightPanelConfiguration({
                selectedDetailsViewPivot: DetailsViewPivotType.fastPass,
                detailsViewRightContentPanel: 'Overview',
            });

            validateTestView(testSubject);
        });

        it('GetDetailsRightPanelConfiguration: return TestView object when assessment selected', () => {
            const testSubject = GetDetailsRightPanelConfiguration({
                selectedDetailsViewPivot: DetailsViewPivotType.assessment,
                detailsViewRightContentPanel: 'TestView',
            });

            validateTestView(testSubject);
        });

        it('GetDetailsRightPanelConfiguration: return TestView object when assessment selected', () => {
            const testSubject = GetDetailsRightPanelConfiguration({
                selectedDetailsViewPivot: DetailsViewPivotType.assessment,
                detailsViewRightContentPanel: 'Overview',
            });

            validateOverview(testSubject);
        });
    });

    function validateTestView(configuration: DetailsRightPanelConfiguration): void {
        expect(configuration.GetLeftNavSelectedKey).toEqual(getTestViewKey);
        expect(configuration.GetTitle).toEqual(getTestViewTitle);
        expect(configuration.RightPanel).toEqual(TestViewContainer);
        expect(configuration.GetStartOverContextualMenuItemKeys()).toEqual(['assessment', 'test']);
    }

    function validateOverview(configuration: DetailsRightPanelConfiguration): void {
        expect(configuration.GetLeftNavSelectedKey).toEqual(getOverviewKey);
        expect(configuration.GetTitle).toEqual(getOverviewTitle);
        expect(configuration.RightPanel).toEqual(OverviewContainer);
        expect(configuration.GetStartOverContextualMenuItemKeys()).toEqual(['assessment']);
    }

    function validateGetFilteredProviderForPivot(
        pivotType: DetailsViewPivotType,
        configuration: DetailsRightPanelConfiguration,
    ): void {
        const assessmentsProviderWithFeaturesEnabledMock = Mock.ofInstance(
            (provider, featureFlagData) => null,
            MockBehavior.Strict,
        );
        const assessmentsProviderForRequirementsMock = Mock.ofInstance(
            (provider, requirements) => null,
            MockBehavior.Strict,
        );
        const featureFlagStoreDataStub = {};
        const assessmentsProviderStub = {} as AssessmentsProvider;
        const filteredProvider = {} as AssessmentsProvider;
        const quickAssessRequirementKeysStub = [];
        assessmentsProviderWithFeaturesEnabledMock
            .setup(mock => mock(assessmentsProviderStub, featureFlagStoreDataStub))
            .returns(() => filteredProvider)
            .verifiable(Times.exactly(1));
        assessmentsProviderForRequirementsMock
            .setup(mock => mock(filteredProvider, quickAssessRequirementKeysStub))
            .returns(() => filteredProvider)
            .verifiable(
                pivotType === DetailsViewPivotType.assessment ? Times.never() : Times.once(),
            );
        configuration.OverviewSummaryDataProps.getFilteredProvider({
            deps: {
                assessmentsProvider: assessmentsProviderStub,
                assessmentsProviderForRequirements: assessmentsProviderForRequirementsMock.object,
                assessmentsProviderWithFeaturesEnabled:
                    assessmentsProviderWithFeaturesEnabledMock.object,
                quickAssessRequirementKeys: quickAssessRequirementKeysStub,
            },
            featureFlagStoreData: featureFlagStoreDataStub,
        });
        assessmentsProviderForRequirementsMock.verifyAll();
        assessmentsProviderWithFeaturesEnabledMock.verifyAll();
    }

    function validateGetSummaryModelFromStoreDataForPivot(
        pivotType: DetailsViewPivotType,
        configuration: DetailsRightPanelConfiguration,
    ): void {
        const getAssessmentSummaryModelFromProviderAndStoreDataMock = Mock.ofInstance(
            (provider, storeData) => null,
            MockBehavior.Strict,
        );
        const getQuickAssessSummaryModelFromProviderAndStoreDataMock = Mock.ofInstance(
            (provider, storeData, requirementKeys) => null,
            MockBehavior.Strict,
        );
        const assessmentStoreDataStub = {} as AssessmentStoreData;
        const assessmentsProviderStub = {} as AssessmentsProvider;
        const quickAssessRequirementKeysStub: string[] = [];
        const resultDataStub = {} as OverviewSummaryReportModel;
        getAssessmentSummaryModelFromProviderAndStoreDataMock
            .setup(mock => mock(assessmentsProviderStub, assessmentStoreDataStub))
            .returns(() => resultDataStub)
            .verifiable(
                pivotType === DetailsViewPivotType.assessment ? Times.once() : Times.never(),
            );
        getQuickAssessSummaryModelFromProviderAndStoreDataMock
            .setup(mock =>
                mock(
                    assessmentsProviderStub,
                    assessmentStoreDataStub,
                    quickAssessRequirementKeysStub,
                ),
            )
            .returns(() => resultDataStub)
            .verifiable(
                pivotType === DetailsViewPivotType.assessment ? Times.never() : Times.once(),
            );
        configuration.OverviewSummaryDataProps.getSummaryModelFromProviderAndStoreData({
            deps: {
                assessmentsProvider: assessmentsProviderStub,
                getQuickAssessSummaryModelFromProviderAndStoreData:
                    getQuickAssessSummaryModelFromProviderAndStoreDataMock.object,
                getAssessmentSummaryModelFromProviderAndStoreData:
                    getAssessmentSummaryModelFromProviderAndStoreDataMock.object,
                quickAssessRequirementKeys: quickAssessRequirementKeysStub,
            },
            assessmentStoreData: assessmentStoreDataStub,
        });
        getQuickAssessSummaryModelFromProviderAndStoreDataMock.verifyAll();
        getAssessmentSummaryModelFromProviderAndStoreDataMock.verifyAll();
    }
});
