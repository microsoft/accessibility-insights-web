// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { It, Times } from 'typemoq';

import { AssessmentDefaultMessageGenerator } from 'assessments/assessment-default-message-generator';
import { AssessmentViewPropsBuilder } from 'tests/unit/tests/DetailsView/components/assessment-view-props-builder';
import { VisualizationType } from '../../../../../common/types/visualization-type';
import {
    AssessmentView,
    AssessmentViewProps,
} from '../../../../../DetailsView/components/assessment-view';
import { CreateTestAssessmentProvider } from '../../../common/test-assessment-provider';

describe('AssessmentViewTest', () => {
    const assessmentsProvider = CreateTestAssessmentProvider();
    const assessmentDefaultMessageGenerator = new AssessmentDefaultMessageGenerator();
    let builder: AssessmentViewPropsBuilder;

    beforeEach(() => {
        builder = new AssessmentViewPropsBuilder(
            assessmentsProvider,
            assessmentDefaultMessageGenerator,
        );
    });

    test('constructor', () => {
        const testObject = new AssessmentView({} as AssessmentViewProps);
        expect(testObject).toBeInstanceOf(React.Component);
    });

    test('render', () => {
        const props = builder.buildProps();

        const rendered = shallow(<AssessmentView {...props} />);
        expect(rendered.debug()).toMatchSnapshot();
    });

    test('componentDidMount', () => {
        const props = builder.buildProps();
        builder.updateHandlerMock.setup(u => u.onMount(props)).verifiable(Times.once());

        const testObject = new AssessmentView(props);

        testObject.componentDidMount();
        builder.verifyAll();
    });

    test('componentDidUpdate', () => {
        const prevStep = 'prevStep';
        const prevTest = -100 as VisualizationType;
        const prevProps = builder.buildProps();
        const props = builder.buildProps();
        prevProps.assessmentNavState.selectedTestSubview = prevStep;
        prevProps.assessmentNavState.selectedTestType = prevTest;
        builder.updateHandlerMock.setup(u => u.update(prevProps, props));

        const testObject = new AssessmentView(props);

        testObject.componentDidUpdate(prevProps);

        builder.verifyAll();
    });

    test('componentWillUnmount', () => {
        const props = builder.buildProps();
        builder.updateHandlerMock.setup(u => u.onUnmount(props)).verifiable(Times.once());

        const testObject = new AssessmentView(props);

        testObject.componentWillUnmount();
        builder.verifyAll();
    });
});
