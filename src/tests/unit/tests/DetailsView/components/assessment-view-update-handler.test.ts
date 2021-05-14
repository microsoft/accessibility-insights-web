// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ManualTestStatus } from 'common/types/manual-test-status';
import { AssessmentData } from 'common/types/store-data/assessment-result-data';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import {
    AssessmentViewUpdateHandler,
    AssessmentViewUpdateHandlerDeps,
    AssessmentViewUpdateHandlerProps,
} from 'DetailsView/components/assessment-view-update-handler';
import { CreateTestAssessmentProvider } from 'tests/unit/common/test-assessment-provider';
import { IMock, It, Mock, Times } from 'typemoq';
import { VisualizationType } from '../../../../../common/types/visualization-type';

describe('AssessmentViewTest', () => {
    const assessmentsProvider = CreateTestAssessmentProvider();
    const firstAssessment = assessmentsProvider.all()[0];
    const stepName = firstAssessment.requirements[0].key;
    let detailsViewActionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;
    let selectedRequirementIsEnabled: boolean;

    let testObject: AssessmentViewUpdateHandler;

    beforeEach(() => {
        selectedRequirementIsEnabled = false;
        detailsViewActionMessageCreatorMock = Mock.ofType<DetailsViewActionMessageCreator>();
        testObject = new AssessmentViewUpdateHandler();
    });

    describe('onMount', () => {
        test('enable assessment by default according to config', () => {
            detailsViewActionMessageCreatorMock
                .setup(a =>
                    a.enableVisualHelper(firstAssessment.visualizationType, stepName, true, true),
                )
                .verifiable(Times.once());
            const props = buildProps();

            testObject.onMount(props);

            detailsViewActionMessageCreatorMock.verifyAll();
        });

        test('avoid enabling assessment by default according to config', () => {
            detailsViewActionMessageCreatorMock
                .setup(a => a.enableVisualHelper(It.isAny(), It.isAny(), It.isAny()))
                .verifiable(Times.never());
            const props = buildProps();
            setStepNotToScanByDefault(props);

            testObject.onMount(props);
            detailsViewActionMessageCreatorMock.verifyAll();
        });

        test('do not rescan because step already scanned', () => {
            detailsViewActionMessageCreatorMock
                .setup(a =>
                    a.enableVisualHelper(firstAssessment.visualizationType, stepName, false, true),
                )
                .verifiable(Times.once());
            const props = buildProps({ selector: {} }, false, true);

            testObject.onMount(props);
            detailsViewActionMessageCreatorMock.verifyAll();
        });

        test('already enabled', () => {
            detailsViewActionMessageCreatorMock
                .setup(a =>
                    a.enableVisualHelper(firstAssessment.visualizationType, stepName, false),
                )
                .verifiable(Times.never());
            selectedRequirementIsEnabled = true;
            const props = buildProps({ selector: {} });

            testObject.onMount(props);
            detailsViewActionMessageCreatorMock.verifyAll();
        });
    });

    describe('update', () => {
        test('no step change', () => {
            detailsViewActionMessageCreatorMock
                .setup(a =>
                    a.enableVisualHelper(firstAssessment.visualizationType, stepName, true, false),
                )
                .verifiable(Times.once());

            const props = buildProps();
            const prevProps = buildProps();

            testObject.update(prevProps, props);

            detailsViewActionMessageCreatorMock.verifyAll();
        });

        test('step changed', () => {
            const prevStep = 'prevStep';
            const prevTest = -100 as VisualizationType;
            const prevProps = buildProps();
            const props = buildProps();
            prevProps.assessmentNavState.selectedTestSubview = prevStep;
            prevProps.assessmentNavState.selectedTestType = prevTest;

            detailsViewActionMessageCreatorMock
                .setup(a =>
                    a.enableVisualHelper(firstAssessment.visualizationType, stepName, true, true),
                )
                .verifiable(Times.once());
            detailsViewActionMessageCreatorMock
                .setup(a => a.disableVisualHelpersForTest(prevTest))
                .verifiable(Times.once());

            testObject.update(prevProps, props);

            detailsViewActionMessageCreatorMock.verifyAll();
        });

        test('do not enable because target changed', () => {
            const prevStep = 'prevStep';
            const prevTest = -100 as VisualizationType;
            const prevProps = buildProps({}, true);
            const props = buildProps({}, true);
            prevProps.assessmentNavState.selectedTestSubview = prevStep;
            prevProps.assessmentNavState.selectedTestType = prevTest;

            detailsViewActionMessageCreatorMock
                .setup(a => a.enableVisualHelper(firstAssessment.visualizationType, stepName, true))
                .verifiable(Times.never());
            detailsViewActionMessageCreatorMock
                .setup(a => a.disableVisualHelpersForTest(prevTest))
                .verifiable(Times.once());

            testObject.update(prevProps, props);

            detailsViewActionMessageCreatorMock.verifyAll();
        });

        test('step changed, but the step is configured not enabled by default', () => {
            const prevStep = 'prevStep';
            const prevTest = -100 as VisualizationType;
            const newStep = assessmentsProvider.all()[0].requirements[1].key;
            const prevProps = buildProps();
            const props = buildProps();
            prevProps.assessmentNavState.selectedTestSubview = prevStep;
            prevProps.assessmentNavState.selectedTestType = prevTest;
            props.assessmentNavState.selectedTestSubview = newStep;

            detailsViewActionMessageCreatorMock
                .setup(a => a.enableVisualHelper(firstAssessment.visualizationType, stepName, true))
                .verifiable(Times.never());
            detailsViewActionMessageCreatorMock
                .setup(a => a.disableVisualHelpersForTest(prevTest))
                .verifiable(Times.once());

            testObject.update(prevProps, props);

            detailsViewActionMessageCreatorMock.verifyAll();
        });
    });

    describe('onUnmount', () => {
        test('componentWillUnmount', () => {
            detailsViewActionMessageCreatorMock
                .setup(a => a.disableVisualHelpersForTest(firstAssessment.visualizationType))
                .verifiable(Times.once());

            const props = buildProps();

            testObject.onUnmount(props);
            detailsViewActionMessageCreatorMock.verifyAll();
        });
    });

    function setStepNotToScanByDefault(props: AssessmentViewUpdateHandlerProps): void {
        props.assessmentNavState.selectedTestSubview =
            assessmentsProvider.all()[0].requirements[1].key;
    }

    function buildProps(
        generatedAssessmentInstancesMap = {},
        isTargetChanged = false,
        isStepScanned = false,
    ): AssessmentViewUpdateHandlerProps {
        const deps: AssessmentViewUpdateHandlerDeps = {
            detailsViewActionMessageCreator: detailsViewActionMessageCreatorMock.object,
            assessmentsProvider,
        };
        const assessment = assessmentsProvider.all()[0];
        const firstStep = assessment.requirements[0];
        const anotherTarget = {
            id: 2,
            url: '2',
            title: '2',
        };
        const prevTarget = {
            id: 1,
            url: '1',
            title: '2',
            appRefreshed: false,
        };
        const assessmentNavState = {
            selectedTestSubview: firstStep.key,
            selectedTestType: assessment.visualizationType,
        };
        const assessmentData = {
            testStepStatus: {
                [firstStep.key]: {
                    stepFinalResult: ManualTestStatus.UNKNOWN,
                    isStepScanned: isStepScanned,
                },
            },
            generatedAssessmentInstancesMap: generatedAssessmentInstancesMap,
            manualTestStepResultMap: {},
        } as AssessmentData;

        return {
            deps,
            prevTarget,
            currentTarget: isTargetChanged ? anotherTarget : prevTarget,
            selectedRequirementIsEnabled: selectedRequirementIsEnabled,
            assessmentNavState,
            assessmentData,
        };
    }
});
