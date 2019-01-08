// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { ILinkProps, Link } from 'office-ui-fabric-react/lib/Link';
import * as React from 'react';

import { NewTabLink } from '../../../../../common/components/new-tab-link';

describe('NewTabLinkTest', () => {
    test('render content', () => {
        const props: ILinkProps = {
            href: 'test',
        };

        const wrapper = shallow(<NewTabLink {...props} />);

        const linkProps = { ...props, target: '_blank' };
        const link = wrapper.find(linkProps);

        expect(link.exists()).toBe(true);
        expect(link.type()).toBe(Link);
    });
});
