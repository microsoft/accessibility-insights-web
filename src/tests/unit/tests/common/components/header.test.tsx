// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { Header, HeaderDeps } from 'common/components/header';

describe('Header', () => {
    it('renders per snapshot', () => {
        const deps = {
            textContent: {
                applicationTitle: 'THE_APPLICATION_TITLE',
            },
        } as HeaderDeps;
        const wrapper = shallow(<Header deps={deps} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
