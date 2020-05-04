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
    const firstAssessment = assessmentsProvider.all()[0];
    const stepName = firstAssessment.requirements[0].key;
    const assessmentDefaultMessageGenerator = new AssessmentDefaultMessageGenerator();

    test('constructor', () => {
        const testObject = new AssessmentView({} as AssessmentViewProps);
        expect(testObject).toBeInstanceOf(React.Component);
    });

    test('render', () => {
        const builder = new AssessmentViewPropsBuilder(
            assessmentsProvider,
            assessmentDefaultMessageGenerator,
        );

        const props = builder.buildProps();

        const rendered = shallow(<AssessmentView {...props} />);
        expect(rendered.debug()).toMatchSnapshot();
    });

    test('componentDidMount: enable assessment by default according to config', () => {
        const builder = new AssessmentViewPropsBuilder(
            assessmentsProvider,
            assessmentDefaultMessageGenerator,
        );
        builder.detailsViewActionMessageCreatorMock
            .setup(a =>
                a.enableVisualHelper(firstAssessment.visualizationType, stepName, true, true),
            )
            .verifiable(Times.once());
        const props = builder.buildProps();

        const testObject = new AssessmentView(props);

        testObject.componentDidMount();
        builder.verifyAll();
    });

    test('componentDidMount: avoid enabling assessment by default according to config', () => {
        const builder = new AssessmentViewPropsBuilder(
            assessmentsProvider,
            assessmentDefaultMessageGenerator,
        );
        builder.detailsViewActionMessageCreatorMock
            .setup(a => a.enableVisualHelper(It.isAny(), It.isAny(), It.isAny()))
            .verifiable(Times.never());
        const props = builder.buildProps();
        setStepNotToScanByDefault(props);
        const testObject = new AssessmentView(props);

        testObject.componentDidMount();
        builder.verifyAll();
    });

    test('componentDidUpdate: no step change', () => {
        const builder = new AssessmentViewPropsBuilder(
            assessmentsProvider,
            assessmentDefaultMessageGenerator,
        );
        builder.detailsViewActionMessageCreatorMock
            .setup(a =>
                a.enableVisualHelper(firstAssessment.visualizationType, stepName, true, false),
            )
            .verifiable(Times.once());

        const props = builder.buildProps();
        const prevProps = builder.buildProps();

        const testObject = new AssessmentView(props);

        testObject.componentDidUpdate(prevProps);

        builder.verifyAll();
    });

    test('componentDidUpdate: step changed', () => {
        const prevStep = 'prevStep';
        const prevTest = -100 as VisualizationType;
        const builder = new AssessmentViewPropsBuilder(
            assessmentsProvider,
            assessmentDefaultMessageGenerator,
        );
        const prevProps = builder.buildProps();
        const props = builder.buildProps();
        prevProps.assessmentNavState.selectedTestSubview = prevStep;
        prevProps.assessmentNavState.selectedTestType = prevTest;

        builder.detailsViewActionMessageCreatorMock
            .setup(a =>
                a.enableVisualHelper(firstAssessment.visualizationType, stepName, true, true),
            )
            .verifiable(Times.once());
        builder.detailsViewActionMessageCreatorMock
            .setup(a => a.disableVisualHelpersForTest(prevTest))
            .verifiable(Times.once());

        const testObject = new AssessmentView(props);

        testObject.componentDidUpdate(prevProps);

        builder.verifyAll();
    });

    test('componentDidUpdate: do not enable because target changed', () => {
        const prevStep = 'prevStep';
        const prevTest = -100 as VisualizationType;
        const builder = new AssessmentViewPropsBuilder(
            assessmentsProvider,
            assessmentDefaultMessageGenerator,
        );
        const prevProps = builder.buildProps({}, true);
        const props = builder.buildProps({}, true);
        prevProps.assessmentNavState.selectedTestSubview = prevStep;
        prevProps.assessmentNavState.selectedTestType = prevTest;

        builder.detailsViewActionMessageCreatorMock
            .setup(a => a.enableVisualHelper(firstAssessment.visualizationType, stepName, true))
            .verifiable(Times.never());
        builder.detailsViewActionMessageCreatorMock
            .setup(a => a.disableVisualHelpersForTest(prevTest))
            .verifiable(Times.once());

        const testObject = new AssessmentView(props);

        testObject.componentDidUpdate(prevProps);

        builder.verifyAll();
    });

    test('componentDidUpdate: step changed, but the step is configured not enabled by default', () => {
        const prevStep = 'prevStep';
        const prevTest = -100 as VisualizationType;
        const newStep = assessmentsProvider.all()[0].requirements[1].key;
        const builder = new AssessmentViewPropsBuilder(
            assessmentsProvider,
            assessmentDefaultMessageGenerator,
        );
        const prevProps = builder.buildProps();
        const props = builder.buildProps();
        prevProps.assessmentNavState.selectedTestSubview = prevStep;
        prevProps.assessmentNavState.selectedTestType = prevTest;
        props.assessmentNavState.selectedTestSubview = newStep;

        builder.detailsViewActionMessageCreatorMock
            .setup(a => a.enableVisualHelper(firstAssessment.visualizationType, stepName, true))
            .verifiable(Times.never());
        builder.detailsViewActionMessageCreatorMock
            .setup(a => a.disableVisualHelpersForTest(prevTest))
            .verifiable(Times.once());

        const testObject = new AssessmentView(props);

        testObject.componentDidUpdate(prevProps);

        builder.verifyAll();
    });

    test('componentDidMount: do not rescan because step already scanned', () => {
        const builder = new AssessmentViewPropsBuilder(
            assessmentsProvider,
            assessmentDefaultMessageGenerator,
        );
        builder.detailsViewActionMessageCreatorMock
            .setup(a =>
                a.enableVisualHelper(firstAssessment.visualizationType, stepName, false, true),
            )
            .verifiable(Times.once());

        const props = builder.buildProps({ selector: {} }, false, true);
        const testObject = new AssessmentView(props);

        testObject.componentDidMount();
        builder.verifyAll();
    });

    test('componentDidMount: already enabled', () => {
        const builder = new AssessmentViewPropsBuilder(
            assessmentsProvider,
            assessmentDefaultMessageGenerator,
        );
        builder.detailsViewActionMessageCreatorMock
            .setup(a => a.enableVisualHelper(firstAssessment.visualizationType, stepName, false))
            .verifiable(Times.never());

        const props = builder.setIsEnabled(true).buildProps({ selector: {} });
        const testObject = new AssessmentView(props);

        testObject.componentDidMount();
        builder.verifyAll();
    });

    test('componentWillUnmount', () => {
        const builder = new AssessmentViewPropsBuilder(
            assessmentsProvider,
            assessmentDefaultMessageGenerator,
        );
        builder.detailsViewActionMessageCreatorMock
            .setup(a => a.disableVisualHelpersForTest(firstAssessment.visualizationType))
            .verifiable(Times.once());

        const props = builder.buildProps();
        const testObject = new AssessmentView(props);

        testObject.componentWillUnmount();
        builder.verifyAll();
    });

    function setStepNotToScanByDefault(props: AssessmentViewProps): void {
        props.assessmentNavState.selectedTestSubview = assessmentsProvider.all()[0].requirements[1].key;
    }
});
