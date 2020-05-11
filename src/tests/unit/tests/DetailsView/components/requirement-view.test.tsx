// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProviderImpl } from 'assessments/assessments-provider';
import { Requirement } from 'assessments/types/requirement';
import { CollapsibleComponent } from 'common/components/collapsible-component';
import { ManualTestStatus } from 'common/types/manual-test-status';
import { VisualizationType } from 'common/types/visualization-type';
import { AssessmentInstanceTable } from 'DetailsView/components/assessment-instance-table';
import { AssessmentVisualizationEnabledToggle } from 'DetailsView/components/assessment-visualization-enabled-toggle';
import { ManualTestStepView } from 'DetailsView/components/manual-test-step-view';
import { RequirementView, RequirementViewProps } from 'DetailsView/components/requirement-view';
import * as styles from 'DetailsView/components/test-step-view.scss';
import { AssessmentInstanceTableHandler } from 'DetailsView/handlers/assessment-instance-table-handler';
import * as Enzyme from 'enzyme';
import * as React from 'react';
import { BaseDataBuilder } from 'tests/unit/common/base-data-builder';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

let getVisualHelperToggleMock: IMock<(provider, props) => {}>;

describe('RequirementViewTest', () => {
    beforeEach(() => {
        getVisualHelperToggleMock = Mock.ofInstance((provider, props) => {
            return null;
        });
    });

    test('constructor, no side effects', () => {
        const testObject = new RequirementView(null);
        expect(testObject).toBeInstanceOf(React.Component);
    });

    test('render, check fixed parts', () => {
        const props = RequirementViewPropsBuilder.defaultProps(
            getVisualHelperToggleMock.object,
        ).build();

        const wrapper = Enzyme.shallow(<RequirementView {...props} />);

        const mainDiv = wrapper.find('.test-step-view');

        expect(mainDiv.exists()).toBeTruthy();

        const title = mainDiv.find('h1.test-step-view-title');

        expect(title.exists()).toBeTruthy();
        expect(title.text().startsWith(props.testStep.name)).toBe(true);

        const testInstructions = wrapper.find(CollapsibleComponent);

        expect(testInstructions.exists()).toBeTruthy();
        expect(props.testStep.howToTest).toEqual(testInstructions.prop('content'));
        expect(testInstructions.prop('contentClassName')).toBe(styles.testStepInstructions);
        expect(testInstructions.prop('header')).toEqual(
            <h3 className={styles.testStepInstructionsHeader}>How to test</h3>,
        );
    });

    test('render spinner for non-manual tests', () => {
        const props = RequirementViewPropsBuilder.defaultProps(getVisualHelperToggleMock.object)
            .withScanning(true)
            .build();

        const wrapper = Enzyme.shallow(<RequirementView {...props} />);
        const spinner = wrapper.find('.details-view-spinner');

        expect(spinner.exists()).toBeTruthy();
    });

    test('render manual requirement view even when scanning manual tests', () => {
        const props = RequirementViewPropsBuilder.defaultProps(getVisualHelperToggleMock.object)
            .withScanning(true)
            .withIsManual(true)
            .build();

        const wrapper = Enzyme.shallow(<RequirementView {...props} />);
        validateManualRequirementView(wrapper, props);
    });

    test('render, variable part for assisted test', () => {
        const props = RequirementViewPropsBuilder.defaultProps(getVisualHelperToggleMock.object)
            .withIsManual(false)
            .build();

        const wrapper = Enzyme.shallow(<RequirementView {...props} />);

        const title = wrapper.find('h2.test-step-instances-header');

        expect(title.exists()).toBeTruthy();
        expect(title.text()).toBe('Instances');

        const instanceTable = wrapper.find(AssessmentInstanceTable);

        expect(instanceTable.exists()).toBeTruthy();
        expect(instanceTable.prop('instancesMap')).toEqual(props.instancesMap);
        expect(instanceTable.prop('assessmentInstanceTableHandler')).toEqual(
            props.assessmentInstanceTableHandler,
        );
        expect(props.assessmentNavState).toEqual(instanceTable.prop('assessmentNavState'));

        expect(wrapper.debug()).toMatchSnapshot();
    });

    test('render, variable part for manual test', () => {
        const props = RequirementViewPropsBuilder.defaultProps(getVisualHelperToggleMock.object)
            .withIsManual(true)
            .build();

        const wrapper = Enzyme.shallow(<RequirementView {...props} />);
        validateManualRequirementView(wrapper, props);
    });

    test('render, with no visual helper toggle', () => {
        const props = RequirementViewPropsBuilder.defaultProps(getVisualHelperToggleMock.object)
            .withNoGetToggleConfig()
            .build();

        getVisualHelperToggleMock.setup(g => g(It.isAny(), It.isAny())).verifiable(Times.never());

        const wrapper = Enzyme.shallow(<RequirementView {...props} />);

        const visualHelper = wrapper.find(AssessmentVisualizationEnabledToggle);

        getVisualHelperToggleMock.verifyAll();
        expect(visualHelper.exists()).toBeFalsy();
    });

    test('render snapshot matches with manual false and scanning is finished', () => {
        const props = RequirementViewPropsBuilder.defaultProps(getVisualHelperToggleMock.object)
            .withIsManual(false)
            .withStepScanComplete(true)
            .build();

        const wrapper = Enzyme.shallow(<RequirementView {...props} />);
        expect(wrapper.debug()).toMatchSnapshot();
    });

    function validateManualRequirementView(
        wrapper: Enzyme.ShallowWrapper,
        props: RequirementViewProps,
    ): void {
        const view = wrapper.find(ManualTestStepView);
        expect(view.exists()).toBe(true);
        expect(props.assessmentNavState.selectedTestSubview).toEqual(view.prop('step'));
        expect(props.assessmentNavState.selectedTestType).toEqual(view.prop('test'));
        expect(props.manualTestStepResultMap).toEqual(view.prop('manualTestStepResultMap'));
        expect(props.assessmentInstanceTableHandler).toEqual(
            view.prop('assessmentInstanceTableHandler'),
        );
        expect(props.assessmentsProvider).toEqual(view.prop('assessmentsProvider'));
    }
});

