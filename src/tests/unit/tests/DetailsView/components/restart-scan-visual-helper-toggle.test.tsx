// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Enzyme from 'enzyme';
import * as _ from 'lodash';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

import { IVisualHelperToggleConfig } from '../../../../../assessments/types/test-step';
import { IVisualizationToggleProps, VisualizationToggle } from '../../../../../common/components/visualization-toggle';
import { ManualTestStatus } from '../../../../../common/types/manual-test-status';
import {
    IAssessmentResultType,
    IGeneratedAssessmentInstance,
    ITestStepResult,
} from '../../../../../common/types/store-data/iassessment-result-data';
import { VisualizationType } from '../../../../../common/types/visualization-type';
import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import { RestartScanVisualHelperToggle } from '../../../../../DetailsView/components/restart-scan-visual-helper-toggle';
import { BaseDataBuilder } from '../../../Common/base-data-builder';

describe('RestartScanVisualHelperToggleTest', () => {
    const stepKey = 'assessment-1-step-1';
    let actionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;

    beforeEach(() => {
        actionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
    });

    test('render', () => {
        const props = new VisualHelperToggleTestPropsBuilder()
            .withToggleStepEnabled(true)
            .withToggleStepScanned(false)
            .withActionMessageCreator(actionMessageCreatorMock.object)
            .build();

        const wrapper = Enzyme.shallow(<RestartScanVisualHelperToggle {...props} />);

        const visualHelperClass = 'visual-helper';
        const toggleDiv = wrapper.find(`.${visualHelperClass}`);

        expect(toggleDiv.exists()).toBe(true);

        const textDiv = toggleDiv.find(`.${visualHelperClass}-text`);

        expect(textDiv.exists()).toBe(true);
        expect(textDiv.childAt(0).text()).toBe('Visual helper');

        const toggle = wrapper.find(VisualizationToggle);

        const expectedToggleProps = getDefaultVisualizationTogglePropsBuilder()
            .with('checked', true)
            .with('disabled', false)
            .build();

        assertVisualizationToggle(expectedToggleProps, toggle);
    });

    test('onClick: step enabled', () => {
        const props = new VisualHelperToggleTestPropsBuilder()
            .withToggleStepEnabled(true)
            .withToggleStepScanned(false)
            .withActionMessageCreator(actionMessageCreatorMock.object)
            .build();

        const wrapper = Enzyme.shallow(<RestartScanVisualHelperToggle {...props} />);
        actionMessageCreatorMock.reset();
        actionMessageCreatorMock
            .setup(acm => acm.disableVisualHelper(props.assessmentNavState.selectedTestType, props.assessmentNavState.selectedTestStep))
            .verifiable(Times.once());

        wrapper.find(VisualizationToggle).simulate('click');

        actionMessageCreatorMock.verifyAll();
    });

    test('onClick: step disabled', () => {
        const props = new VisualHelperToggleTestPropsBuilder()
            .withToggleStepEnabled(false)
            .withToggleStepScanned(false)
            .withActionMessageCreator(actionMessageCreatorMock.object)
            .build();

        const wrapper = Enzyme.shallow(<RestartScanVisualHelperToggle {...props} />);
        actionMessageCreatorMock.reset();
        actionMessageCreatorMock
            .setup(acm => acm.enableVisualHelper(props.assessmentNavState.selectedTestType, stepKey))
            .verifiable(Times.once());

        wrapper.find(VisualizationToggle).simulate('click');

        actionMessageCreatorMock.verifyAll();
    });

    function assertVisualizationToggle(
        expectedProps: IVisualizationToggleProps,
        visualizationToggle: Enzyme.ShallowWrapper<IVisualizationToggleProps>,
    ) {
        expect(visualizationToggle.exists()).toBe(true);

        const actualProps = visualizationToggle.props();

        _.forEach(expectedProps, (value, key) => {
            expect(actualProps[key]).toBe(value);
        });
    }

    function getDefaultVisualizationTogglePropsBuilder() {
        return new VisualizationTogglePropsBuilder().with('visualizationName', 'Visual helper').with('className', 'visual-helper-toggle');
    }
});

export class VisualHelperToggleTestPropsBuilder extends BaseDataBuilder<IVisualHelperToggleConfig> {
    private stepKey = 'assessment-1-step-1';
    private otherKey = 'assessment-1-step-2';
    constructor() {
        super();

        this.data = {
            assessmentNavState: {
                selectedTestStep: this.stepKey,
                selectedTestType: -1 as VisualizationType,
            },
            actionMessageCreator: null,
            instancesMap: {
                'assessment-1-step-1': {
                    html: 'html',
                    propertyBag: {},
                    target: ['element2'],
                } as IGeneratedAssessmentInstance,
            } as IDictionaryStringTo<IGeneratedAssessmentInstance>,
            isStepEnabled: true,
            isStepScanned: false,
        };
    }

    public withActionMessageCreator(actionMessageCreator: DetailsViewActionMessageCreator): VisualHelperToggleTestPropsBuilder {
        this.data.actionMessageCreator = actionMessageCreator;
        return this;
    }

    public withToggleStepEnabled(stepEnabled: boolean): VisualHelperToggleTestPropsBuilder {
        this.data.isStepEnabled = stepEnabled;
        return this;
    }

    public withToggleStepScanned(stepScanned: boolean): VisualHelperToggleTestPropsBuilder {
        this.data.isStepScanned = stepScanned;
        return this;
    }

    public withNonEmptyFilteredMap(isVisualizationEnabled: boolean = false): VisualHelperToggleTestPropsBuilder {
        this.data.instancesMap = {
            'selector-1': {
                testStepResults: {
                    [this.stepKey]: {
                        id: 'id1',
                        status: ManualTestStatus.UNKNOWN,
                        isVisualizationEnabled: isVisualizationEnabled,
                    } as ITestStepResult,
                } as IAssessmentResultType<any>,
            } as IGeneratedAssessmentInstance,
            'selector-2': {
                testStepResults: {
                    [this.stepKey]: {
                        id: 'id1',
                        status: ManualTestStatus.FAIL,
                        isVisualizationEnabled: isVisualizationEnabled,
                    } as ITestStepResult,
                } as IAssessmentResultType<any>,
            } as IGeneratedAssessmentInstance,
        };
        return this;
    }

    public withEmptyFilteredMap(): VisualHelperToggleTestPropsBuilder {
        this.data.instancesMap = {
            'selector-1': {
                testStepResults: {
                    [this.otherKey]: {
                        id: 'id2',
                        status: ManualTestStatus.UNKNOWN,
                    } as ITestStepResult,
                } as IAssessmentResultType<any>,
            } as IGeneratedAssessmentInstance,
        };
        return this;
    }

    public withPassingFilteredMap(): VisualHelperToggleTestPropsBuilder {
        this.data.instancesMap = {
            'selector-1': {
                testStepResults: {
                    [this.stepKey]: {
                        id: 'id2',
                        status: ManualTestStatus.PASS,
                    } as ITestStepResult,
                } as IAssessmentResultType<any>,
            } as IGeneratedAssessmentInstance,
            'selector-2': null,
        };
        return this;
    }
}

export class VisualizationTogglePropsBuilder extends BaseDataBuilder<IVisualizationToggleProps> {
    constructor() {
        super();
        this.data = {
            checked: false,
            disabled: false,
            visualizationName: null,
        } as IVisualizationToggleProps;
    }
}
