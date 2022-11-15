// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    VisualizationToggle,
    VisualizationToggleProps,
} from 'common/components/visualization-toggle';
import { AssessmentActionMessageCreator } from 'DetailsView/actions/assessment-action-message-creator';
import { AssessmentVisualizationEnabledToggle } from 'DetailsView/components/assessment-visualization-enabled-toggle';
import { visualHelperText } from 'DetailsView/components/base-visual-helper-toggle';
import * as Enzyme from 'enzyme';
import * as React from 'react';
import { VisualHelperToggleConfigBuilder } from 'tests/unit/common/visual-helper-toggle-config-builder';
import { VisualizationTogglePropsBuilder } from 'tests/unit/common/visualization-toggle-props-builder';
import { IMock, Mock, Times } from 'typemoq';

describe('AssessmentVisualizationEnabledToggle', () => {
    const actionMessageCreatorMock: IMock<AssessmentActionMessageCreator> = Mock.ofType(
        AssessmentActionMessageCreator,
    );

    describe('render', () => {
        it('is disabled when no instances exist', () => {
            const props = new VisualHelperToggleConfigBuilder()
                .withToggleStepEnabled(true)
                .withToggleStepScanned(false)
                .withActionMessageCreator(actionMessageCreatorMock.object)
                .withEmptyFilteredMap()
                .build();

            const testSubject = Enzyme.shallow(<AssessmentVisualizationEnabledToggle {...props} />);

            expectDisabledTextLayout(testSubject);

            const expectedToggleProps = getDefaultVisualizationTogglePropsBuilder()
                .with('checked', false)
                .with('disabled', true)
                .build();

            expectChildVisualizationToggleWith(expectedToggleProps, testSubject);
        });

        it("is disabled when only instances that don't support visualization exist", () => {
            const props = new VisualHelperToggleConfigBuilder()
                .withToggleStepEnabled(true)
                .withToggleStepScanned(false)
                .withActionMessageCreator(actionMessageCreatorMock.object)
                .withNonEmptyFilteredMap(false, false)
                .build();

            const testSubject = Enzyme.shallow(<AssessmentVisualizationEnabledToggle {...props} />);

            expectDisabledTextLayout(testSubject);

            const expectedToggleProps = getDefaultVisualizationTogglePropsBuilder()
                .with('checked', false)
                .with('disabled', true)
                .build();

            expectChildVisualizationToggleWith(expectedToggleProps, testSubject);
        });

        it('is enabled but unchecked if step is enabled but all instance visualizations are disabled', () => {
            const props = new VisualHelperToggleConfigBuilder()
                .withToggleStepEnabled(true)
                .withToggleStepScanned(false)
                .withActionMessageCreator(actionMessageCreatorMock.object)
                .withNonEmptyFilteredMap(false)
                .build();

            const testSubject = Enzyme.shallow(<AssessmentVisualizationEnabledToggle {...props} />);

            expectEnabledTextLayout(testSubject);

            const expectedToggleProps = getDefaultVisualizationTogglePropsBuilder()
                .with('checked', false)
                .with('disabled', false)
                .build();

            expectChildVisualizationToggleWith(expectedToggleProps, testSubject);
        });

        it('is enabled and checked if step and instance visualizations are both enabled', () => {
            const props = new VisualHelperToggleConfigBuilder()
                .withToggleStepEnabled(false)
                .withToggleStepScanned(false)
                .withActionMessageCreator(actionMessageCreatorMock.object)
                .withNonEmptyFilteredMap(true)
                .build();

            const testSubject = Enzyme.shallow(<AssessmentVisualizationEnabledToggle {...props} />);

            expectEnabledTextLayout(testSubject);

            const expectedToggleProps = getDefaultVisualizationTogglePropsBuilder()
                .with('checked', true)
                .with('disabled', false)
                .build();

            expectChildVisualizationToggleWith(expectedToggleProps, testSubject);
        });

        it("is enabled and checked if some instances support visualization and some don't", () => {
            const props = new VisualHelperToggleConfigBuilder()
                .withToggleStepEnabled(false)
                .withToggleStepScanned(false)
                .withActionMessageCreator(actionMessageCreatorMock.object)
                .withMixedVisualizationSupportFilteredMap()
                .build();

            const testSubject = Enzyme.shallow(<AssessmentVisualizationEnabledToggle {...props} />);

            expectEnabledTextLayout(testSubject);

            const expectedToggleProps = getDefaultVisualizationTogglePropsBuilder()
                .with('checked', true)
                .with('disabled', false)
                .build();

            expectChildVisualizationToggleWith(expectedToggleProps, testSubject);
        });

        it('is enabled and unchecked if step and instance visualizations are both disabled', () => {
            const props = new VisualHelperToggleConfigBuilder()
                .withToggleStepEnabled(false)
                .withToggleStepScanned(false)
                .withActionMessageCreator(actionMessageCreatorMock.object)
                .withNonEmptyFilteredMap(false)
                .build();

            const testSubject = Enzyme.shallow(<AssessmentVisualizationEnabledToggle {...props} />);

            expectEnabledTextLayout(testSubject);

            const expectedToggleProps = getDefaultVisualizationTogglePropsBuilder()
                .with('checked', false)
                .with('disabled', false)
                .build();

            expectChildVisualizationToggleWith(expectedToggleProps, testSubject);
        });

        function expectEnabledTextLayout(
            testSubject: Enzyme.ShallowWrapper<AssessmentVisualizationEnabledToggle>,
        ): void {
            const visualHelperClass = 'visual-helper';
            const toggleDiv = testSubject.find(`.${visualHelperClass}`);

            expect(toggleDiv.exists()).toBeTruthy();

            const textDiv = toggleDiv.find(`.${visualHelperClass}-text`);

            expect(textDiv.exists()).toBeTruthy();
            expect(textDiv.childAt(0).text()).toEqual(visualHelperText);
            expect(testSubject.find('strong').exists()).toBeFalsy();
        }

        function expectDisabledTextLayout(
            testSubject: Enzyme.ShallowWrapper<AssessmentVisualizationEnabledToggle>,
        ): void {
            const visualHelperClass = 'visual-helper';
            const toggleDiv = testSubject.find(`.${visualHelperClass}`);

            expect(toggleDiv.exists()).toBeTruthy();

            const textDiv = toggleDiv.find(`.${visualHelperClass}-text`);

            expect(textDiv.exists()).toBeTruthy();
            expect(textDiv.childAt(0).text()).toEqual(visualHelperText);

            const noMatchesWarningClass = 'no-matching-elements';
            expect(testSubject.find(`.${noMatchesWarningClass}`).exists()).toBeTruthy();
        }
    });

    describe('toggle behavior', () => {
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
    });

    function expectChildVisualizationToggleWith(
        expectedProps: VisualizationToggleProps,
        testSubject: Enzyme.ShallowWrapper,
    ): void {
        const visualizationToggle = testSubject.find(VisualizationToggle);

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
