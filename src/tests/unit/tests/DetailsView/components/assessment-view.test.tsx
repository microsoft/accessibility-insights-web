// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, It, Mock, Times } from 'typemoq';

import { AssessmentDefaultMessageGenerator } from '../../../../../assessments/assessment-default-message-generator';
import { IAssessmentsProvider } from '../../../../../assessments/types/iassessments-provider';
import { AssessmentTestResult } from '../../../../../common/assessment/assessment-test-result';
import { ContentActionMessageCreator } from '../../../../../common/message-creators/content-action-message-creator';
import { ManualTestStatus } from '../../../../../common/types/manual-test-status';
import { IAssessmentData } from '../../../../../common/types/store-data/iassessment-result-data';
import { VisualizationType } from '../../../../../common/types/visualization-type';
import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import { AssessmentView, AssessmentViewDeps, IAssessmentViewProps } from '../../../../../DetailsView/components/assessment-view';
import { AssessmentInstanceTableHandler } from '../../../../../DetailsView/handlers/assessment-instance-table-handler';
import { outcomeTypeFromTestStatus } from '../../../../../DetailsView/reports/components/outcome-type';
import { contentProvider, CreateTestAssessmentProvider } from '../../../common/test-assessment-provider';

describe('AssessmentViewTest', () => {
    const assessmentsProvider = CreateTestAssessmentProvider();
    const firstAssessment = assessmentsProvider.all()[0];
    const stepName = firstAssessment.steps[0].key;
    const assessmentDefaultMessageGenerator = new AssessmentDefaultMessageGenerator();

    test('constructor', () => {
        const testObject = new AssessmentView({} as IAssessmentViewProps);
        expect(testObject).toBeInstanceOf(React.Component);
    });

    test('render', () => {
        const builder = new AssessmentViewPropsBuilder(assessmentsProvider, assessmentDefaultMessageGenerator);

        const props = builder.buildProps();

        const rendered = shallow(<AssessmentView {...props} />);
        expect(rendered.debug()).toMatchSnapshot();
    });

    test('componentDidMount: enable assessment by default according to config', () => {
        const builder = new AssessmentViewPropsBuilder(assessmentsProvider, assessmentDefaultMessageGenerator);
        builder.actionMessageCreatorMock
            .setup(a => a.enableVisualHelper(firstAssessment.type, stepName, true, true))
            .verifiable(Times.once());
        const props = builder.buildProps();

        const testObject = new AssessmentView(props);

        testObject.componentDidMount();
        builder.verifyAll();
    });

    test('componentDidMount: avoid enabling assessment by default according to config', () => {
        const builder = new AssessmentViewPropsBuilder(assessmentsProvider, assessmentDefaultMessageGenerator);
        builder.actionMessageCreatorMock
            .setup(a => a.enableVisualHelper(It.isAny(), It.isAny(), It.isAny()))
            .verifiable(Times.never());
        const props = builder.buildProps();
        setStepNotToScanByDefault(props);
        const testObject = new AssessmentView(props);

        testObject.componentDidMount();
        builder.verifyAll();
    });

    test('componentDidUpdate: no step change', () => {
        const builder = new AssessmentViewPropsBuilder(assessmentsProvider, assessmentDefaultMessageGenerator);
        builder.actionMessageCreatorMock
            .setup(a => a.enableVisualHelper(firstAssessment.type, stepName, true, false))
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
        const builder = new AssessmentViewPropsBuilder(assessmentsProvider, assessmentDefaultMessageGenerator);
        const prevProps = builder.buildProps();
        const props = builder.buildProps();
        prevProps.assessmentNavState.selectedTestStep = prevStep;
        prevProps.assessmentNavState.selectedTestType = prevTest;

        builder.actionMessageCreatorMock
            .setup(a => a.enableVisualHelper(firstAssessment.type, stepName, true, true))
            .verifiable(Times.once());
        builder.actionMessageCreatorMock
            .setup(a => a.disableVisualHelpersForTest(prevTest))
            .verifiable(Times.once());

        const testObject = new AssessmentView(props);

        testObject.componentDidUpdate(prevProps);

        builder.verifyAll();
    });

    test('componentDidUpdate: do not enable because target changed', () => {
        const prevStep = 'prevStep';
        const prevTest = -100 as VisualizationType;
        const builder = new AssessmentViewPropsBuilder(assessmentsProvider, assessmentDefaultMessageGenerator);
        const prevProps = builder.buildProps({}, true);
        const props = builder.buildProps({}, true);
        prevProps.assessmentNavState.selectedTestStep = prevStep;
        prevProps.assessmentNavState.selectedTestType = prevTest;

        builder.actionMessageCreatorMock
            .setup(a => a.enableVisualHelper(firstAssessment.type, stepName, true))
            .verifiable(Times.never());
        builder.actionMessageCreatorMock
            .setup(a => a.disableVisualHelpersForTest(prevTest))
            .verifiable(Times.once());

        const testObject = new AssessmentView(props);

        testObject.componentDidUpdate(prevProps);

        builder.verifyAll();
    });

    test('componentDidUpdate: step changed, but the step is configured not enabled by default', () => {
        const prevStep = 'prevStep';
        const prevTest = -100 as VisualizationType;
        const newStep = assessmentsProvider.all()[0].steps[1].key;
        const builder = new AssessmentViewPropsBuilder(assessmentsProvider, assessmentDefaultMessageGenerator);
        const prevProps = builder.buildProps();
        const props = builder.buildProps();
        prevProps.assessmentNavState.selectedTestStep = prevStep;
        prevProps.assessmentNavState.selectedTestType = prevTest;
        props.assessmentNavState.selectedTestStep = newStep;

        builder.actionMessageCreatorMock
            .setup(a => a.enableVisualHelper(firstAssessment.type, stepName, true))
            .verifiable(Times.never());
        builder.actionMessageCreatorMock
            .setup(a => a.disableVisualHelpersForTest(prevTest))
            .verifiable(Times.once());

        const testObject = new AssessmentView(props);

        testObject.componentDidUpdate(prevProps);

        builder.verifyAll();
    });

    test('componentDidMount: do not rescan because step already scanned', () => {
        const builder = new AssessmentViewPropsBuilder(assessmentsProvider, assessmentDefaultMessageGenerator);
        builder.actionMessageCreatorMock
            .setup(a => a.enableVisualHelper(firstAssessment.type, stepName, false, true))
            .verifiable(Times.once());

        const props = builder.setHasScanData(true).buildProps({ 'selector': {} }, false, true);
        const testObject = new AssessmentView(props);

        testObject.componentDidMount();
        builder.verifyAll();
    });

    test('componentDidMount: already enabled', () => {
        const builder = new AssessmentViewPropsBuilder(assessmentsProvider, assessmentDefaultMessageGenerator);
        builder.actionMessageCreatorMock
            .setup(a => a.enableVisualHelper(firstAssessment.type, stepName, false))
            .verifiable(Times.never());

        const props = builder
            .setHasScanData(true)
            .setIsEnabled(true)
            .buildProps({ 'selector': {} });
        const testObject = new AssessmentView(props);

        testObject.componentDidMount();
        builder.verifyAll();
    });

    test('componentWillUnmount', () => {
        const builder = new AssessmentViewPropsBuilder(assessmentsProvider, assessmentDefaultMessageGenerator);
        builder.actionMessageCreatorMock
            .setup(a => a.disableVisualHelpersForTest(firstAssessment.type))
            .verifiable(Times.once());

        const props = builder.buildProps();
        const testObject = new AssessmentView(props);

        testObject.componentWillUnmount();
        builder.verifyAll();
    });

    function setStepNotToScanByDefault(props: IAssessmentViewProps): void {
        props.assessmentNavState.selectedTestStep = assessmentsProvider.all()[0].steps[1].key;
    }
});

