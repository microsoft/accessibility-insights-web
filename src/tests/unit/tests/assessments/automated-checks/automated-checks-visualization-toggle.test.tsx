// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AutomatedChecksVisualizationToggle } from 'assessments/automated-checks/automated-checks-visualization-enabled-toggle';
import { AssessmentActionMessageCreator } from 'DetailsView/actions/assessment-action-message-creator';
import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';
import {
    VisualizationToggle,
    VisualizationToggleProps,
} from '../../../../../common/components/visualization-toggle';
import { visualHelperText } from '../../../../../DetailsView/components/base-visual-helper-toggle';
import { VisualHelperToggleConfigBuilder } from '../../../common/visual-helper-toggle-config-builder';
import { VisualizationTogglePropsBuilder } from '../../../common/visualization-toggle-props-builder';

describe('AutomatedChecksVisualizationToggle', () => {
    const assessmentActionMessageCreatorMock: IMock<AssessmentActionMessageCreator> = Mock.ofType(
        AssessmentActionMessageCreator,
    );

    it('render with disabled message', () => {
        const props = new VisualHelperToggleConfigBuilder()
            .withToggleStepEnabled(true)
            .withToggleStepScanned(false)
            .withActionMessageCreator(assessmentActionMessageCreatorMock.object)
            .withEmptyFilteredMap()
            .build();

        const wrapper = shallow(<AutomatedChecksVisualizationToggle {...props} />);

        const visualHelperClass = 'visual-helper';
        const toggleDiv = wrapper.find(`.${visualHelperClass}`);
        const textDiv = toggleDiv.find(`.${visualHelperClass}-text`);
        const noMatchesWarningClass = 'no-matching-elements';

        expect(toggleDiv.exists()).toBe(true);
        expect(textDiv.exists()).toBe(true);
        expect(wrapper.find(`.${noMatchesWarningClass}`).exists()).toBe(true);

        const toggle = wrapper.find(VisualizationToggle);

        const expectedToggleProps = getDefaultVisualizationTogglePropsBuilder()
            .with('checked', false)
            .with('disabled', true)
            .build();

        assertVisualizationToggle(expectedToggleProps, toggle);
        assertSnapshotMatch(wrapper);
    });

    it('render: toggle not disabled', () => {
        const props = new VisualHelperToggleConfigBuilder()
            .withToggleStepEnabled(true)
            .withToggleStepScanned(false)
            .withActionMessageCreator(assessmentActionMessageCreatorMock.object)
            .withNonEmptyFilteredMap()
            .build();

        const wrapper = shallow(<AutomatedChecksVisualizationToggle {...props} />);

        const visualHelperClass = 'visual-helper';
        const toggleDiv = wrapper.find(`.${visualHelperClass}`);

        expect(toggleDiv.exists()).toBe(true);

        const textDiv = toggleDiv.find(`.${visualHelperClass}-text`);

        expect(textDiv.exists()).toBe(true);

        expect(wrapper.find('strong').exists()).toBeFalsy();
        const toggle = wrapper.find(VisualizationToggle);

        const expectedToggleProps = getDefaultVisualizationTogglePropsBuilder()
            .with('checked', false)
            .with('disabled', false)
            .build();

        assertVisualizationToggle(expectedToggleProps, toggle);
        assertSnapshotMatch(wrapper);
    });

    it('render: toggle disabled when there are no failing instances for automated checks', () => {
        const props = new VisualHelperToggleConfigBuilder()
            .withToggleStepEnabled(true)
            .withToggleStepScanned(false)
            .withActionMessageCreator(assessmentActionMessageCreatorMock.object)
            .withPassingFilteredMap()
            .build();

        const wrapper = shallow(<AutomatedChecksVisualizationToggle {...props} />);
        const visualHelperClass = 'visual-helper';
        const toggleDiv = wrapper.find(`.${visualHelperClass}`);

        expect(toggleDiv.exists()).toBe(true);

        const textDiv = toggleDiv.find(`.${visualHelperClass}-text`);

        expect(textDiv.exists()).toBe(true);

        const noMatchesWarningClass = 'no-matching-elements';

        const toggle = wrapper.find(VisualizationToggle);

        expect(wrapper.find(`.${noMatchesWarningClass}`).exists()).toBe(true);

        const expectedToggleProps = getDefaultVisualizationTogglePropsBuilder()
            .with('checked', false)
            .with('disabled', true)
            .build();

        assertVisualizationToggle(expectedToggleProps, toggle);
        assertSnapshotMatch(wrapper);
    });

    function assertVisualizationToggle(
        expectedProps: VisualizationToggleProps,
        visualizationToggle: ShallowWrapper<VisualizationToggleProps>,
    ): void {
        expect(visualizationToggle.exists()).toBe(true);

        const actualProps = visualizationToggle.props();

        expect(actualProps).toMatchObject(expectedProps);
    }

    function assertSnapshotMatch(wrapper: ShallowWrapper): void {
        expect(wrapper.getElement()).toMatchSnapshot();
    }

    function getDefaultVisualizationTogglePropsBuilder(): VisualizationTogglePropsBuilder {
        return new VisualizationTogglePropsBuilder()
            .with('visualizationName', visualHelperText)
            .with('className', 'visual-helper-toggle');
    }
});
