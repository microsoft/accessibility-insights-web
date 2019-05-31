// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { Footer } from '../../../../../../../DetailsView/reports/components/report-sections/footer';

describe('Footer', () => {
    it('renders', () => {
        const wrapper = shallow(<Footer />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
