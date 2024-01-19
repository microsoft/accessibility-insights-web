// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import {
    AssessmentData,
    AssessmentStoreData,
    gettingStartedSubview,
} from 'common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { PathSnippetStoreData } from 'common/types/store-data/path-snippet-store-data';
import {
    ScanData,
    TestsEnabledState,
    VisualizationStoreData,
} from 'common/types/store-data/visualization-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import { AssessmentActionMessageCreator } from 'DetailsView/actions/assessment-action-message-creator';
import {
    AssessmentTestView,
    AssessmentTestViewDeps,
    AssessmentTestViewProps,
} from 'DetailsView/components/assessment-test-view';
import { DetailsViewSwitcherNavConfiguration } from 'DetailsView/components/details-view-switcher-nav';
import { RequirementView } from 'DetailsView/components/requirement-view';
import {
    GetRequirementViewComponentConfiguration,
    RequirementViewComponentConfiguration,
} from 'DetailsView/components/requirement-view-component-configuration';
import { WarningConfiguration } from 'DetailsView/components/warning-configuration';
import { AssessmentInstanceTableHandler } from 'DetailsView/handlers/assessment-instance-table-handler';
import * as React from 'react';
import { IMock, Mock, MockBehavior } from 'typemoq';
import { BannerWarnings } from '../../../../../DetailsView/components/banner-warnings';
import { GettingStartedView } from '../../../../../DetailsView/components/getting-started-view';
import { TargetChangeDialog } from '../../../../../DetailsView/components/target-change-dialog';
import { expectMockedComponentPropsToMatchSnapshots, getMockComponentClassPropsForCall, mockReactComponents } from '../../../mock-helpers/mock-module-helpers';

jest.mock('DetailsView/components/requirement-view');
jest.mock('../../../../../DetailsView/components/target-change-dialog');
jest.mock('../../../../../DetailsView/components/getting-started-view');
jest.mock('../../../../../DetailsView/components/banner-warnings');

