// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AutomatedChecksView } from 'electron/views/automated-checks/components/automated-checks-view';
import { shallow } from 'enzyme';
import * as React from 'react';

describe(AutomatedChecksView, () => {
    it('renders the automated checks view', () => {
        const wrapped = shallow(<AutomatedChecksView />);
        expect(wrapped.getElement()).toMatchSnapshot('automated checks view');
    });
});
