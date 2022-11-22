// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AssessmentData } from 'common/types/store-data/assessment-result-data';
import { ManualTestStatus } from 'common/types/store-data/manual-test-status';
import { AssessmentActionMessageCreator } from 'DetailsView/actions/assessment-action-message-creator';
import {
    AssessmentViewUpdateHandler,
    AssessmentViewUpdateHandlerDeps,
    AssessmentViewUpdateHandlerProps,
} from 'DetailsView/components/assessment-view-update-handler';
import { isEmpty } from 'lodash';
import { CreateTestAssessmentProvider } from 'tests/unit/common/test-assessment-provider';
import { IMock, It, Mock, Times } from 'typemoq';
import { VisualizationType } from '../../../../../common/types/visualization-type';

describe('AssessmentViewTest', () => {
    const assessmentsProvider = CreateTestAssessmentProvider();
    const firstAssessment = assessmentsProvider.all()[0];
    const stepName = firstAssessment.requirements[0].key;
    let assessmentActionMessageCreatorMock: IMock<AssessmentActionMessageCreator>;
    let selectedRequirementIsEnabled: boolean;

    let testObject: AssessmentViewUpdateHandler;

    beforeEach(() => {
        selectedRequirementIsEnabled = false;
        assessmentActionMessageCreatorMock = Mock.ofType<AssessmentActionMessageCreator>();
        testObject = new AssessmentViewUpdateHandler();
    });

    describe('onMount', () => {
        test('enable assessment by default according to config', () => {
            assessmentActionMessageCreatorMock
                .setup(a =>
                    a.enableVisualHelper(firstAssessment.visualizationType, stepName, true, true),
                )
                .verifiable(Times.once());
            const props = buildProps();

            testObject.onMount(props);

            assessmentActionMessageCreatorMock.verifyAll();
        });

        test('enable assessment if prev target does not have id', () => {
            assessmentActionMessageCreatorMock
                .setup(a =>
                    a.enableVisualHelper(firstAssessment.visualizationType, stepName, true, true),
                )
                .verifiable(Times.once());
            const prevTarget = { detailsViewId: 'testId' };
            const props = buildProps({}, true, false, prevTarget);

            testObject.onMount(props);

            assessmentActionMessageCreatorMock.verifyAll();
        });

        test('avoid enabling assessment by default according to config', () => {
            assessmentActionMessageCreatorMock
                .setup(a => a.enableVisualHelper(It.isAny(), It.isAny(), It.isAny()))
                .verifiable(Times.never());
            const props = buildProps();
            setStepNotToScanByDefault(props);

            testObject.onMount(props);
            assessmentActionMessageCreatorMock.verifyAll();
        });

        test('do not rescan because step already scanned', () => {
            assessmentActionMessageCreatorMock
                .setup(a =>
                    a.enableVisualHelper(firstAssessment.visualizationType, stepName, false, true),
                )
                .verifiable(Times.once());
            const props = buildProps({ selector: {} }, false, true);

            testObject.onMount(props);
            assessmentActionMessageCreatorMock.verifyAll();
        });

        test('already enabled', () => {
            assessmentActionMessageCreatorMock
                .setup(a =>
                    a.enableVisualHelper(firstAssessment.visualizationType, stepName, false),
                )
                .verifiable(Times.never());
            selectedRequirementIsEnabled = true;
            const props = buildProps({ selector: {} });

            testObject.onMount(props);
            assessmentActionMessageCreatorMock.verifyAll();
        });
    });

    describe('update', () => {
        test('no step change', () => {
            assessmentActionMessageCreatorMock
                .setup(a =>
                    a.enableVisualHelper(firstAssessment.visualizationType, stepName, true, false),
                )
                .verifiable(Times.once());

            const props = buildProps();
            const prevProps = buildProps();

            testObject.update(prevProps, props);

            assessmentActionMessageCreatorMock.verifyAll();
        });

        test('step changed', () => {
            const prevStep = 'prevStep';
            const prevTest = -100 as VisualizationType;
            const prevProps = buildProps();
            const props = buildProps();
            prevProps.assessmentNavState.selectedTestSubview = prevStep;
            prevProps.assessmentNavState.selectedTestType = prevTest;

            assessmentActionMessageCreatorMock
                .setup(a =>
                    a.enableVisualHelper(firstAssessment.visualizationType, stepName, true, true),
                )
                .verifiable(Times.once());
            assessmentActionMessageCreatorMock
                .setup(a => a.disableVisualHelpersForTest(prevTest))
                .verifiable(Times.once());

            testObject.update(prevProps, props);

            assessmentActionMessageCreatorMock.verifyAll();
        });

        test('do not enable because target changed', () => {
            const prevStep = 'prevStep';
            const prevTest = -100 as VisualizationType;
            const prevProps = buildProps({}, true);
            const props = buildProps({}, true);
            prevProps.assessmentNavState.selectedTestSubview = prevStep;
            prevProps.assessmentNavState.selectedTestType = prevTest;

            assessmentActionMessageCreatorMock
                .setup(a => a.enableVisualHelper(firstAssessment.visualizationType, stepName, true))
                .verifiable(Times.never());
            assessmentActionMessageCreatorMock
                .setup(a => a.disableVisualHelpersForTest(prevTest))
                .verifiable(Times.once());

            testObject.update(prevProps, props);

            assessmentActionMessageCreatorMock.verifyAll();
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

            assessmentActionMessageCreatorMock
                .setup(a => a.enableVisualHelper(firstAssessment.visualizationType, stepName, true))
                .verifiable(Times.never());
            assessmentActionMessageCreatorMock
                .setup(a => a.disableVisualHelpersForTest(prevTest))
                .verifiable(Times.once());

            testObject.update(prevProps, props);

            assessmentActionMessageCreatorMock.verifyAll();
        });

        test('enable because assessment data has been updated', () => {
            selectedRequirementIsEnabled = true;
            const prevProps = buildProps();
            const props = buildProps();

            prevProps.assessmentData.fullAxeResultsMap = {};

            assessmentActionMessageCreatorMock
                .setup(a =>
                    a.enableVisualHelper(firstAssessment.visualizationType, stepName, true, false),
                )
                .verifiable(Times.once());

            testObject.update(prevProps, props);

            assessmentActionMessageCreatorMock.verifyAll();
        });

        test('do not enable because assessment data has not been updated', () => {
            selectedRequirementIsEnabled = true;
            const prevProps = buildProps();
            const props = buildProps();

            assessmentActionMessageCreatorMock
                .setup(a => a.enableVisualHelper(It.isAny(), It.isAny(), It.isAny(), It.isAny()))
                .verifiable(Times.never());

            testObject.update(prevProps, props);

            assessmentActionMessageCreatorMock.verifyAll();
        });
    });

    describe('onUnmount', () => {
        test('componentWillUnmount', () => {
            assessmentActionMessageCreatorMock
                .setup(a => a.disableVisualHelpersForTest(firstAssessment.visualizationType))
                .verifiable(Times.once());

            const props = buildProps();

            testObject.onUnmount(props);
            assessmentActionMessageCreatorMock.verifyAll();
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
        prevTarget = {},
    ): AssessmentViewUpdateHandlerProps {
        const deps: AssessmentViewUpdateHandlerDeps = {
            assessmentActionMessageCreator: assessmentActionMessageCreatorMock.object,
            assessmentsProvider,
        };
        const assessment = assessmentsProvider.all()[0];
        const firstStep = assessment.requirements[0];
        const anotherTarget = {
            id: 2,
            url: '2',
            title: '2',
        };
        prevTarget = isEmpty(prevTarget)
            ? {
                  id: 1,
                  url: '1',
                  title: '2',
                  detailsViewId: undefined,
              }
            : prevTarget;
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
