// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock, MockBehavior } from 'typemoq';

import { IVisualizationConfiguration } from '../../../../../common/configs/visualization-configuration-factory';
import { IAssessmentData, IAssessmentStoreData } from '../../../../../common/types/store-data/iassessment-result-data';
import { IScanData, ITestsEnabledState, IVisualizationStoreData } from '../../../../../common/types/store-data/ivisualization-store-data';
import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import {
    AssessmentTestView,
    AssessmentTestViewDeps,
    IAssessmentTestViewProps,
} from '../../../../../DetailsView/components/assessment-test-view';
import { AssessmentInstanceTableHandler } from '../../../../../DetailsView/handlers/assessment-instance-table-handler';

describe('AssessmentTestView', () => {
    let props: IAssessmentTestViewProps;
    let getStoreDataMock: IMock<(data: ITestsEnabledState) => IScanData>;
    let getAssessmentDataMock: IMock<(data: IAssessmentStoreData) => IAssessmentData>;
    let getTestStatusMock: IMock<(data: IScanData, step: string) => boolean>;
    let scanDataStub: IScanData;
    let visualizationStoreDataStub: IVisualizationStoreData;
    let actionMessageCreatorStub: DetailsViewActionMessageCreator;
    let assessmentInstanceHandlerStub: AssessmentInstanceTableHandler;
    let configuration: IVisualizationConfiguration;
    let assessmentStoreDataStub: IAssessmentStoreData;
    let assessmentDataStub: IAssessmentData;
    const selectedTestStep = 'step';
    const selectedTest = -1;
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
        } as IVisualizationStoreData;
        configuration = {
            getStoreData: getStoreDataMock.object,
            getAssessmentData: getAssessmentDataMock.object,
            getTestStatus: getTestStatusMock.object,
        } as IVisualizationConfiguration;
        assessmentStoreDataStub = {
            assessmentNavState: {
                selectedTestType: selectedTest,
                selectedTestStep: selectedTestStep,
            },
        } as IAssessmentStoreData;
        actionMessageCreatorStub = {} as DetailsViewActionMessageCreator;
        assessmentInstanceHandlerStub = {} as AssessmentInstanceTableHandler;
        assessmentDataStub = {} as IAssessmentData;

        props = {
            deps: {
                detailsViewActionMessageCreator: actionMessageCreatorStub,
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
        } as IAssessmentTestViewProps;

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
        expect(actual.debug()).toMatchSnapshot();
        verifyAll();
    });

    it('assessment view, isScanning is false', () => {
        props.visualizationStoreData.scanning = null;

        const actual = shallow(<AssessmentTestView {...props} />);
        expect(actual.debug()).toMatchSnapshot();
        verifyAll();
    });

    function verifyAll(): void {
        getStoreDataMock.verifyAll();
        getTestStatusMock.verifyAll();
        getAssessmentDataMock.verifyAll();
    }
});
