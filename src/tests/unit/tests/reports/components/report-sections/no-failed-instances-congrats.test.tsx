// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { shallow } from 'enzyme';
import { NoFailedInstancesCongrats } from 'reports/components/report-sections/no-failed-instances-congrats';

describe('NoFailedInstancesCongrats', () => {
    it('renders', () => {
        const wrapper = shallow(<NoFailedInstancesCongrats />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
