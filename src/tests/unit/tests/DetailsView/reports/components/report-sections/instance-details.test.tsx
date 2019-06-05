// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { shallow } from 'enzyme';
import {
    InstanceDetails,
    InstanceDetailsProps,
} from '../../../../../../../DetailsView/reports/components/report-sections/instance-details';

describe('InstanceDetails', () => {
    it('renders', () => {
        const props: InstanceDetailsProps = {
            selector: '<html>',
            snippet: '<html>',
            failureSummary: 'fix the error',
            index: 0,
        };

        const wrapper = shallow(<InstanceDetails {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
