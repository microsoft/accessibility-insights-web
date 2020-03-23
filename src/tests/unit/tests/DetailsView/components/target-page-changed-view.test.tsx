// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DisplayableVisualizationTypeData } from 'common/configs/visualization-configuration-factory';
import { VisualizationType } from 'common/types/visualization-type';
import {
    TargetPageChangedView,
    TargetPageChangedViewProps,
} from 'DetailsView/components/target-page-changed-view';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('TargetPageChangedView', () => {
    it.each`
        subtitle                   | isCardsUIEnabled
        ${undefined}               | ${true}
        ${undefined}               | ${false}
        ${'test subtitle content'} | ${false}
    `(
        'renders with subtitle=$subtitle and feature flag= $isCardsUIEnabled',
        ({ subtitle, isCardsUIEnabled }) => {
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
        },
    );
});
