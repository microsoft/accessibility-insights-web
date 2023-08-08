// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { AssessmentActionMessageCreator } from 'DetailsView/actions/assessment-action-message-creator';
import { GetOverviewSummaryDataProps } from 'DetailsView/components/overview-content/get-overview-summary-data';
import { shallow } from 'enzyme';
import * as React from 'react';
import { OverviewSummaryReportModel } from 'reports/assessment-report-model';
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

    const detailsViewActionMessageCreator = {} as DetailsViewActionMessageCreator;
    const assessmentActionMessageCreator = {} as AssessmentActionMessageCreator;
    const assessmentsProviderWithFeaturesEnabledMock = jest.fn();
    const assessmentsProviderForRequirementsMock = jest.fn();
    const getSummaryDataMock = Mock.ofInstance(props => null, MockBehavior.Strict);
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
        assessmentsProviderWithFeaturesEnabled: assessmentsProviderWithFeaturesEnabledMock,
        assessmentsProviderForRequirements: assessmentsProviderForRequirementsMock,
        detailsViewId: undefined,
        quickAssessRequirementKeys: quickAssessRequirementKeysStub,
    };

    const featureFlagDataStub = {};

    const assessmentStoreData: AssessmentStoreData = {
        persistedTabInfo: {} as PersistedTabInfo,
    } as AssessmentStoreData;

    const summaryData = {} as OverviewSummaryReportModel;
    const summaryDataProps = {
        deps,
        assessmentStoreData,
        featureFlagStoreData: featureFlagDataStub,
    } as GetOverviewSummaryDataProps;

    getSummaryDataMock.setup(mock => mock(summaryDataProps)).returns(() => summaryData);

    let component: JSX.Element;

    it('component is defined and matches snapshot', () => {
        component = (
            <OverviewContainer
                deps={deps}
                assessmentStoreData={assessmentStoreData}
                featureFlagStoreData={featureFlagDataStub}
                tabStoreData={tabStoreDataStub}
                getSummaryData={getSummaryDataMock.object}
            />
        );
        const wrapper = shallow(component);
        expect(component).toBeDefined();
        expect(wrapper.getElement()).toMatchSnapshot();
        getSummaryDataMock.verifyAll();
    });
});
