// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Scanning } from 'electron/views/automated-checks/components/scanning';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('Scanning', () => {
    it('renders', () => {
        const wrapped = shallow(<Scanning />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
