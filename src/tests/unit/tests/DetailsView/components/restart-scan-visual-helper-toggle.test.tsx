// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow, ShallowWrapper } from 'enzyme';
import { forEach } from 'lodash';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';
import {
    VisualizationToggle,
    VisualizationToggleProps,
} from '../../../../../common/components/visualization-toggle';
import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import { visualHelperText } from '../../../../../DetailsView/components/base-visual-helper-toggle';
import { RestartScanVisualHelperToggle } from '../../../../../DetailsView/components/restart-scan-visual-helper-toggle';
import { VisualHelperToggleConfigBuilder } from '../../../common/visual-helper-toggle-config-builder';
import { VisualizationTogglePropsBuilder } from '../../../common/visualization-toggle-props-builder';

describe('RestartScanVisualHelperToggleTest', () => {
    const stepKey = 'assessment-1-step-1';
    let detailsViewActionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;

    beforeEach(() => {
        detailsViewActionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
    });

    test('render', () => {
        const props = new VisualHelperToggleConfigBuilder()
            .withToggleStepEnabled(true)
            .withToggleStepScanned(false)
            .withActionMessageCreator(detailsViewActionMessageCreatorMock.object)
            .build();

        const wrapper = shallow(<RestartScanVisualHelperToggle {...props} />);

        const visualHelperClass = 'visual-helper';
        const toggleDiv = wrapper.find(`.${visualHelperClass}`);

        expect(toggleDiv.exists()).toBe(true);

        const textDiv = toggleDiv.find(`.${visualHelperClass}-text`);

        expect(textDiv.exists()).toBe(true);

        const toggle = wrapper.find(VisualizationToggle);

        const expectedToggleProps = getDefaultVisualizationTogglePropsBuilder()
            .with('checked', true)
            .with('disabled', false)
            .build();

        assertVisualizationToggle(expectedToggleProps, toggle);
        assertSnapshotMatch(wrapper);
    });

    test.each([true, false])('onClick: step enabled = %s', stepIsEnabled => {
        const props = new VisualHelperToggleConfigBuilder()
            .withToggleStepEnabled(stepIsEnabled)
            .withToggleStepScanned(false)
            .withActionMessageCreator(detailsViewActionMessageCreatorMock.object)
            .build();
        const wrapper = shallow(<RestartScanVisualHelperToggle {...props} />);
        detailsViewActionMessageCreatorMock.reset();
        detailsViewActionMessageCreatorMock
            .setup(acm => {
                return stepIsEnabled
                    ? acm.disableVisualHelper(
                          props.assessmentNavState.selectedTestType,
                          props.assessmentNavState.selectedTestSubview,
                      )
                    : acm.enableVisualHelper(props.assessmentNavState.selectedTestType, stepKey);
            })
            .verifiable(Times.once());

        wrapper.find(VisualizationToggle).simulate('click');

        detailsViewActionMessageCreatorMock.verifyAll();
        assertSnapshotMatch(wrapper);
    });

    function assertVisualizationToggle(
        expectedProps: VisualizationToggleProps,
        visualizationToggle: ShallowWrapper<VisualizationToggleProps>,
    ): void {
        expect(visualizationToggle.exists()).toBe(true);

        const actualProps = visualizationToggle.props();

        forEach(expectedProps, (value, key) => {
            expect(actualProps[key]).toBe(value);
        });
    }

    function assertSnapshotMatch(toggleWrapper: ShallowWrapper): void {
        expect(toggleWrapper.getElement()).toMatchSnapshot();
    }

    function getDefaultVisualizationTogglePropsBuilder(): VisualizationTogglePropsBuilder {
        return new VisualizationTogglePropsBuilder()
            .with('visualizationName', visualHelperText)
            .with('className', 'visual-helper-toggle');
    }
});
