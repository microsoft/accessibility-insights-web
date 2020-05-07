// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Enzyme from 'enzyme';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';
import {
    VisualizationToggle,
    VisualizationToggleProps,
} from '../../../../../common/components/visualization-toggle';
import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import { AssessmentVisualizationEnabledToggle } from '../../../../../DetailsView/components/assessment-visualization-enabled-toggle';
import { visualHelperText } from '../../../../../DetailsView/components/base-visual-helper-toggle';
import { VisualHelperToggleConfigBuilder } from '../../../common/visual-helper-toggle-config-builder';
import { VisualizationTogglePropsBuilder } from '../../../common/visualization-toggle-props-builder';

describe('AssessmentVisualizationEnabledToggle', () => {
    const actionMessageCreatorMock: IMock<DetailsViewActionMessageCreator> = Mock.ofType(
        DetailsViewActionMessageCreator,
    );

    it('render with disabled message', () => {
        const props = new VisualHelperToggleConfigBuilder()
            .withToggleStepEnabled(true)
            .withToggleStepScanned(false)
            .withActionMessageCreator(actionMessageCreatorMock.object)
            .withEmptyFilteredMap()
            .build();

        const wrapper = Enzyme.shallow(<AssessmentVisualizationEnabledToggle {...props} />);

        const visualHelperClass = 'visual-helper';
        const toggleDiv = wrapper.find(`.${visualHelperClass}`);

        expect(toggleDiv.exists()).toBeTruthy();

        const textDiv = toggleDiv.find(`.${visualHelperClass}-text`);

        expect(textDiv.exists()).toBeTruthy();
        expect(textDiv.childAt(0).text()).toEqual(visualHelperText);

        const noMatchesWarningClass = 'no-matching-elements';
        expect(wrapper.find(`.${noMatchesWarningClass}`).exists()).toBeTruthy();

        const toggle = wrapper.find(VisualizationToggle);

        const expectedToggleProps = getDefaultVisualizationTogglePropsBuilder()
            .with('checked', false)
            .with('disabled', true)
            .build();

        assertVisualizationToggle(expectedToggleProps, toggle);
    });

    it('render: toggle not disabled', () => {
        const props = new VisualHelperToggleConfigBuilder()
            .withToggleStepEnabled(true)
            .withToggleStepScanned(false)
            .withActionMessageCreator(actionMessageCreatorMock.object)
            .withNonEmptyFilteredMap()
            .build();

        const wrapper = Enzyme.shallow(<AssessmentVisualizationEnabledToggle {...props} />);

        const visualHelperClass = 'visual-helper';
        const toggleDiv = wrapper.find(`.${visualHelperClass}`);

        expect(toggleDiv.exists()).toBeTruthy();

        const textDiv = toggleDiv.find(`.${visualHelperClass}-text`);

        expect(textDiv.exists()).toBeTruthy();
        expect(textDiv.childAt(0).text()).toEqual(visualHelperText);
        expect(wrapper.find('strong').exists()).toBeFalsy();
        const toggle = wrapper.find(VisualizationToggle);

        const expectedToggleProps = getDefaultVisualizationTogglePropsBuilder()
            .with('checked', false)
            .with('disabled', false)
            .build();

        assertVisualizationToggle(expectedToggleProps, toggle);
    });

    it('render: have non empty instance map with a visible instance', () => {
        const props = new VisualHelperToggleConfigBuilder()
            .withToggleStepEnabled(false)
            .withToggleStepScanned(false)
            .withActionMessageCreator(actionMessageCreatorMock.object)
            .withNonEmptyFilteredMap(true)
            .build();

        const wrapper = Enzyme.shallow(<AssessmentVisualizationEnabledToggle {...props} />);

        const visualHelperClass = 'visual-helper';
        const toggleDiv = wrapper.find(`.${visualHelperClass}`);

        expect(toggleDiv.exists()).toBeTruthy();

        const textDiv = toggleDiv.find(`.${visualHelperClass}-text`);

        expect(textDiv.exists()).toBeTruthy();
        expect(textDiv.childAt(0).text()).toEqual(visualHelperText);
        expect(wrapper.find('strong').exists()).toBeFalsy();

        const toggle = wrapper.find(VisualizationToggle);

        const expectedToggleProps = getDefaultVisualizationTogglePropsBuilder()
            .with('checked', true)
            .with('disabled', false)
            .build();

        assertVisualizationToggle(expectedToggleProps, toggle);
    });

    it('render: have non empty instance map without a visible instance', () => {
        const props = new VisualHelperToggleConfigBuilder()
            .withToggleStepEnabled(false)
            .withToggleStepScanned(false)
            .withActionMessageCreator(actionMessageCreatorMock.object)
            .withNonEmptyFilteredMap()
            .build();

        const wrapper = Enzyme.shallow(<AssessmentVisualizationEnabledToggle {...props} />);

        const visualHelperClass = 'visual-helper';
        const toggleDiv = wrapper.find(`.${visualHelperClass}`);

        expect(toggleDiv.exists()).toBeTruthy();

        const textDiv = toggleDiv.find(`.${visualHelperClass}-text`);

        expect(textDiv.exists()).toBeTruthy();
        expect(textDiv.childAt(0).text()).toEqual(visualHelperText);
        expect(wrapper.find('strong').exists()).toBeFalsy();
        const toggle = wrapper.find(VisualizationToggle);

        const expectedToggleProps = getDefaultVisualizationTogglePropsBuilder()
            .with('checked', false)
            .with('disabled', false)
            .build();

        assertVisualizationToggle(expectedToggleProps, toggle);
    });

    it('enables all visualizations when none are shown', () => {
        const props = new VisualHelperToggleConfigBuilder()
            .withToggleStepEnabled(true)
            .withToggleStepScanned(false)
            .withActionMessageCreator(actionMessageCreatorMock.object)
            .build();

        const wrapper = Enzyme.shallow(<AssessmentVisualizationEnabledToggle {...props} />);
        actionMessageCreatorMock.reset();
        actionMessageCreatorMock
            .setup(acm =>
                acm.changeAssessmentVisualizationStateForAll(
                    true,
                    props.assessmentNavState.selectedTestType,
                    props.assessmentNavState.selectedTestSubview,
                ),
            )
            .verifiable(Times.once());

        wrapper.find(VisualizationToggle).simulate('click');

        actionMessageCreatorMock.verifyAll();
    });

    it('disables all visualizations when some are shown', () => {
        const props = new VisualHelperToggleConfigBuilder()
            .withToggleStepEnabled(true)
            .withToggleStepScanned(false)
            .withActionMessageCreator(actionMessageCreatorMock.object)
            .withNonEmptyFilteredMap(true)
            .build();

        const wrapper = Enzyme.shallow(<AssessmentVisualizationEnabledToggle {...props} />);
        actionMessageCreatorMock.reset();
        actionMessageCreatorMock
            .setup(acm =>
                acm.changeAssessmentVisualizationStateForAll(
                    false,
                    props.assessmentNavState.selectedTestType,
                    props.assessmentNavState.selectedTestSubview,
                ),
            )
            .verifiable(Times.once());

        wrapper.find(VisualizationToggle).simulate('click');

        actionMessageCreatorMock.verifyAll();
    });

    function assertVisualizationToggle(
        expectedProps: VisualizationToggleProps,
        visualizationToggle: Enzyme.ShallowWrapper<VisualizationToggleProps>,
    ): void {
        expect(visualizationToggle.exists()).toBeTruthy();

        const actualProps = visualizationToggle.props();

        expect(actualProps).toMatchObject(expectedProps);
    }

    function getDefaultVisualizationTogglePropsBuilder(): VisualizationTogglePropsBuilder {
        return new VisualizationTogglePropsBuilder()
            .with('visualizationName', visualHelperText)
            .with('className', 'visual-helper-toggle');
    }
});