describe('AssessmentTestView', () => {
    mockReactComponents([RequirementView, TargetChangeDialog, GettingStartedView, BannerWarnings]);
    let props: AssessmentTestViewProps;
    let getStoreDataMock: IMock<(data: TestsEnabledState) => ScanData>;
    let getAssessmentDataMock: IMock<(data: AssessmentStoreData) => AssessmentData>;
    let getTestStatusMock: IMock<(data: ScanData, step: string) => boolean>;
    let scanDataStub: ScanData;
    let visualizationStoreDataStub: VisualizationStoreData;
    let assessmentActionMessageCreator: AssessmentActionMessageCreator;
    let assessmentInstanceHandlerStub: AssessmentInstanceTableHandler;
    let configuration: VisualizationConfiguration;
    let featureFlagStoreDataStub: FeatureFlagStoreData;
    let assessmentStoreDataStub: AssessmentStoreData;
    let assessmentDataStub: AssessmentData;
    let pathSnippetStoreDataStub: PathSnippetStoreData;
    let switcherNavConfigurationStub: DetailsViewSwitcherNavConfiguration;
    let warningConfigurationStub: WarningConfiguration;
    let getRequirementViewComponentConfigurationMock: IMock<GetRequirementViewComponentConfiguration>;
    let assessmentsProviderStub: AssessmentsProvider;
    let assessmentStub: Assessment;

    const selectedTestStep = 'step';
    const selectedTest = -1 as VisualizationType;
    const testStatusStub = false;

    beforeEach(() => {
        getStoreDataMock = Mock.ofInstance(() => null, MockBehavior.Strict);
        getAssessmentDataMock = Mock.ofInstance(() => null, MockBehavior.Strict);
        getTestStatusMock = Mock.ofInstance(() => null, MockBehavior.Strict);
        scanDataStub = {
            enabled: true,
        };
        visualizationStoreDataStub = {
            tests: {},
            scanning: 'test-scanning',
        } as VisualizationStoreData;
        configuration = {
            getStoreData: getStoreDataMock.object,
            getAssessmentData: getAssessmentDataMock.object,
            getTestStatus: getTestStatusMock.object,
        } as VisualizationConfiguration;
        assessmentStoreDataStub = {
            assessmentNavState: {
                selectedTestType: selectedTest,
                selectedTestSubview: selectedTestStep,
            },
        } as AssessmentStoreData;

        featureFlagStoreDataStub = {} as FeatureFlagStoreData;
        assessmentActionMessageCreator = {} as AssessmentActionMessageCreator;
        assessmentInstanceHandlerStub = {} as AssessmentInstanceTableHandler;
        assessmentDataStub = {} as AssessmentData;
        assessmentStub = {} as Assessment;
        pathSnippetStoreDataStub = {} as PathSnippetStoreData;
        warningConfigurationStub = {} as WarningConfiguration;
        getRequirementViewComponentConfigurationMock = Mock.ofInstance(
            () => null,
            MockBehavior.Strict,
        );
        switcherNavConfigurationStub = {
            warningConfiguration: warningConfigurationStub,
            getRequirementViewComponentConfiguration:
                getRequirementViewComponentConfigurationMock.object,
        } as DetailsViewSwitcherNavConfiguration;

        assessmentsProviderStub = {
            forType: _ => assessmentStub,
        } as AssessmentsProvider;

        props = {
            deps: {
                getProvider: () => assessmentsProviderStub,
                getAssessmentActionMessageCreator: () => assessmentActionMessageCreator,
            } as AssessmentTestViewDeps,
            configuration,
            visualizationStoreData: visualizationStoreDataStub,
            tabStoreData: {
                id: -2,
                url: 'test url',
                title: 'test title',
            },
            assessmentStoreData: assessmentStoreDataStub,
            assessmentInstanceTableHandler: assessmentInstanceHandlerStub,
            featureFlagStoreData: featureFlagStoreDataStub,
            pathSnippetStoreData: pathSnippetStoreDataStub,
            switcherNavConfiguration: switcherNavConfigurationStub,
        } as AssessmentTestViewProps;

        getStoreDataMock
            .setup(gsdm => gsdm(visualizationStoreDataStub.tests))
            .returns(() => scanDataStub);

        getRequirementViewComponentConfigurationMock
            .setup(g => g())
            .returns(() => {
                return {} as RequirementViewComponentConfiguration;
            });
    });

    function setSelectedSubview(subview: string) {
        assessmentStoreDataStub.assessmentNavState.selectedTestSubview = subview;
        getAssessmentDataMock.reset();
        getAssessmentDataMock
            .setup(gadm => gadm(assessmentStoreDataStub))
            .returns(() => assessmentDataStub);
        getTestStatusMock.setup(gtsm => gtsm(scanDataStub, subview)).returns(() => testStatusStub);
    }

    it('renders with a GettingStartedView when a Getting started item is selected', () => {
        setSelectedSubview(gettingStartedSubview);
        const renderResult = render(<AssessmentTestView {...props} />);

        const requirementView = getMockComponentClassPropsForCall(RequirementView);
        const gettingStartedView = getMockComponentClassPropsForCall(GettingStartedView);

        expect(gettingStartedView).toBeTruthy();
        expect(requirementView).toBeFalsy();
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([TargetChangeDialog, GettingStartedView, BannerWarnings]);
        verifyAll();
    });

    it('renders with a RequirementView when a requirement is selected', () => {
        setSelectedSubview(selectedTestStep);
        const renderResult = render(<AssessmentTestView {...props} />);
        const requirementView = getMockComponentClassPropsForCall(RequirementView);
        const gettingStartedView = getMockComponentClassPropsForCall(GettingStartedView);

        expect(requirementView).toBeTruthy();
        expect(gettingStartedView).toBeFalsy();
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([RequirementView, TargetChangeDialog, BannerWarnings]);
        verifyAll();
    });

    it.each`
        scanningInput                      | expectedRequirementViewProp
        ${null}                            | ${false}
        ${'requirement-key-being-scanned'} | ${true}
    `(
        'translates visualizationStoreData.scanning=$scanningInput as RequirementView scanningInProgress=$expectedRequirementViewProp',
        ({ scanningInput, expectedRequirementViewProp }) => {
            setSelectedSubview(selectedTestStep);
            props.visualizationStoreData.scanning = scanningInput;
            render(<AssessmentTestView {...props} />);

            const actualProp = getMockComponentClassPropsForCall(RequirementView).scanningInProgress;
            expect(actualProp).toBe(expectedRequirementViewProp);
        },
    );

    function verifyAll(): void {
        getStoreDataMock.verifyAll();
        getTestStatusMock.verifyAll();
        getAssessmentDataMock.verifyAll();
    }
});
