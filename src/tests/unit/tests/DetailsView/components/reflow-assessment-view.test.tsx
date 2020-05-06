// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentDefaultMessageGenerator } from 'assessments/assessment-default-message-generator';
import { shallow } from 'enzyme';
import * as React from 'react';
import { AssessmentViewPropsBuilder } from 'tests/unit/tests/DetailsView/components/assessment-view-props-builder';
import { Mock, Times } from 'typemoq';

import { VisualizationType } from '../../../../../common/types/visualization-type';
import {
    AssessmentViewProps,
    ReflowAssessmentView,
} from '../../../../../DetailsView/components/reflow-assessment-view';
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
        const testObject = new ReflowAssessmentView({} as AssessmentViewProps);
        expect(testObject).toBeInstanceOf(React.Component);
    });

    test('render for requirement', () => {
        const props = builder.buildProps();

        const rendered = shallow(<ReflowAssessmentView {...props} />);
        expect(rendered.debug()).toMatchSnapshot();
    });

    test('render for gettting started', () => {
        const props = builder.buildProps();
        props.assessmentNavState.selectedTestSubview = 'getting-started';

        const rendered = shallow(<ReflowAssessmentView {...props} />);
        expect(rendered.debug()).toMatchSnapshot();
    });

    test('componentDidMount', () => {
        const props = builder.buildProps();
        builder.updateHandlerMock.setup(u => u.onMount(props)).verifiable(Times.once());

        const testObject = new ReflowAssessmentView(props);

        testObject.componentDidMount();
        builder.verifyAll();
    });

    test('componentDidUpdate', () => {
        const prevProps = buildPrevProps();
        const props = builder.buildProps();
        const onAssessmentViewUpdateMock = Mock.ofInstance(
            (previousProps: AssessmentViewProps, currentProps: AssessmentViewProps) => {},
        );

        builder.updateHandlerMock.setup(u => u.update(prevProps, props)).verifiable(Times.once());
        builder.detailsViewExtensionPointMock
            .setup(d => d.apply(props.assessmentTestResult.definition.extensions))
            .returns(() => {
                return { onAssessmentViewUpdate: onAssessmentViewUpdateMock.object };
            })
            .verifiable(Times.once());
        onAssessmentViewUpdateMock.setup(o => o(prevProps, props)).verifiable(Times.once());

        const testObject = new ReflowAssessmentView(props);

        testObject.componentDidUpdate(prevProps);

        builder.verifyAll();
        onAssessmentViewUpdateMock.verifyAll();
    });

    test('componentWillUnmount', () => {
        const props = builder.buildProps();
        builder.updateHandlerMock.setup(u => u.onUnmount(props)).verifiable(Times.once());

        const testObject = new ReflowAssessmentView(props);

        testObject.componentWillUnmount();
        builder.verifyAll();
    });

    function buildPrevProps(): AssessmentViewProps {
        const prevStep = 'prevStep';
        const prevTest = -100 as VisualizationType;
        const prevProps = builder.buildProps();
        prevProps.assessmentNavState.selectedTestSubview = prevStep;
        prevProps.assessmentNavState.selectedTestType = prevTest;
        return prevProps;
    }
});
