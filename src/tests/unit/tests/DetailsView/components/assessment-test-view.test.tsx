// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
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
import { GettingStartedView } from 'DetailsView/components/getting-started-view';
import { RequirementView } from 'DetailsView/components/requirement-view';
import { WarningConfiguration } from 'DetailsView/components/warning-configuration';
import { AssessmentInstanceTableHandler } from 'DetailsView/handlers/assessment-instance-table-handler';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock, MockBehavior } from 'typemoq';

describe('AssessmentTestView', () => {
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
        switcherNavConfigurationStub = {
            warningConfiguration: warningConfigurationStub,
        } as DetailsViewSwitcherNavConfiguration;

        assessmentsProviderStub = {
            forType: _ => assessmentStub,
        } as AssessmentsProvider;

        props = {
            deps: {
                assessmentsProvider: assessmentsProviderStub,
                assessmentActionMessageCreator: assessmentActionMessageCreator,
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
        const testSubject = shallow(<AssessmentTestView {...props} />);

        expect(testSubject.exists(GettingStartedView)).toBe(true);
        expect(testSubject.exists(RequirementView)).toBe(false);

        expect(testSubject.getElement()).toMatchSnapshot();
        verifyAll();
    });

    it('renders with a RequirementView when a requirement is selected', () => {
        setSelectedSubview(selectedTestStep);
        const testSubject = shallow(<AssessmentTestView {...props} />);

        expect(testSubject.exists(RequirementView)).toBe(true);
        expect(testSubject.exists(GettingStartedView)).toBe(false);

        expect(testSubject.getElement()).toMatchSnapshot();
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
            const testSubject = shallow(<AssessmentTestView {...props} />);

            const actualProp = testSubject.find(RequirementView).prop('scanningInProgress');
            expect(actualProp).toBe(expectedRequirementViewProp);
        },
    );

    function verifyAll(): void {
        getStoreDataMock.verifyAll();
        getTestStatusMock.verifyAll();
        getAssessmentDataMock.verifyAll();
    }
});
