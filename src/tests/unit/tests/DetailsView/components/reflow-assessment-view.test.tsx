// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentTestResult } from 'common/assessment/assessment-test-result';
import {
    AssessmentData,
    GettingStarted,
    gettingStartedSubview,
    RequirementName,
} from 'common/types/store-data/assessment-result-data';
import { shallow } from 'enzyme';
import * as React from 'react';
import { Mock } from 'typemoq';
import {
    ReflowAssessmentView,
    ReflowAssessmentViewDeps,
    ReflowAssessmentViewProps,
} from '../../../../../DetailsView/components/reflow-assessment-view';

describe('AssessmentViewTest', () => {
    test('render for requirement', () => {
        const props = generateProps('requirement');
        const rendered = shallow(<ReflowAssessmentView {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    test('render for gettting started', () => {
        const props = generateProps(gettingStartedSubview);
        const rendered = shallow(<ReflowAssessmentView {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    function generateProps(subview: RequirementName | GettingStarted): ReflowAssessmentViewProps {
        const assessmentDataMock = Mock.ofType<AssessmentData>();

        const assessmentTestResultStub: AssessmentTestResult = {
            definition: {
                gettingStarted: <h1>Hello</h1>,
            },
        } as AssessmentTestResult;

        const reflowProps = {
            deps: {} as ReflowAssessmentViewDeps,
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
