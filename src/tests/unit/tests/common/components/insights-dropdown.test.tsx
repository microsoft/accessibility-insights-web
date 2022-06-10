// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { IDropdownOption } from '@fluentui/react';
import { InsightsDropdown, InsightsDropdownProps } from 'common/components/insights-dropdown';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('InsightsDropdown', () => {
    const options: IDropdownOption[] = [
        {
            key: 'key1',
            text: 'Item 1',
        },
        {
            key: 'key2',
            text: 'Item 2',
            ariaLabel: 'Existing aria label',
        },
    ];

    it('renders with no item selected', () => {
        const props: InsightsDropdownProps = {
            options,
            selectedKey: null,
            placeHolder: 'placeholder',
        };
        const wrapper = shallow(<InsightsDropdown {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('adds aria-label for selected item with no label', () => {
        const props: InsightsDropdownProps = {
            options,
            selectedKey: 'key1',
            placeHolder: 'placeholder',
        };
        const wrapper = shallow(<InsightsDropdown {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('modifies aria-label for selected item with a label', () => {
        const props: InsightsDropdownProps = {
            options,
            selectedKey: 'key2',
            placeHolder: 'placeholder',
        };
        const wrapper = shallow(<InsightsDropdown {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
