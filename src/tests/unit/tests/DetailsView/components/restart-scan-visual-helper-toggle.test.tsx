// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Enzyme from 'enzyme';
import * as _ from 'lodash';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

import { VisualizationToggle, VisualizationToggleProps } from '../../../../../common/components/visualization-toggle';
import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import { RestartScanVisualHelperToggle } from '../../../../../DetailsView/components/restart-scan-visual-helper-toggle';
import { VisualHelperToggleConfigBuilder } from '../../../common/visual-helper-toggle-config-builder';
import { VisualizationTogglePropsBuilder } from '../../../common/visualization-toggle-props-builder';

describe('RestartScanVisualHelperToggleTest', () => {
    const stepKey = 'assessment-1-step-1';
    let actionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;

    beforeEach(() => {
        actionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
    });

    test('render', () => {
        const props = new VisualHelperToggleConfigBuilder()
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
        const props = new VisualHelperToggleConfigBuilder()
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
        const props = new VisualHelperToggleConfigBuilder()
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
        expectedProps: VisualizationToggleProps,
        visualizationToggle: Enzyme.ShallowWrapper<VisualizationToggleProps>,
    ): void {
        expect(visualizationToggle.exists()).toBe(true);

        const actualProps = visualizationToggle.props();

        _.forEach(expectedProps, (value, key) => {
            expect(actualProps[key]).toBe(value);
        });
    }

    function getDefaultVisualizationTogglePropsBuilder(): VisualizationTogglePropsBuilder {
        return new VisualizationTogglePropsBuilder().with('visualizationName', 'Visual helper').with('className', 'visual-helper-toggle');
    }
});
