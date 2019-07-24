// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { DisplayableVisualizationTypeData } from '../../../../../common/configs/visualization-configuration-factory';
import { VisualizationType } from '../../../../../common/types/visualization-type';
import { TargetPageChangedView, TargetPageChangedViewProps } from '../../../../../DetailsView/components/target-page-changed-view';

describe('TargetPageChangedView', () => {
    it('renders without optional subtitle', () => {
        testRenderWithOptionalSubtitle(undefined);
    });

    it('renders with optional subtitle', () => {
        testRenderWithOptionalSubtitle(<span>test subtitle content</span>);
    });

    function testRenderWithOptionalSubtitle(subtitle?: JSX.Element): void {
        const visualizationType = VisualizationType.Landmarks;
        const clickHandlerStub: () => void = () => {};
        const displayableData = {
            title: 'test title',
            toggleLabel: 'test toggle label',
            subtitle,
        } as DisplayableVisualizationTypeData;

        const props: TargetPageChangedViewProps = {
            visualizationType,
            displayableData,
            toggleClickHandler: clickHandlerStub,
        };

        const wrapped = shallow(<TargetPageChangedView {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    }
});
