// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { ILinkProps, Link } from 'office-ui-fabric-react/lib/Link';
import * as React from 'react';

import { NewTabLink } from '../../../../../common/components/new-tab-link';

describe(NewTabLink, () => {
    test('render content with custom className', () => {
        const props: ILinkProps = {
            href: 'test',
            className: 'custom-class',
        };

        const wrapper = shallow(<NewTabLink {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test('render content without custom className', () => {
        const props: ILinkProps = {
            href: 'test',
        };

        const wrapper = shallow(<NewTabLink {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
