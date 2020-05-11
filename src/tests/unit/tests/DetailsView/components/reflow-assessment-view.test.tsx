// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentTestResult } from 'common/assessment/assessment-test-result';
import { AssessmentData } from 'common/types/store-data/assessment-result-data';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

import { AssessmentViewUpdateHandler } from 'DetailsView/components/assessment-view-update-handler';
import {
    ReflowAssessmentView,
    ReflowAssessmentViewDeps,
    ReflowAssessmentViewProps,
} from '../../../../../DetailsView/components/reflow-assessment-view';

describe('AssessmentViewTest', () => {
    let updateHandlerMock: IMock<AssessmentViewUpdateHandler>;

    beforeEach(() => {
        updateHandlerMock = Mock.ofType(AssessmentViewUpdateHandler);
    });

    test('render for requirement', () => {
        const props = generateProps('requirement');
        const rendered = shallow(<ReflowAssessmentView {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    test('render for gettting started', () => {
        const props = generateProps('getting-started');
        const rendered = shallow(<ReflowAssessmentView {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    test('componentDidMount', () => {
        const props = generateProps('requirement');
        updateHandlerMock.setup(u => u.onMount(props)).verifiable(Times.once());
        const testObject = new ReflowAssessmentView(props);

        testObject.componentDidMount();

        updateHandlerMock.verifyAll();
    });

    test('componentWillUnmount', () => {
        const props = generateProps('requirement');
        updateHandlerMock.setup(u => u.onUnmount(props)).verifiable(Times.once());
        const testObject = new ReflowAssessmentView(props);

        testObject.componentWillUnmount();

        updateHandlerMock.verifyAll();
    });

    test('componentDidUpdate', () => {
        const prevProps = generateProps('requirement1');
        const props = generateProps('requirement2');
        updateHandlerMock.setup(u => u.update(prevProps, props)).verifiable(Times.once());
        const testObject = new ReflowAssessmentView(props);

        testObject.componentDidUpdate(prevProps);

        updateHandlerMock.verifyAll();
    });

    function generateProps(subview: string): ReflowAssessmentViewProps {
        const assessmentDataMock = Mock.ofType<AssessmentData>();

        const assessmentTestResultStub: AssessmentTestResult = {
            definition: {
                gettingStarted: <h1>Hello</h1>,
            },
        } as AssessmentTestResult;

        const reflowProps = {
            deps: {
                assessmentViewUpdateHandler: updateHandlerMock.object,
            } as ReflowAssessmentViewDeps,
            prevTarget: { id: 4 },
            currentTarget: { id: 5 },
            assessmentNavState: {
                selectedTestSubview: subview,
                selectedTestType: -1,
            },
            assessmentData: assessmentDataMock.object,
            assessmentTestResult: assessmentTestResultStub,
        } as ReflowAssessmentViewProps;
        return reflowProps;
    }
});
