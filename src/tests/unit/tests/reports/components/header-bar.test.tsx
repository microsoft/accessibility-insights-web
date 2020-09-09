// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { HeaderBar } from 'reports/components/header-bar';

describe('HeaderBar', () => {
    it('renders', () => {
        const headerText = 'header text';
        const wrapper = shallow(<HeaderBar headerText={headerText} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