class RequirementViewPropsBuilder extends BaseDataBuilder<RequirementViewProps> {
    public static defaultProps(
        getVisualHelperToggle: (provider, props) => {},
    ): RequirementViewPropsBuilder {
        const assessmentsProviderMock = Mock.ofType(AssessmentsProviderImpl, MockBehavior.Strict);
        assessmentsProviderMock
            .setup(p => p.getStep(It.isAny(), It.isAny()))
            .returns((test, step) => {
                return { getVisualHelperToggle: getVisualHelperToggle } as Requirement;
            });
        return new RequirementViewPropsBuilder()
            .with('instancesMap', {
                target1: {
                    target: ['target1'],
                    html: '<h1>test</h1>',
                    testStepResults: {
                        headingFunction: {
                            id: 'testId',
                            status: ManualTestStatus.PASS,
                            isCapturedByUser: false,
                            failureSummary: '',
                            isVisualizationEnabled: true,
                        },
                        headingLevel: {
                            id: 'testId',
                            status: ManualTestStatus.PASS,
                            isCapturedByUser: false,
                            failureSummary: '',
                            isVisualizationEnabled: true,
                        },
                        missingHeadings: {
                            id: 'testId',
                            status: ManualTestStatus.PASS,
                            isCapturedByUser: false,
                            failureSummary: '',
                            isVisualizationEnabled: true,
                        },
                    },
                    propertyBag: {
                        headingLevel: '1',
                        headingText: 'testaaaaa',
                    },
                },
            })
            .with(
                'assessmentInstanceTableHandler',
                Mock.ofType(AssessmentInstanceTableHandler).object,
            )
            .with('manualTestStepResultMap', {
                headingFunction: {
                    status: ManualTestStatus.PASS,
                    id: '1',
                    instances: [],
                },
            })
            .with('assessmentNavState', {
                selectedTestSubview: 'headingFunction',
                selectedTestType: VisualizationType.HeadingsAssessment,
            })
            .with('assessmentsProvider', assessmentsProviderMock.object)
            .with('renderStaticContent', () => <div />)
            .with('testStep', {
                key: null,
                description: <p>description</p>,
                name: 'Test Step Test Name',
                howToTest: <p>Instructions</p>,
                isManual: false,
                guidanceLinks: [],
            });
    }

    public withNoGetToggleConfig(): RequirementViewPropsBuilder {
        const providerMock = Mock.ofType(AssessmentsProviderImpl);
        providerMock
            .setup(p => p.getStep(It.isAny(), It.isAny()))
            .returns((test, step) => {
                return { getVisualHelperToggle: null } as Requirement;
            });

        this.data.assessmentsProvider = providerMock.object;
        return this;
    }

    public withIsManual(value: boolean): RequirementViewPropsBuilder {
        this.data.testStep.isManual = value;
        return this;
    }

    public withScanning(isScanning: boolean): RequirementViewPropsBuilder {
        this.data.isScanning = isScanning;
        return this;
    }

    public withStepScanComplete(isStepScanned: boolean): RequirementViewPropsBuilder {
        this.data.isStepScanned = isStepScanned;
        return this;
    }
}
