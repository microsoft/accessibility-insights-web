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
        const failureSummary = `
            Fix all of the following:
            Element is in tab order and does not have accessible text
        
            Fix any of the following:
            Element has a value attribute and the value attribute is empty
            Element has no value attribute or the value attribute is empty
            Element does not have inner text that is visible to screen readers
            aria-label attribute does not exist or is empty
            aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
            Element's default semantics were not overridden with role="presentation"
            Element's default semantics were not overridden with role="none"
            Element has no title attribute or the title attribute is empty
        `;
        const props: InstanceDetailsProps = {
            target: ['<html>'],
            html: '<html>',
            failureSummary,
            index: 0,
        };

        const wrapper = shallow(<InstanceDetails {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
