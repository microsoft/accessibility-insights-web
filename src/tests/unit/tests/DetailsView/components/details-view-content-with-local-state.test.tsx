// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlags } from 'common/feature-flags';
import { DetailsViewContent } from 'DetailsView/components/details-view-content';
import {
    DetailsViewContentWithLocalState,
    DetailsViewContentWithLocalStateProps,
} from 'DetailsView/components/details-view-content-with-local-state';
import { NarrowModeDetector } from 'DetailsView/components/narrow-mode-detector';
import { shallow } from 'enzyme';
import * as React from 'react';

describe(DetailsViewContentWithLocalState, () => {
    test('render', () => {
        const props = {
            storeState: {
                featureFlagStoreData: { [FeatureFlags.reflowUI]: false },
            } as any,
        } as DetailsViewContentWithLocalStateProps;
        const wrapper = shallow(<DetailsViewContentWithLocalState {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test('verify nav state change', () => {
        const props = {
            storeState: {
                featureFlagStoreData: { [FeatureFlags.reflowUI]: true },
            } as any,
        } as DetailsViewContentWithLocalStateProps;
        const wrapper = shallow(<DetailsViewContentWithLocalState {...props} />);
        const setNavOpen = wrapper.find(DetailsViewContent).props().setSideNavOpen;

        expect(wrapper.state('isSideNavOpen')).toBe(false);

        setNavOpen(true);

        expect(wrapper.state('isSideNavOpen')).toBe(true);
    });

    test('verify narrow mode state change', () => {
        const props = {
            storeState: {
                featureFlagStoreData: { [FeatureFlags.reflowUI]: true },
            } as any,
        } as DetailsViewContentWithLocalStateProps;
        const wrapper = shallow(<DetailsViewContentWithLocalState {...props} />);
        const setNarrowMode = wrapper.find(NarrowModeDetector).props().setNarrowMode;

        expect(wrapper.state('isNarrowMode')).toBe(false);

        setNarrowMode(true);

        expect(wrapper.state('isNarrowMode')).toBe(true);
    });
});
