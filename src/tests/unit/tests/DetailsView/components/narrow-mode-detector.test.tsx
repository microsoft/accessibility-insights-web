// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    NarrowModeDetector,
    NarrowModeDetectorProps,
} from 'DetailsView/components/narrow-mode-detector';
import { shallow } from 'enzyme';
import * as React from 'react';
import ReactResizeDetector from 'react-resize-detector';
import { Mock, Times } from 'typemoq';

describe(NarrowModeDetector, () => {
    describe('render', () => {
        it('renders null when narrow mode is not enabled', () => {
            const props: NarrowModeDetectorProps = {
                isNarrowModeEnabled: false,
                setNarrowMode: null,
            };
            const wrapper = shallow(<NarrowModeDetector {...props} />);
            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it('renders ReactResizeDetector ', () => {
            const props: NarrowModeDetectorProps = {
                isNarrowModeEnabled: true,
                setNarrowMode: null,
            };
            const wrapper = shallow(<NarrowModeDetector {...props} />);
            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it('updates narrow mode', () => {
            const setNarrowModeMock = Mock.ofInstance((_: boolean) => {});
            setNarrowModeMock.setup(sm => sm(true)).verifiable(Times.once());
            setNarrowModeMock.setup(sm => sm(false)).verifiable(Times.once());
            const props: NarrowModeDetectorProps = {
                isNarrowModeEnabled: true,
                setNarrowMode: setNarrowModeMock.object,
            };
            const wrapper = shallow(<NarrowModeDetector {...props} />);
            const renderFunc = wrapper.find(ReactResizeDetector).props().render;

            renderFunc({ width: 10, height: 0 });
            renderFunc({ width: 1000, height: 0 });

            setNarrowModeMock.verifyAll();
        });
    });
});
