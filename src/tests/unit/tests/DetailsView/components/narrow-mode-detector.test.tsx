// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DetailsViewContent } from 'DetailsView/components/details-view-content';
import {
    NarrowModeDetector,
    NarrowModeDetectorProps,
} from 'DetailsView/components/narrow-mode-detector';
import { shallow } from 'enzyme';
import * as React from 'react';
import ReactResizeDetector from 'react-resize-detector';

describe(NarrowModeDetector, () => {
    describe('render', () => {
        it('renders ReactResizeDetector ', () => {
            const props: NarrowModeDetectorProps = {
                isNarrowModeEnabled: false,
                Component: DetailsViewContent,
                childrenProps: null,
            };
            const wrapper = shallow(<NarrowModeDetector {...props} />);
            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it('renders child component properly', () => {
            const props: NarrowModeDetectorProps = {
                isNarrowModeEnabled: true,
                Component: DetailsViewContent,
                childrenProps: null,
            };
            const wrapper = shallow(<NarrowModeDetector {...props} />);
            const renderFunc = wrapper.find(ReactResizeDetector).props().render;

            expect(renderFunc({ width: 10, height: 0 })).toMatchSnapshot(
                'narrow mode should be true',
            );
            expect(renderFunc({ width: 1000, height: 0 })).toMatchSnapshot(
                'narrow mode should be false',
            );
        });
    });
});
