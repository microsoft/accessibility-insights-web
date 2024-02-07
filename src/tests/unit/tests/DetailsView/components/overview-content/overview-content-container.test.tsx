// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { AssessmentActionMessageCreator } from 'DetailsView/actions/assessment-action-message-creator';
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
import { OverviewHeading } from '../../../../../../DetailsView/components/overview-content/overview-heading';
import {
    OverviewHelpSection,
    OverviewHelpSectionDeps,
} from '../../../../../../DetailsView/components/overview-content/overview-help-section';
import { TargetChangeDialog } from '../../../../../../DetailsView/components/target-change-dialog';
import { AssessmentReportSummary } from '../../../../../../reports/components/assessment-report-summary';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from '../../../../mock-helpers/mock-module-helpers';

jest.mock('../../../../../../DetailsView/components/overview-content/overview-help-section');
jest.mock('../../../../../../reports/components/assessment-report-summary');
jest.mock('../../../../../../DetailsView/components/overview-content/overview-heading');
jest.mock('../../../../../../DetailsView/components/target-change-dialog');

describe('OverviewContainer', () => {
    mockReactComponents([
        OverviewHelpSection,
        AssessmentReportSummary,
        OverviewHeading,
        TargetChangeDialog,
    ]);
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
    const getAssessmentSummaryModelFromProviderAndStoreDataMock = Mock.ofInstance(
        (provider, assessmentData, requirementKeys) => null,
        MockBehavior.Strict,
    );
    const quickAssessRequirementKeysStub = [];

    const deps: OverviewContainerDeps = {
        getProvider: () => assessmentsProvider,
        actionInitiators: overviewHelpSectionDeps.actionInitiators,
        getAssessmentActionMessageCreator: () => assessmentActionMessageCreator,
        detailsViewActionMessageCreator,
        urlParser: urlParserMock,
        assessmentsProviderWithFeaturesEnabled: assessmentsProviderWithFeaturesEnabledMock.object,
        detailsViewId: undefined,
        quickAssessRequirementKeys: quickAssessRequirementKeysStub,
        getGetAssessmentSummaryModelFromProviderAndStoreData: () =>
            getAssessmentSummaryModelFromProviderAndStoreDataMock.object,
    };

    const featureFlagDataStub = {};

    const assessmentStoreData: AssessmentStoreData = {
        persistedTabInfo: {} as PersistedTabInfo,
    } as AssessmentStoreData;

    assessmentsProviderWithFeaturesEnabledMock
        .setup(mock => mock(assessmentsProvider, featureFlagDataStub))
        .returns(() => filteredProvider);

    getAssessmentSummaryModelFromProviderAndStoreDataMock.setup(mock =>
        mock(filteredProvider, assessmentStoreData, quickAssessRequirementKeysStub),
    );

    const getOverviewHeadingIntroMock = Mock.ofInstance(
        () => <div>OVERVIEW HEADING INTRO</div>,
        MockBehavior.Strict,
    );
    const getOverviewHelpSectionAboutMock = Mock.ofInstance(
        () => <div>OVERVIEW HELP SECTION ABOUT</div>,
        MockBehavior.Strict,
    );

    const linkDataSourceStub = [
        {
            href: 'Getting-started-link',
            text: 'Getting started',
        },
        {
            href: 'How-to-complete-a-test-link',
            text: 'How to complete a test',
        },
        {
            href: 'Ask-a-question-link',
            text: 'Ask a question',
        },
        {
            href: 'New-WCAG-2.1-success-criteria-link',
            text: 'New WCAG 2.1 success criteria',
        },
    ];

    const component = (
        <OverviewContainer
            deps={deps}
            assessmentStoreData={assessmentStoreData}
            featureFlagStoreData={featureFlagDataStub}
            tabStoreData={tabStoreDataStub}
            linkDataSource={linkDataSourceStub}
            getOverviewHeadingIntro={getOverviewHeadingIntroMock.object}
            getOverviewHelpSectionAbout={getOverviewHelpSectionAboutMock.object}
        />
    );

    test('component is defined and matches snapshot', () => {
        const renderResult = render(component);
        expect(component).toBeDefined();
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([
            OverviewHelpSection,
            OverviewHeading,
            TargetChangeDialog,
        ]);
    });
});
