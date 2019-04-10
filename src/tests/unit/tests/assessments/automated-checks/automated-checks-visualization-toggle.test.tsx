// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Enzyme from 'enzyme';
import * as _ from 'lodash';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';
import { AutomatedChecksVisualizationToggle } from '../../../../../assessments/automated-checks/automated-checks-visualization-enabled-toggle';
import { VisualizationToggle, VisualizationToggleProps } from '../../../../../common/components/visualization-toggle';
import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import { VisualHelperToggleConfigBuilder } from '../../../common/visual-helper-toggle-config-builder';
import { VisualizationTogglePropsBuilder } from '../../../common/visualization-toggle-props-builder';

describe('AutomatedChecksVisualizationToggle', () => {
    const actionMessageCreatorMock: IMock<DetailsViewActionMessageCreator> = Mock.ofType(DetailsViewActionMessageCreator);

    it('render with disabled message', () => {
        const props = new VisualHelperToggleConfigBuilder()
            .withToggleStepEnabled(true)
            .withToggleStepScanned(false)
            .withActionMessageCreator(actionMessageCreatorMock.object)
            .withEmptyFilteredMap()
            .build();

        const wrapper = Enzyme.shallow(<AutomatedChecksVisualizationToggle {...props} />);

        const visualHelperClass = 'visual-helper';
        const toggleDiv = wrapper.find(`.${visualHelperClass}`);

        expect(toggleDiv.exists()).toBeTruthy();

        const textDiv = toggleDiv.find(`.${visualHelperClass}-text`);

        expect(textDiv.exists()).toBeTruthy();
        expect(textDiv.childAt(0).text()).toEqual('Highlight instances on target page');

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

        const wrapper = Enzyme.shallow(<AutomatedChecksVisualizationToggle {...props} />);

        const visualHelperClass = 'visual-helper';
        const toggleDiv = wrapper.find(`.${visualHelperClass}`);

        expect(toggleDiv.exists()).toBeTruthy();

        const textDiv = toggleDiv.find(`.${visualHelperClass}-text`);

        expect(textDiv.exists()).toBeTruthy();
        expect(textDiv.childAt(0).text()).toEqual('Highlight instances on target page');
        expect(wrapper.find('strong').exists()).toBeFalsy();
        const toggle = wrapper.find(VisualizationToggle);

        const expectedToggleProps = getDefaultVisualizationTogglePropsBuilder()
            .with('checked', false)
            .with('disabled', false)
            .build();

        assertVisualizationToggle(expectedToggleProps, toggle);
    });

    it('render: toggle disabled when there are no failing instances for automated checks', () => {
        const props = new VisualHelperToggleConfigBuilder()
            .withToggleStepEnabled(true)
            .withToggleStepScanned(false)
            .withActionMessageCreator(actionMessageCreatorMock.object)
            .withPassingFilteredMap()
            .build();

        const wrapper = Enzyme.shallow(<AutomatedChecksVisualizationToggle {...props} />);
        const visualHelperClass = 'visual-helper';
        const toggleDiv = wrapper.find(`.${visualHelperClass}`);

        expect(toggleDiv.exists()).toBeTruthy();

        const textDiv = toggleDiv.find(`.${visualHelperClass}-text`);

        expect(textDiv.exists()).toBeTruthy();
        expect(textDiv.childAt(0).text()).toEqual('Highlight instances on target page');

        const noMatchesWarningClass = 'no-matching-elements';
        expect(wrapper.find(`.${noMatchesWarningClass}`).exists()).toBeTruthy();

        const toggle = wrapper.find(VisualizationToggle);

        const expectedToggleProps = getDefaultVisualizationTogglePropsBuilder()
            .with('checked', false)
            .with('disabled', true)
            .build();

        assertVisualizationToggle(expectedToggleProps, toggle);
    });

    function assertVisualizationToggle(
        expectedProps: VisualizationToggleProps,
        visualizationToggle: Enzyme.ShallowWrapper<VisualizationToggleProps>,
    ): void {
        expect(visualizationToggle.exists()).toBeTruthy();

        const actualProps = visualizationToggle.props();

        _.forEach(expectedProps, (value, key) => {
            expect(actualProps[key]).toEqual(value);
        });
    }

    function getDefaultVisualizationTogglePropsBuilder(): VisualizationTogglePropsBuilder {
        return new VisualizationTogglePropsBuilder()
            .with('visualizationName', 'Highlight instances on target page')
            .with('className', 'visual-helper-toggle');
    }
});
