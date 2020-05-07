// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Assessment } from 'assessments/types/iassessment';
import { AssessmentTestResult } from 'common/assessment/assessment-test-result';
import { AssessmentData } from 'common/types/store-data/assessment-result-data';
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
        expect(rendered.debug()).toMatchSnapshot();
    });

    test('render for gettting started', () => {
        const props = generateProps('getting-started');
        const rendered = shallow(<ReflowAssessmentView {...props} />);
        expect(rendered.debug()).toMatchSnapshot();
    });

    function generateProps(subview: string): ReflowAssessmentViewProps {
        const assessmentMock = Mock.ofType<Assessment>();
        const assessmentDataMock = Mock.ofType<AssessmentData>();
        const assessmentTestResultMock = Mock.ofType<AssessmentTestResult>();

        const reflowProps = {
            deps: {} as ReflowAssessmentViewDeps,
            prevTarget: {},
            currentTarget: {},
            assessmentNavState: {
                selectedTestSubview: subview,
                selectedTestType: assessmentMock.object.visualizationType,
            },
            assessmentData: assessmentDataMock.object,
            assessmentTestResult: assessmentTestResultMock.object,
        } as ReflowAssessmentViewProps;
        return reflowProps;
    }
});
