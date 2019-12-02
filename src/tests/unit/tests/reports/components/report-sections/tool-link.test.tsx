// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { ToolLink } from 'reports/components/report-sections/tool-link';

describe('ToolLink', () => {
    it('renders', () => {
        const wrapper = shallow(<ToolLink />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
