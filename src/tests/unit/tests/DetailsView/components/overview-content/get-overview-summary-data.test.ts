// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import {
    AssessmentStoreData,
    PersistedTabInfo,
} from 'common/types/store-data/assessment-result-data';
import { DetailsViewPivotType } from 'common/types/store-data/details-view-pivot-type';
import {
    GetOverviewSummaryDataDeps,
    getOverviewSummaryDataForPivot,
} from 'DetailsView/components/overview-content/get-overview-summary-data';
import { OverviewSummaryReportModel } from 'reports/assessment-report-model';
import { Mock, MockBehavior, Times } from 'typemoq';

describe('getOverviewSummaryDataForPivot', () => {
    const assessmentsProvider: AssessmentsProvider = {} as AssessmentsProvider;

    const filteredFlagProvider = {} as AssessmentsProvider;
    const filteredRequirementsProvider = {} as AssessmentsProvider;
    const assessmentsProviderWithFeaturesEnabledMock = Mock.ofInstance(
        (provider, featureFlagData) => null,
        MockBehavior.Strict,
    );
    const assessmentsProviderForRequirementsMock = Mock.ofInstance(
        (provider, requirementKeys) => null,
        MockBehavior.Strict,
    );
    const getAssessmentSummaryModelFromProviderAndStoreDataMock = Mock.ofInstance(
        (deps, assessmentStoreData) => null,
        MockBehavior.Strict,
    );
    const getQuickAssessSummaryModelFromProviderAndStoreDataMock = Mock.ofInstance(
        (deps, assessmentStoreData, requirementKeys) => null,
        MockBehavior.Strict,
    );
    const quickAssessRequirementKeysStub = [];
    const deps: GetOverviewSummaryDataDeps = {
        assessmentsProvider: assessmentsProvider,
        getAssessmentSummaryModelFromProviderAndStoreData:
            getAssessmentSummaryModelFromProviderAndStoreDataMock.object,
        getQuickAssessSummaryModelFromProviderAndStoreData:
            getQuickAssessSummaryModelFromProviderAndStoreDataMock.object,
        assessmentsProviderWithFeaturesEnabled: assessmentsProviderWithFeaturesEnabledMock.object,
        assessmentsProviderForRequirements: assessmentsProviderForRequirementsMock.object,
        quickAssessRequirementKeys: quickAssessRequirementKeysStub,
    };

    const featureFlagDataStub = {};

    const assessmentStoreData: AssessmentStoreData = {
        persistedTabInfo: {} as PersistedTabInfo,
    } as AssessmentStoreData;

    const summaryData = {} as OverviewSummaryReportModel;

    beforeEach(() => {
        assessmentsProviderWithFeaturesEnabledMock.reset();
        assessmentsProviderForRequirementsMock.reset();
        getAssessmentSummaryModelFromProviderAndStoreDataMock.reset();
        getQuickAssessSummaryModelFromProviderAndStoreDataMock.reset();
    });
    it.each([DetailsViewPivotType.assessment, DetailsViewPivotType.mediumPass])(
        'calls the correct functions for pivotType=%s',
        pivotType => {
            assessmentsProviderWithFeaturesEnabledMock
                .setup(ap => ap(assessmentsProvider, featureFlagDataStub))
                .returns(() => filteredFlagProvider)
                .verifiable(Times.once());
            getAssessmentSummaryModelFromProviderAndStoreDataMock
                .setup(mock => mock(filteredFlagProvider, assessmentStoreData))
                .returns(() => summaryData)
                .verifiable(
                    pivotType === DetailsViewPivotType.assessment ? Times.once() : Times.never(),
                );
            assessmentsProviderForRequirementsMock
                .setup(ap => ap(filteredFlagProvider, quickAssessRequirementKeysStub))
                .returns(() => filteredRequirementsProvider)
                .verifiable(
                    pivotType === DetailsViewPivotType.assessment ? Times.never() : Times.once(),
                );
            getQuickAssessSummaryModelFromProviderAndStoreDataMock
                .setup(mock =>
                    mock(
                        filteredRequirementsProvider,
                        assessmentStoreData,
                        quickAssessRequirementKeysStub,
                    ),
                )
                .returns(() => summaryData)
                .verifiable(
                    pivotType === DetailsViewPivotType.assessment ? Times.never() : Times.once(),
                );
            getOverviewSummaryDataForPivot(pivotType)({
                deps,
                assessmentStoreData,
                featureFlagStoreData: featureFlagDataStub,
            });
            assessmentsProviderWithFeaturesEnabledMock.verifyAll();
            assessmentsProviderForRequirementsMock.verifyAll();
            getAssessmentSummaryModelFromProviderAndStoreDataMock.verifyAll();
            getQuickAssessSummaryModelFromProviderAndStoreDataMock.verifyAll();
        },
    );
});
