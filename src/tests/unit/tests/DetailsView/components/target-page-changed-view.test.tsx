// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { DisplayableVisualizationTypeData } from '../../../../../common/configs/visualization-configuration-factory';
import { VisualizationType } from '../../../../../common/types/visualization-type';
import { TargetPageChangedView, TargetPageChangedViewProps } from '../../../../../DetailsView/components/target-page-changed-view';

type RenderTestCases = {
    title?: string;
    toggleLabel?: string;
};

describe('TargetPageChangedView', () => {
    describe('renders', () => {
        const clickHandlerStub: () => void = () => {};
        const testCases: RenderTestCases[] = [
            {},
            { title: 'title' },
            { toggleLabel: 'toggle-label' },
            { title: 'title', toggleLabel: 'toggle-label' },
        ];

        it.each(testCases)('case %o', testCase => {
            const { title = '', toggleLabel = '' } = testCase;

            const visualizationType = VisualizationType.Landmarks;
            const displayableData = { title, toggleLabel } as DisplayableVisualizationTypeData;

            const props: TargetPageChangedViewProps = {
                visualizationType,
                displayableData,
                toggleClickHandler: clickHandlerStub,
            };

            const wrapped = shallow(<TargetPageChangedView {...props} />);

            expect(wrapped.getElement()).toMatchSnapshot();
        });
    });
});
