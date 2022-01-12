// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { ILinkProps } from '@fluentui/react';
import * as React from 'react';

import { NewTabLink } from '../../../../../common/components/new-tab-link';

describe('NewTabLink', () => {
    it('renders content with custom className', () => {
        const props: ILinkProps = {
            href: 'test',
            className: 'custom-class',
        };

        const wrapper = shallow(<NewTabLink {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renders content without custom className', () => {
        const props: ILinkProps = {
            href: 'test',
        };

        const wrapper = shallow(<NewTabLink {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('handles children', () => {
        const props: ILinkProps = {
            href: 'test',
        };

        const wrapper = shallow(<NewTabLink {...props}>link text</NewTabLink>);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
