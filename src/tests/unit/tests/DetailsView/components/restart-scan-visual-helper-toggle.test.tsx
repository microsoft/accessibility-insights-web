// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { fireEvent, render, RenderResult } from '@testing-library/react';
import { VisualHelperToggle } from 'common/components/cards/visual-helper-toggle';
import { AssessmentActionMessageCreator } from 'DetailsView/actions/assessment-action-message-creator';
import { forEach } from 'lodash';
import * as React from 'react';
import {
    getMockComponentClassPropsForCall,
    mockReactComponents,
    useOriginalReactElements,
} from 'tests/unit/mock-helpers/mock-module-helpers';
import { IMock, Mock, Times } from 'typemoq';
import {
    VisualizationToggle,
    VisualizationToggleProps,
} from '../../../../../common/components/visualization-toggle';
import { visualHelperText } from '../../../../../DetailsView/components/base-visual-helper-toggle';
import { RestartScanVisualHelperToggle } from '../../../../../DetailsView/components/restart-scan-visual-helper-toggle';
import { VisualHelperToggleConfigBuilder } from '../../../common/visual-helper-toggle-config-builder';
import { VisualizationTogglePropsBuilder } from '../../../common/visualization-toggle-props-builder';

jest.mock('common/components/visualization-toggle');
jest.mock('common/components/cards/visual-helper-toggle');

describe('RestartScanVisualHelperToggleTest', () => {
    mockReactComponents([VisualizationToggle, VisualHelperToggle]);
    const stepKey = 'assessment-1-step-1';
    let assessmentActionMessageCreatorMock: IMock<AssessmentActionMessageCreator>;

    beforeEach(() => {
        assessmentActionMessageCreatorMock = Mock.ofType(AssessmentActionMessageCreator);
    });

    test('render', () => {
        const props = new VisualHelperToggleConfigBuilder()
            .withToggleStepEnabled(true)
            .withToggleStepScanned(false)
            .withActionMessageCreator(assessmentActionMessageCreatorMock.object)
            .build();

        const renderResult = render(<RestartScanVisualHelperToggle {...props} />);

        const visualHelperClass = 'visual-helper';
        const toggleDiv = renderResult.container.querySelector(`.${visualHelperClass}`);

        expect(toggleDiv).not.toBeNull();

        const textDiv = toggleDiv.querySelector(`.${visualHelperClass}-text`);

        expect(textDiv).not.toBeNull();

        const toggle = getMockComponentClassPropsForCall(VisualizationToggle);

        const expectedToggleProps = getDefaultVisualizationTogglePropsBuilder()
            .with('checked', true)
            .with('disabled', false)
            .build();

        assertVisualizationToggle(expectedToggleProps, renderResult);
        assertSnapshotMatch(renderResult);
    });

    test.each([true, false])('onClick: step enabled = %s', stepIsEnabled => {
        const props = new VisualHelperToggleConfigBuilder()
            .withToggleStepEnabled(stepIsEnabled)
            .withToggleStepScanned(false)
            .withActionMessageCreator(assessmentActionMessageCreatorMock.object)
            .build();

        useOriginalReactElements('../../../common/components/visualization-toggle', [
            'VisualizationToggle',
        ]);
        const renderResult = render(<RestartScanVisualHelperToggle {...props} />);
        assessmentActionMessageCreatorMock.reset();
        assessmentActionMessageCreatorMock
            .setup(acm => {
                return stepIsEnabled
                    ? acm.disableVisualHelper(
                          props.assessmentNavState.selectedTestType,
                          props.assessmentNavState.selectedTestSubview,
                      )
                    : acm.enableVisualHelper(props.assessmentNavState.selectedTestType, stepKey);
            })
            .verifiable(Times.once());

        const onClick = renderResult.getByRole('switch');
        fireEvent.click(onClick);

        assessmentActionMessageCreatorMock.verifyAll();
        assertSnapshotMatch(renderResult);
    });

    function assertVisualizationToggle(
        expectedProps: VisualizationToggleProps,
        renderResult: RenderResult,
    ): void {
        const visualizationToggle = renderResult.container.querySelector(
            'mock-VisualizationToggle',
        );
        expect(visualizationToggle).not.toBeNull();

        const actualProps = getMockComponentClassPropsForCall(VisualizationToggle);
        forEach(expectedProps, (value, key) => {
            expect(actualProps[key]).toBe(value);
        });
    }

    function assertSnapshotMatch(toggleWrapper: RenderResult): void {
        expect(toggleWrapper.asFragment()).toMatchSnapshot();
    }

    function getDefaultVisualizationTogglePropsBuilder(): VisualizationTogglePropsBuilder {
        return new VisualizationTogglePropsBuilder()
            .with('visualizationName', visualHelperText)
            .with('className', 'visual-helper-toggle');
    }
});
