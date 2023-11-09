// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render, RenderResult } from '@testing-library/react';
import { AutomatedChecksVisualizationToggle } from 'assessments/automated-checks/automated-checks-visualization-enabled-toggle';
import { AssessmentActionMessageCreator } from 'DetailsView/actions/assessment-action-message-creator';
import * as React from 'react';
import {
    getMockComponentClassPropsForCall,
    mockReactComponents,
} from 'tests/unit/mock-helpers/mock-module-helpers';
import { IMock, Mock } from 'typemoq';
import {
    VisualizationToggle,
    VisualizationToggleProps,
} from '../../../../../common/components/visualization-toggle';
import { visualHelperText } from '../../../../../DetailsView/components/base-visual-helper-toggle';
import { VisualHelperToggleConfigBuilder } from '../../../common/visual-helper-toggle-config-builder';
import { VisualizationTogglePropsBuilder } from '../../../common/visualization-toggle-props-builder';

jest.mock('common/components/visualization-toggle');
describe('AutomatedChecksVisualizationToggle', () => {
    mockReactComponents([VisualizationToggle]);
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

        const renderResult = render(<AutomatedChecksVisualizationToggle {...props} />);

        const visualHelperClass = 'visual-helper';
        const toggleDiv = renderResult.container.querySelector(`.${visualHelperClass}`);
        const textDiv = toggleDiv.querySelector(`.${visualHelperClass}-text`);
        const noMatchesWarningClass = 'no-matching-elements';

        expect(toggleDiv).not.toBeNull();
        expect(textDiv).not.toBeNull();
        expect(renderResult.container.querySelector(`.${noMatchesWarningClass}`)).not.toBeNull();

        const expectedToggleProps = getDefaultVisualizationTogglePropsBuilder()
            .with('checked', false)
            .with('disabled', true)
            .build();

        assertVisualizationToggle(expectedToggleProps);
        assertSnapshotMatch(renderResult);
    });

    it('render: toggle not disabled', () => {
        const props = new VisualHelperToggleConfigBuilder()
            .withToggleStepEnabled(true)
            .withToggleStepScanned(false)
            .withActionMessageCreator(assessmentActionMessageCreatorMock.object)
            .withNonEmptyFilteredMap()
            .build();

        const renderResult = render(<AutomatedChecksVisualizationToggle {...props} />);

        const visualHelperClass = 'visual-helper';
        const toggleDiv = renderResult.container.querySelector(`.${visualHelperClass}`);

        expect(toggleDiv).not.toBeNull();

        const textDiv = toggleDiv.querySelector(`.${visualHelperClass}-text`);

        expect(textDiv).not.toBeNull();

        expect(renderResult.container.querySelector('strong')).toBeNull();

        const expectedToggleProps = getDefaultVisualizationTogglePropsBuilder()
            .with('checked', false)
            .with('disabled', false)
            .build();

        assertVisualizationToggle(expectedToggleProps);
        assertSnapshotMatch(renderResult);
    });

    it('render: toggle disabled when there are no failing instances for automated checks', () => {
        const props = new VisualHelperToggleConfigBuilder()
            .withToggleStepEnabled(true)
            .withToggleStepScanned(false)
            .withActionMessageCreator(assessmentActionMessageCreatorMock.object)
            .withPassingFilteredMap()
            .build();

        const renderResult = render(<AutomatedChecksVisualizationToggle {...props} />);
        const visualHelperClass = 'visual-helper';
        const toggleDiv = renderResult.container.querySelector(`.${visualHelperClass}`);

        expect(toggleDiv).not.toBeNull();

        const textDiv = toggleDiv.querySelector(`.${visualHelperClass}-text`);

        expect(textDiv).not.toBeNull();

        const noMatchesWarningClass = 'no-matching-elements';

        expect(renderResult.container.querySelector(`.${noMatchesWarningClass}`)).not.toBeNull();

        const expectedToggleProps = getDefaultVisualizationTogglePropsBuilder()
            .with('checked', false)
            .with('disabled', true)
            .build();

        assertVisualizationToggle(expectedToggleProps);
        assertSnapshotMatch(renderResult);
    });

    function assertVisualizationToggle(expectedProps: VisualizationToggleProps): void {
        expect(VisualizationToggle).toBeCalled();

        const actualProps = getMockComponentClassPropsForCall(VisualizationToggle);

        expect(actualProps).toMatchObject(expectedProps);
    }

    function assertSnapshotMatch(wrapper: RenderResult): void {
        expect(wrapper.asFragment()).toMatchSnapshot();
    }

    function getDefaultVisualizationTogglePropsBuilder(): VisualizationTogglePropsBuilder {
        return new VisualizationTogglePropsBuilder()
            .with('visualizationName', visualHelperText)
            .with('className', 'visual-helper-toggle');
    }
});
