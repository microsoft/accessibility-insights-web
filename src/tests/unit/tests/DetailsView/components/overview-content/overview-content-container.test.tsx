// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { AssessmentActionMessageCreator } from 'DetailsView/actions/assessment-action-message-creator';
import { DetailsViewPivotType } from 'common/types/store-data/details-view-pivot-type';
import { shallow } from 'enzyme';
import * as React from 'react';
import { Mock, MockBehavior } from 'typemoq';

import {
    AssessmentStoreData,
    PersistedTabInfo,
} from '../../../../../../common/types/store-data/assessment-result-data';
import { TabStoreData } from '../../../../../../common/types/store-data/tab-store-data';
import { UrlParser } from '../../../../../../common/url-parser';
import { DetailsViewActionMessageCreator } from '../../../../../../DetailsView/actions/details-view-action-message-creator';
import {
    OverviewContainer,
    OverviewContainerDeps,
} from '../../../../../../DetailsView/components/overview-content/overview-content-container';
import { OverviewHelpSectionDeps } from '../../../../../../DetailsView/components/overview-content/overview-help-section';

describe('OverviewContainer', () => {
    const urlParserMock = {} as UrlParser;

    const openExternalLink = jest.fn();

    const tabStoreDataStub: TabStoreData = {
        url: 'some url',
        title: 'some title',
        id: -1,
    } as TabStoreData;

    const overviewHelpSectionDeps = {
        actionInitiators: {
            openExternalLink,
        },
    } as OverviewHelpSectionDeps;

    const assessmentsProvider: AssessmentsProvider = {
        all: () => [],
    } as any;

    const filteredProvider = {} as AssessmentsProvider;
    const detailsViewActionMessageCreator = {} as DetailsViewActionMessageCreator;
    const assessmentActionMessageCreator = {} as AssessmentActionMessageCreator;
    const assessmentsProviderWithFeaturesEnabledMock = Mock.ofInstance(
        (provider, featureFlagData) => null,
        MockBehavior.Strict,
    );
    const assessmentsProviderForRequirementsMock = Mock.ofInstance(
        (provider, requirements) => null,
        MockBehavior.Strict,
    );
    const getAssessmentSummaryModelFromProviderAndStoreData = jest.fn();
    const getQuickAssessSummaryModelFromProviderAndStoreData = jest.fn();
    const quickAssessRequirementKeysStub = [];
    const deps: OverviewContainerDeps = {
        assessmentsProvider: assessmentsProvider,
        actionInitiators: overviewHelpSectionDeps.actionInitiators,
        getAssessmentSummaryModelFromProviderAndStoreData:
            getAssessmentSummaryModelFromProviderAndStoreData,
        assessmentActionMessageCreator,
        getQuickAssessSummaryModelFromProviderAndStoreData:
            getQuickAssessSummaryModelFromProviderAndStoreData,
        detailsViewActionMessageCreator,
        urlParser: urlParserMock,
        assessmentsProviderWithFeaturesEnabled: assessmentsProviderWithFeaturesEnabledMock.object,
        assessmentsProviderForRequirements: assessmentsProviderForRequirementsMock.object,
        detailsViewId: undefined,
        quickAssessRequirementKeys: quickAssessRequirementKeysStub,
    };

    const featureFlagDataStub = {};

    const assessmentStoreData: AssessmentStoreData = {
        persistedTabInfo: {} as PersistedTabInfo,
    } as AssessmentStoreData;

    assessmentsProviderWithFeaturesEnabledMock
        .setup(mock => mock(assessmentsProvider, featureFlagDataStub))
        .returns(() => filteredProvider);

    assessmentsProviderForRequirementsMock
        .setup(mock => mock(filteredProvider, quickAssessRequirementKeysStub))
        .returns(() => filteredProvider);

    let component: JSX.Element;

    it.each([DetailsViewPivotType.assessment, DetailsViewPivotType.mediumPass])(
        'component is defined and matches snapshot for pivotType %s',
        selectedPivot => {
            component = (
                <OverviewContainer
                    deps={deps}
                    assessmentStoreData={assessmentStoreData}
                    featureFlagStoreData={featureFlagDataStub}
                    tabStoreData={tabStoreDataStub}
                    selectedPivot={selectedPivot}
                />
            );
            const wrapper = shallow(component);
            expect(component).toBeDefined();
            expect(wrapper.getElement()).toMatchSnapshot();
        },
    );
});
