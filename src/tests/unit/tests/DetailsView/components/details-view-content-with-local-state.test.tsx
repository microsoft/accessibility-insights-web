// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlags } from 'common/feature-flags';
import { DetailsViewContentProps } from 'DetailsView/components/details-view-content';
import {
    DetailsViewContentWithLocalState,
    DetailsViewContentWithLocalStateProps,
} from 'DetailsView/components/details-view-content-with-local-state';
import { NarrowModeDetectorProps } from 'DetailsView/components/narrow-mode-detector';
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
        const setNavOpen = (wrapper.childAt(0).props() as NarrowModeDetectorProps<
            DetailsViewContentProps
        >).childrenProps.setSideNavOpen;

        expect(wrapper.state('isSideNavOpen')).toBe(false);

        setNavOpen(true);

        expect(wrapper.state('isSideNavOpen')).toBe(true);
    });
});
