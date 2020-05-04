// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { It, Times } from 'typemoq';

import { AssessmentDefaultMessageGenerator } from 'assessments/assessment-default-message-generator';
import { AssessmentViewUpdateHandler } from 'DetailsView/components/assessment-view-update-handler';
import { CreateTestAssessmentProvider } from 'tests/unit/common/test-assessment-provider';
import { AssessmentViewPropsBuilder } from 'tests/unit/tests/DetailsView/components/assessment-view-props-builder';
import { VisualizationType } from '../../../../../common/types/visualization-type';
import { AssessmentViewProps } from '../../../../../DetailsView/components/assessment-view';

describe('AssessmentViewTest', () => {
    const assessmentsProvider = CreateTestAssessmentProvider();
    const firstAssessment = assessmentsProvider.all()[0];
    const stepName = firstAssessment.requirements[0].key;
    const assessmentDefaultMessageGenerator = new AssessmentDefaultMessageGenerator();
    let builder: AssessmentViewPropsBuilder;

    let testObject: AssessmentViewUpdateHandler;

    beforeEach(() => {
        builder = new AssessmentViewPropsBuilder(
            assessmentsProvider,
            assessmentDefaultMessageGenerator,
        );
        testObject = new AssessmentViewUpdateHandler();
    });

    describe('onMount', () => {
        test('enable assessment by default according to config', () => {
            builder.detailsViewActionMessageCreatorMock
                .setup(a =>
                    a.enableVisualHelper(firstAssessment.visualizationType, stepName, true, true),
                )
                .verifiable(Times.once());
            const props = builder.buildProps();

            testObject.onMount(props);
            builder.verifyAll();
        });

        test('avoid enabling assessment by default according to config', () => {
            builder.detailsViewActionMessageCreatorMock
                .setup(a => a.enableVisualHelper(It.isAny(), It.isAny(), It.isAny()))
                .verifiable(Times.never());
            const props = builder.buildProps();
            setStepNotToScanByDefault(props);

            testObject.onMount(props);
            builder.verifyAll();
        });

        test('do not rescan because step already scanned', () => {
            builder.detailsViewActionMessageCreatorMock
                .setup(a =>
                    a.enableVisualHelper(firstAssessment.visualizationType, stepName, false, true),
                )
                .verifiable(Times.once());
            const props = builder.buildProps({ selector: {} }, false, true);

            testObject.onMount(props);
            builder.verifyAll();
        });

        test('already enabled', () => {
            builder.detailsViewActionMessageCreatorMock
                .setup(a =>
                    a.enableVisualHelper(firstAssessment.visualizationType, stepName, false),
                )
                .verifiable(Times.never());
            const props = builder.setIsEnabled(true).buildProps({ selector: {} });

            testObject.onMount(props);
            builder.verifyAll();
        });
    });

    describe('update', () => {
        test('no step change', () => {
            builder.detailsViewActionMessageCreatorMock
                .setup(a =>
                    a.enableVisualHelper(firstAssessment.visualizationType, stepName, true, false),
                )
                .verifiable(Times.once());

            const props = builder.buildProps();
            const prevProps = builder.buildProps();

            testObject.update(prevProps, props);

            builder.verifyAll();
        });

        test('step changed', () => {
            const prevStep = 'prevStep';
            const prevTest = -100 as VisualizationType;
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

            testObject.update(prevProps, props);

            builder.verifyAll();
        });

        test('do not enable because target changed', () => {
            const prevStep = 'prevStep';
            const prevTest = -100 as VisualizationType;
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

            testObject.update(prevProps, props);

            builder.verifyAll();
        });

        test('step changed, but the step is configured not enabled by default', () => {
            const prevStep = 'prevStep';
            const prevTest = -100 as VisualizationType;
            const newStep = assessmentsProvider.all()[0].requirements[1].key;
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

            testObject.update(prevProps, props);

            builder.verifyAll();
        });
    });

    describe('onUnmount', () => {
        test('componentWillUnmount', () => {
            builder.detailsViewActionMessageCreatorMock
                .setup(a => a.disableVisualHelpersForTest(firstAssessment.visualizationType))
                .verifiable(Times.once());

            const props = builder.buildProps();

            testObject.onUnmount(props);
            builder.verifyAll();
        });
    });

    function setStepNotToScanByDefault(props: AssessmentViewProps): void {
        props.assessmentNavState.selectedTestSubview = assessmentsProvider.all()[0].requirements[1].key;
    }
});
