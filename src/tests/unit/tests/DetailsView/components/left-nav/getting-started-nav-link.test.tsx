// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { GettingStartedNavLink } from 'DetailsView/components/left-nav/getting-started-nav-link';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('GettingStartedNavLink', () => {
    test('renders', () => {
        const renderedTestObject = shallow(<GettingStartedNavLink />);
        expect(renderedTestObject.getElement()).toMatchSnapshot();
    });
});
