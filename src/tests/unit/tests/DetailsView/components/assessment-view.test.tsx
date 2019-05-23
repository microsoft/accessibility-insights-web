// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, It, Mock, Times } from 'typemoq';
import { AssessmentDefaultMessageGenerator } from '../../../../../assessments/assessment-default-message-generator';
import { AssessmentsProvider } from '../../../../../assessments/types/assessments-provider';
import { AssessmentTestResult } from '../../../../../common/assessment/assessment-test-result';
import { GetGuidanceTagsFromGuidanceLinks } from '../../../../../common/get-guidance-tags-from-guidance-links';
import { getInnerTextFromJsxElement } from '../../../../../common/get-inner-text-from-jsx-element';
import { ContentActionMessageCreator } from '../../../../../common/message-creators/content-action-message-creator';
import { ManualTestStatus } from '../../../../../common/types/manual-test-status';
import { AssessmentData } from '../../../../../common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from '../../../../../common/types/store-data/feature-flag-store-data';
import { VisualizationType } from '../../../../../common/types/visualization-type';
import { UrlParser } from '../../../../../common/url-parser';
import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import { AssessmentView, AssessmentViewDeps, AssessmentViewProps } from '../../../../../DetailsView/components/assessment-view';
import { AssessmentInstanceTableHandler } from '../../../../../DetailsView/handlers/assessment-instance-table-handler';
import {
    outcomeTypeFromTestStatus,
    outcomeTypeSemanticsFromTestStatus,
} from '../../../../../DetailsView/reports/components/requirement-outcome-type';
import { ContentUrlDecorator } from '../../../../../views/content/url-decorator/content-url-decorator';
import { contentProvider, CreateTestAssessmentProvider } from '../../../common/test-assessment-provider';

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
        const builder = new AssessmentViewPropsBuilder(assessmentsProvider, assessmentDefaultMessageGenerator);

        const props = builder.buildProps();

        const rendered = shallow(<AssessmentView {...props} />);
        expect(rendered.debug()).toMatchSnapshot();
    });

    test('componentDidMount: enable assessment by default according to config', () => {
        const builder = new AssessmentViewPropsBuilder(assessmentsProvider, assessmentDefaultMessageGenerator);
        builder.actionMessageCreatorMock
            .setup(a => a.enableVisualHelper(firstAssessment.visualizationType, stepName, true, true))
            .verifiable(Times.once());
        const props = builder.buildProps();

        const testObject = new AssessmentView(props);

        testObject.componentDidMount();
        builder.verifyAll();
    });

    test('componentDidMount: avoid enabling assessment by default according to config', () => {
        const builder = new AssessmentViewPropsBuilder(assessmentsProvider, assessmentDefaultMessageGenerator);
        builder.actionMessageCreatorMock.setup(a => a.enableVisualHelper(It.isAny(), It.isAny(), It.isAny())).verifiable(Times.never());
        const props = builder.buildProps();
        setStepNotToScanByDefault(props);
        const testObject = new AssessmentView(props);

        testObject.componentDidMount();
        builder.verifyAll();
    });

    test('componentDidUpdate: no step change', () => {
        const builder = new AssessmentViewPropsBuilder(assessmentsProvider, assessmentDefaultMessageGenerator);
        builder.actionMessageCreatorMock
            .setup(a => a.enableVisualHelper(firstAssessment.visualizationType, stepName, true, false))
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
            .setup(a => a.enableVisualHelper(firstAssessment.visualizationType, stepName, true, true))
            .verifiable(Times.once());
        builder.actionMessageCreatorMock.setup(a => a.disableVisualHelpersForTest(prevTest)).verifiable(Times.once());

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
            .setup(a => a.enableVisualHelper(firstAssessment.visualizationType, stepName, true))
            .verifiable(Times.never());
        builder.actionMessageCreatorMock.setup(a => a.disableVisualHelpersForTest(prevTest)).verifiable(Times.once());

        const testObject = new AssessmentView(props);

        testObject.componentDidUpdate(prevProps);

        builder.verifyAll();
    });

    test('componentDidUpdate: step changed, but the step is configured not enabled by default', () => {
        const prevStep = 'prevStep';
        const prevTest = -100 as VisualizationType;
        const newStep = assessmentsProvider.all()[0].requirements[1].key;
        const builder = new AssessmentViewPropsBuilder(assessmentsProvider, assessmentDefaultMessageGenerator);
        const prevProps = builder.buildProps();
        const props = builder.buildProps();
        prevProps.assessmentNavState.selectedTestStep = prevStep;
        prevProps.assessmentNavState.selectedTestType = prevTest;
        props.assessmentNavState.selectedTestStep = newStep;

        builder.actionMessageCreatorMock
            .setup(a => a.enableVisualHelper(firstAssessment.visualizationType, stepName, true))
            .verifiable(Times.never());
        builder.actionMessageCreatorMock.setup(a => a.disableVisualHelpersForTest(prevTest)).verifiable(Times.once());

        const testObject = new AssessmentView(props);

        testObject.componentDidUpdate(prevProps);

        builder.verifyAll();
    });

    test('componentDidMount: do not rescan because step already scanned', () => {
        const builder = new AssessmentViewPropsBuilder(assessmentsProvider, assessmentDefaultMessageGenerator);
        builder.actionMessageCreatorMock
            .setup(a => a.enableVisualHelper(firstAssessment.visualizationType, stepName, false, true))
            .verifiable(Times.once());

        const props = builder.buildProps({ selector: {} }, false, true);
        const testObject = new AssessmentView(props);

        testObject.componentDidMount();
        builder.verifyAll();
    });

    test('componentDidMount: already enabled', () => {
        const builder = new AssessmentViewPropsBuilder(assessmentsProvider, assessmentDefaultMessageGenerator);
        builder.actionMessageCreatorMock
            .setup(a => a.enableVisualHelper(firstAssessment.visualizationType, stepName, false))
            .verifiable(Times.never());

        const props = builder.setIsEnabled(true).buildProps({ selector: {} });
        const testObject = new AssessmentView(props);

        testObject.componentDidMount();
        builder.verifyAll();
    });

    test('componentWillUnmount', () => {
        const builder = new AssessmentViewPropsBuilder(assessmentsProvider, assessmentDefaultMessageGenerator);
        builder.actionMessageCreatorMock
            .setup(a => a.disableVisualHelpersForTest(firstAssessment.visualizationType))
            .verifiable(Times.once());

        const props = builder.buildProps();
        const testObject = new AssessmentView(props);

        testObject.componentWillUnmount();
        builder.verifyAll();
    });

    function setStepNotToScanByDefault(props: AssessmentViewProps): void {
        props.assessmentNavState.selectedTestStep = assessmentsProvider.all()[0].requirements[1].key;
    }
});

