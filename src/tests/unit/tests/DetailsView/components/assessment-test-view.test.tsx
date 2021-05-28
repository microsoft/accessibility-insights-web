// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import {
    AssessmentData,
    AssessmentStoreData,
} from 'common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { PathSnippetStoreData } from 'common/types/store-data/path-snippet-store-data';
import {
    ScanData,
    TestsEnabledState,
    VisualizationStoreData,
} from 'common/types/store-data/visualization-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import {
    AssessmentTestView,
    AssessmentTestViewDeps,
    AssessmentTestViewProps,
} from 'DetailsView/components/assessment-test-view';
import { DetailsViewSwitcherNavConfiguration } from 'DetailsView/components/details-view-switcher-nav';
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
    let detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
    let assessmentInstanceHandlerStub: AssessmentInstanceTableHandler;
    let configuration: VisualizationConfiguration;
    let featureFlagStoreDataStub: FeatureFlagStoreData;
    let assessmentStoreDataStub: AssessmentStoreData;
    let assessmentDataStub: AssessmentData;
    let pathSnippetStoreDataStub: PathSnippetStoreData;
    let switcherNavConfigurationStub: DetailsViewSwitcherNavConfiguration;
    let warningConfigurationStub: WarningConfiguration;

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
        detailsViewActionMessageCreator = {} as DetailsViewActionMessageCreator;
        assessmentInstanceHandlerStub = {} as AssessmentInstanceTableHandler;
        assessmentDataStub = {} as AssessmentData;
        pathSnippetStoreDataStub = {} as PathSnippetStoreData;
        warningConfigurationStub = {} as WarningConfiguration;
        switcherNavConfigurationStub = {
            warningConfiguration: warningConfigurationStub,
        } as DetailsViewSwitcherNavConfiguration;

        props = {
            deps: {
                detailsViewActionMessageCreator,
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
            .returns(() => scanDataStub)
            .verifiable();

        getAssessmentDataMock
            .setup(gadm => gadm(assessmentStoreDataStub))
            .returns(() => assessmentDataStub)
            .verifiable();

        getTestStatusMock
            .setup(gtsm => gtsm(scanDataStub, selectedTestStep))
            .returns(() => testStatusStub)
            .verifiable();
    });
    test('assessment view, isScanning is true', () => {
        const actual = shallow(<AssessmentTestView {...props} />);
        expect(actual.getElement()).toMatchSnapshot();
        verifyAll();
    });

    it('assessment view, isScanning is false', () => {
        props.visualizationStoreData.scanning = null;

        const actual = shallow(<AssessmentTestView {...props} />);
        expect(actual.getElement()).toMatchSnapshot();
        verifyAll();
    });

    function verifyAll(): void {
        getStoreDataMock.verifyAll();
        getTestStatusMock.verifyAll();
        getAssessmentDataMock.verifyAll();
    }
});