class AssessmentViewPropsBuilder {
    public actionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;
    public assessmentInstanceTableHandlerMock: IMock<AssessmentInstanceTableHandler>;
    private assessmentGeneratorInstance: AssessmentDefaultMessageGenerator;
    private content: JSX.Element = <div>AssessmentViewTest content</div>;
    private hasScanData: boolean = false;
    private isEnabled: boolean = false;
    private provider: IAssessmentsProvider;

    constructor(provider: IAssessmentsProvider, assessmentGeneratorInstanceMock) {
        this.actionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
        this.assessmentInstanceTableHandlerMock = Mock.ofType(AssessmentInstanceTableHandler);
        this.assessmentGeneratorInstance = assessmentGeneratorInstanceMock;
        this.provider = provider;
    }

    public setHasScanData(hasScanData: true): AssessmentViewPropsBuilder {
        this.hasScanData = hasScanData;
        return this;
    }

    public setIsEnabled(isEnabled: true): AssessmentViewPropsBuilder {
        this.isEnabled = isEnabled;
        return this;
    }

    public buildProps(
        generatedAssessmentInstancesMap = {},
        isTargetChanged = false,
        isStepScanned = false,
    ): IAssessmentViewProps {
        const deps: AssessmentViewDeps = {
            contentProvider,
            contentActionMessageCreator: Mock.ofType(ContentActionMessageCreator).object,
            detailsViewActionMessageCreator: this.actionMessageCreatorMock.object,
            assessmentsProvider: this.provider,
            outcomeTypeFromTestStatus: Mock.ofInstance(outcomeTypeFromTestStatus).object,
        };
        const assessment = this.provider.all()[0];
        const firstStep = assessment.steps[0];
        const anotherTarget = {
            id: 2,
            url: '2',
            title: '2',
        };
        const prevTarget = {
            id: 1,
            url: '1',
            title: '2',
        };
        const assessmentNavState = {
            selectedTestStep: firstStep.key,
            selectedTestType: assessment.type,
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
        } as IAssessmentData;

        const props: IAssessmentViewProps = {
            deps,
            prevTarget,
            currentTarget: isTargetChanged ? anotherTarget : prevTarget,
            isScanning: false,
            isEnabled: this.isEnabled,
            content: this.content,
            actionMessageCreator: this.actionMessageCreatorMock.object,
            assessmentNavState,
            assessmentInstanceTableHandler: this.assessmentInstanceTableHandlerMock.object,
            assessmentProvider: this.provider,
            assessmentData,
            assessmentDefaultMessageGenerator: this.assessmentGeneratorInstance,
            assessmentTestResult: new AssessmentTestResult(this.provider, assessment.type, assessmentData),
        };

        return props;
    }

    public verifyAll(): void {
        this.actionMessageCreatorMock.verifyAll();
    }
}