class AssessmentViewPropsBuilder {
    public actionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;
    public assessmentInstanceTableHandlerMock: IMock<AssessmentInstanceTableHandler>;
    private assessmentGeneratorInstance: AssessmentDefaultMessageGenerator;
    private content: JSX.Element = <div>AssessmentViewTest content</div>;
    private isEnabled: boolean = false;
    private provider: AssessmentsProvider;

    constructor(provider: AssessmentsProvider, assessmentGeneratorInstanceMock) {
        this.actionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
        this.assessmentInstanceTableHandlerMock = Mock.ofType(AssessmentInstanceTableHandler);
        this.assessmentGeneratorInstance = assessmentGeneratorInstanceMock;
        this.provider = provider;
    }

    public setIsEnabled(isEnabled: true): AssessmentViewPropsBuilder {
        this.isEnabled = isEnabled;
        return this;
    }

    public buildProps(generatedAssessmentInstancesMap = {}, isTargetChanged = false, isStepScanned = false): AssessmentViewProps {
        const deps: AssessmentViewDeps = {
            contentProvider,
            contentActionMessageCreator: Mock.ofType(ContentActionMessageCreator).object,
            detailsViewActionMessageCreator: this.actionMessageCreatorMock.object,
            assessmentsProvider: this.provider,
            outcomeTypeFromTestStatus: Mock.ofInstance(outcomeTypeFromTestStatus).object,
            getInnerTextFromJsxElement: Mock.ofInstance(getInnerTextFromJsxElement).object,
            outcomeTypeSemanticsFromTestStatus: Mock.ofInstance(outcomeTypeSemanticsFromTestStatus).object,
            urlParser: Mock.ofType(UrlParser).object,
            getGuidanceTagsFromGuidanceLinks: Mock.ofType<GetGuidanceTagsFromGuidanceLinks>().object,
            contentUrlDecorator: Mock.ofType<ContentUrlDecorator>().object,
        };
        const assessment = this.provider.all()[0];
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
            selectedTestStep: firstStep.key,
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

        const featureFlagStoreData = {} as FeatureFlagStoreData;

        const props: AssessmentViewProps = {
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
            assessmentTestResult: new AssessmentTestResult(this.provider, assessment.visualizationType, assessmentData),
            featureFlagStoreData,
        };

        return props;
    }

    public verifyAll(): void {
        this.actionMessageCreatorMock.verifyAll();
    }
}
