// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import {
    getNarrowModeComponentWrapper,
    NarrowModeDetector,
    NarrowModeDetectorProps,
    NarrowModeStatus,
    narrowModeThresholds,
} from 'DetailsView/components/narrow-mode-detector';
import { shallow } from 'enzyme';
import * as React from 'react';

const TestComponent = NamedFC<{ narrowModeStatus: NarrowModeStatus }>('TestComponent', props => {
    return <h1>Test component</h1>;
});

describe(NarrowModeDetector, () => {
    describe('render', () => {
        it('renders ReactResizeDetector ', () => {
            const props: NarrowModeDetectorProps = {
                isNarrowModeEnabled: false,
                Component: TestComponent,
                childrenProps: null,
            };
            const wrapper = shallow(<NarrowModeDetector {...props} />);
            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it('renders child component properly when header is collapsed', () => {
            const props: NarrowModeDetectorProps = {
                isNarrowModeEnabled: true,
                Component: TestComponent,
                childrenProps: null,
            };
            const expectedChildProps = {
                narrowModeStatus: {
                    isHeaderAndNavCollapsed: true,
                    isCommandBarCollapsed: true,
                },
            };
            const rendered = renderChildComponent(props, {
                width: narrowModeThresholds.collapseHeaderAndNavThreshold - 1,
                height: 0,
            });

            expect(rendered.props).toEqual(expectedChildProps);
        });

        it('renders child component properly when command bar is collapsed', () => {
            const props: NarrowModeDetectorProps = {
                isNarrowModeEnabled: true,
                Component: TestComponent,
                childrenProps: null,
            };
            const expectedChildProps = {
                narrowModeStatus: {
                    isHeaderAndNavCollapsed: false,
                    isCommandBarCollapsed: true,
                },
            };
            const rendered = renderChildComponent(props, {
                width: narrowModeThresholds.collapseCommandBarThreshold - 1,
                height: 0,
            });

            expect(rendered.props).toEqual(expectedChildProps);
        });

        it('renders child component properly when nothing is collapsed', () => {
            const props: NarrowModeDetectorProps = {
                isNarrowModeEnabled: true,
                Component: TestComponent,
                childrenProps: null,
            };
            const expectedChildProps = {
                narrowModeStatus: {
                    isHeaderAndNavCollapsed: false,
                    isCommandBarCollapsed: false,
                },
            };
            const rendered = renderChildComponent(props, {
                width: narrowModeThresholds.collapseCommandBarThreshold + 1,
                height: 0,
            });

            expect(rendered.props).toEqual(expectedChildProps);
        });

        it('renders child component properly when narrow mode is disabled', () => {
            const props: NarrowModeDetectorProps = {
                isNarrowModeEnabled: false,
                Component: TestComponent,
                childrenProps: null,
            };
            const renderFunc = getNarrowModeComponentWrapper(props);

            expect(
                renderFunc({
                    width: narrowModeThresholds.collapseHeaderAndNavThreshold - 1,
                    height: 0,
                }),
            ).toMatchSnapshot('All narrow mode status values should be false');
        });
    });

    function renderChildComponent(
        props: NarrowModeDetectorProps,
        dimensions: { width: number; height: number },
    ): JSX.Element {
        const renderFunc = getNarrowModeComponentWrapper(props);
        return renderFunc(dimensions);
    }
});
