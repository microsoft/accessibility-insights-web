// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DetailsViewContent } from 'DetailsView/components/details-view-content';
import {
    DetailsViewContentWithLocalState,
    DetailsViewContentWithLocalStateProps,
} from 'DetailsView/components/details-view-content-with-local-state';
import { shallow } from 'enzyme';
import * as React from 'react';

describe(DetailsViewContentWithLocalState, () => {
    test('render', () => {
        const props = {} as DetailsViewContentWithLocalStateProps;
        const wrapper = shallow(<DetailsViewContentWithLocalState {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    test('verify state change', () => {
        const props = {} as DetailsViewContentWithLocalStateProps;
        const wrapper = shallow(<DetailsViewContentWithLocalState {...props} />);
        const contentComponent = wrapper.find(DetailsViewContent);
        const setNavOpen = contentComponent.props().setSideNavOpen;

        expect(wrapper.find(DetailsViewContent).props().isSideNavOpen).toBe(false);

        setNavOpen(true);

        expect(wrapper.find(DetailsViewContent).props().isSideNavOpen).toBe(true);
    });
});
