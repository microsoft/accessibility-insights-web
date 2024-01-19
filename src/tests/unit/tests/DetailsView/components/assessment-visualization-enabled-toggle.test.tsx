// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import '@testing-library/jest-dom';
import {
    VisualizationToggle,
    VisualizationToggleProps,
} from 'common/components/visualization-toggle';
import { AssessmentActionMessageCreator } from 'DetailsView/actions/assessment-action-message-creator';
import { AssessmentVisualizationEnabledToggle } from 'DetailsView/components/assessment-visualization-enabled-toggle';
import { visualHelperText } from 'DetailsView/components/base-visual-helper-toggle';
import * as React from 'react';
import { VisualHelperToggleConfigBuilder } from 'tests/unit/common/visual-helper-toggle-config-builder';
import { VisualizationTogglePropsBuilder } from 'tests/unit/common/visualization-toggle-props-builder';
import { IMock, It, Mock, Times } from 'typemoq';
import {
    getMockComponentClassPropsForCall,
    mockReactComponents,
    useOriginalReactElements,
} from '../../../mock-helpers/mock-module-helpers';

jest.mock('common/components/visualization-toggle');
describe('AssessmentVisualizationEnabledToggle', () => {
    mockReactComponents([VisualizationToggle]);
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

            const testSubject = render(<AssessmentVisualizationEnabledToggle {...props} />);

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

            const testSubject = render(<AssessmentVisualizationEnabledToggle {...props} />);

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

            const testSubject = render(<AssessmentVisualizationEnabledToggle {...props} />);

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

            const testSubject = render(<AssessmentVisualizationEnabledToggle {...props} />);

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

            const testSubject = render(<AssessmentVisualizationEnabledToggle {...props} />);

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

            const testSubject = render(<AssessmentVisualizationEnabledToggle {...props} />);

            expectEnabledTextLayout(testSubject);

            const expectedToggleProps = getDefaultVisualizationTogglePropsBuilder()
                .with('checked', false)
                .with('disabled', false)
                .build();

            expectChildVisualizationToggleWith(expectedToggleProps, testSubject);
        });

        function expectEnabledTextLayout(testSubject: any): void {
            const visualHelperClass = 'visual-helper';
            const toggleDiv = testSubject.container.querySelector(`.${visualHelperClass}`);

            expect(toggleDiv).not.toBeNull();

            const textDiv = testSubject.container.querySelector(`.${visualHelperClass}-text`);

            expect(textDiv).not.toBeNull();
            expect(textDiv).toHaveTextContent(visualHelperText);
            expect(testSubject.container.querySelector('strong')).toBeFalsy();
        }

        function expectDisabledTextLayout(testSubject: any): void {
            const visualHelperClass = 'visual-helper';
            const toggleDiv = testSubject.container.querySelector(`.${visualHelperClass}`);

            expect(toggleDiv).not.toBeNull();

            const textDiv = testSubject.container.querySelector(`.${visualHelperClass}-text`);

            expect(textDiv).not.toBeNull();
            expect(textDiv).toHaveTextContent(visualHelperText);

            const noMatchesWarningClass = 'no-matching-elements';
            expect(testSubject.container.querySelector(`.${noMatchesWarningClass}`)).not.toBeNull();
        }
    });

    describe('toggle behavior', () => {
        it('enables all visualizations when none are shown', async () => {
            const props = new VisualHelperToggleConfigBuilder()
                .withToggleStepEnabled(true)
                .withToggleStepScanned(false)
                .withActionMessageCreator(actionMessageCreatorMock.object)
                .build();

            useOriginalReactElements('common/components/visualization-toggle', [
                'VisualizationToggle',
            ]);
            const wrapper = render(<AssessmentVisualizationEnabledToggle {...props} />);
            const button = wrapper.queryByRole('switch') as any;
            expect(button).toBeFalsy();
            const noMatchesWarningClass = 'no-matching-elements';
            expect(wrapper.container.querySelector(`.${noMatchesWarningClass}`)).not.toBeNull();
        });

        it('disables all visualizations when some are shown', async () => {
            const props = new VisualHelperToggleConfigBuilder()
                .withToggleStepEnabled(true)
                .withToggleStepScanned(false)
                .withActionMessageCreator(actionMessageCreatorMock.object)
                .withNonEmptyFilteredMap(true)
                .build();

            useOriginalReactElements('common/components/visualization-toggle', [
                'VisualizationToggle',
            ]);
            const wrapper = render(<AssessmentVisualizationEnabledToggle {...props} />);
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
            const button = wrapper.getByRole('switch');
            await userEvent.click(button);
            actionMessageCreatorMock.verifyAll();
        });
    });

    function expectChildVisualizationToggleWith(
        expectedProps: VisualizationToggleProps,
        testSubject: any,
    ): void {
        const visualizationToggleProp = getMockComponentClassPropsForCall(VisualizationToggle);

        expect(visualizationToggleProp).not.toBeNull();

        expect(visualizationToggleProp).toMatchObject(expectedProps);
    }

    function getDefaultVisualizationTogglePropsBuilder(): VisualizationTogglePropsBuilder {
        return new VisualizationTogglePropsBuilder()
            .with('visualizationName', visualHelperText)
            .with('className', 'visual-helper-toggle');
    }
});
