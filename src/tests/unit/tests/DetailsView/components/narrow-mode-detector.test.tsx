// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DetailsViewContent } from 'DetailsView/components/details-view-content';
import {
    getNarrowModeComponentWrapper,
    NarrowModeDetector,
    NarrowModeDetectorProps,
} from 'DetailsView/components/narrow-mode-detector';
import { shallow } from 'enzyme';
import * as React from 'react';

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

        it('renders child component properly when narrow mode is enabled', () => {
            const props: NarrowModeDetectorProps = {
                isNarrowModeEnabled: true,
                Component: DetailsViewContent,
                childrenProps: null,
            };
            const renderFunc = getNarrowModeComponentWrapper(props);

            expect(renderFunc({ width: 10, height: 0 })).toMatchSnapshot(
                'narrow mode should be true',
            );
            expect(renderFunc({ width: 1000, height: 0 })).toMatchSnapshot(
                'narrow mode should be false',
            );
        });

        it('renders child component properly when narrow mode is disabled', () => {
            const props: NarrowModeDetectorProps = {
                isNarrowModeEnabled: false,
                Component: DetailsViewContent,
                childrenProps: null,
            };
            const renderFunc = getNarrowModeComponentWrapper(props);

            expect(renderFunc({ width: 10, height: 0 })).toMatchSnapshot(
                'narrow mode should be false',
            );
        });
    });
});
