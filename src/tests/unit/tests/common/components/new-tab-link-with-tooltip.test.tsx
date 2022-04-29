// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NewTabLinkWithTooltip } from 'common/components/new-tab-link-with-tooltip';
import { shallow } from 'enzyme';
import * as React from 'react';

describe(NewTabLinkWithTooltip.displayName, () => {
    const props = {
        href: 'test',
        tooltipContent: 'tooltip text',
    };

    it('renders with tooltip content', () => {
        const wrapper = shallow(<NewTabLinkWithTooltip {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renders with null tooltip content', () => {
        const testProps = {
            ...props,
            tooltipContent: undefined,
        };

        const wrapper = shallow(<NewTabLinkWithTooltip {...testProps} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('handles children', () => {
        const wrapper = shallow(
            <NewTabLinkWithTooltip {...props}>link text</NewTabLinkWithTooltip>,
        );

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
