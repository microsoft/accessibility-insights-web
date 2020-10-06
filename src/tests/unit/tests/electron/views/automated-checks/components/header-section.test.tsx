// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    HeaderSection,
    HeaderSectionProps,
} from 'electron/views/automated-checks/components/header-section';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('HeaderSection', () => {
    const props: HeaderSectionProps = {
        title: 'test-title',
        description: <>test-description</>,
    };
    it('renders', () => {
        const wrapper = shallow(<HeaderSection {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
