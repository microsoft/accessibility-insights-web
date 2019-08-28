// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { shallow } from 'enzyme';
import * as React from 'react';

import { AssessmentStoreData, PersistedTabInfo } from '../../../../../../common/types/store-data/assessment-result-data';
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

    const detailsViewActionMessageCreatorStub = {} as DetailsViewActionMessageCreator;
    const getAssessmentSummaryModelFromProviderAndStoreData = jest.fn();

    const deps: OverviewContainerDeps = {
        assessmentsProvider: assessmentsProvider,
        actionInitiators: overviewHelpSectionDeps.actionInitiators,
        getAssessmentSummaryModelFromProviderAndStoreData: getAssessmentSummaryModelFromProviderAndStoreData,
        detailsViewActionMessageCreator: detailsViewActionMessageCreatorStub,
        urlParser: urlParserMock,
    };

    const assessmentStoreData: AssessmentStoreData = {
        persistedTabInfo: {} as PersistedTabInfo,
    } as AssessmentStoreData;

    const component = <OverviewContainer deps={deps} assessmentStoreData={assessmentStoreData} tabStoreData={tabStoreDataStub} />;
    const wrapper = shallow(component);

    test('component is defined and matches snapshot', () => {
        expect(component).toBeDefined();
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
