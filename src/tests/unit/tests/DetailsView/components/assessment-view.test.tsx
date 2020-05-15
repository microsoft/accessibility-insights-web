// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { Mock, Times } from 'typemoq';

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

        const testObject = new AssessmentView(props);

        testObject.componentDidUpdate(prevProps);

        builder.verifyAll();
        onAssessmentViewUpdateMock.verifyAll();
    });

    test('componentWillUnmount', () => {
        const props = builder.buildProps();
        builder.updateHandlerMock.setup(u => u.onUnmount(props)).verifiable(Times.once());

        const testObject = new AssessmentView(props);

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
