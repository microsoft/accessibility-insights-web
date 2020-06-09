// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlags } from 'common/feature-flags';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { DetailsViewContent } from 'DetailsView/components/details-view-content';
import {
    DetailsViewContentWithLocalState,
    DetailsViewContentWithLocalStateProps,
} from 'DetailsView/components/details-view-content-with-local-state';
import { mount, shallow } from 'enzyme';
import * as React from 'react';
import ReactResizeDetector from 'react-resize-detector';
import { NamedFC } from 'common/react/named-fc';

describe(DetailsViewContentWithLocalState, () => {
    test('render ReactResizeDetector', () => {
        const props = {
            storeState: {
                featureFlagStoreData: { [FeatureFlags.reflowUI]: false },
            } as any,
        } as DetailsViewContentWithLocalStateProps;
        const wrapper = shallow(<DetailsViewContentWithLocalState {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test('render narrow mode', () => {
        const props = {
            storeState: {
                featureFlagStoreData: { [FeatureFlags.reflowUI]: true },
            } as any,
        } as DetailsViewContentWithLocalStateProps;
        const wrapper = shallow(<DetailsViewContentWithLocalState {...props} />);
        const renderFunc = wrapper.find(ReactResizeDetector).props().render;

        const content = renderFunc({ width: 10, height: 10 });

        expect(content).toMatchSnapshot();
    });

    test('render normal mode', () => {
        const props = {
            storeState: {
                featureFlagStoreData: { [FeatureFlags.reflowUI]: true },
            } as any,
        } as DetailsViewContentWithLocalStateProps;
        const wrapper = shallow(<DetailsViewContentWithLocalState {...props} />);
        const renderFunc = wrapper.find(ReactResizeDetector).props().render;

        const content = renderFunc({ width: 1000, height: 10 });

        expect(content).toMatchSnapshot();
    });

    test('verify nav state change', () => {
        const props = {
            storeState: {
                featureFlagStoreData: { [FeatureFlags.reflowUI]: true },
            } as any,
        } as DetailsViewContentWithLocalStateProps;
        const wrapper = shallow(<DetailsViewContentWithLocalState {...props} />);
        const RenderFunc: ({ width, height }) => JSX.Element = wrapper
            .find(ReactResizeDetector)
            .props().render as ({ width, height }) => JSX.Element;
        const contentWrapper = shallow(<RenderFunc width={1000} height={10} />);
        const setNavOpen = contentWrapper.find(DetailsViewContent).props().setSideNavOpen;

        expect(wrapper.state('isSideNavOpen')).toBe(false);

        setNavOpen(true);

        expect(wrapper.state('isSideNavOpen')).toBe(true);
    });
});
