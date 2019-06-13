// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { Mock } from 'typemoq';

import {
    InstanceDetails,
    InstanceDetailsProps,
} from '../../../../../../../DetailsView/reports/components/report-sections/instance-details';
import { FixInstructionProcessor } from '../../../../../../../injected/fix-instruction-processor';

describe('InstanceDetails', () => {
    it('renders', () => {
        const fixInstructionProcessorMock = Mock.ofType(FixInstructionProcessor);

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
            all: [{ id: 'all', message: 'fix all of the following', data: null }],
            any: [{ id: 'any', message: 'fix any of the following', data: null }],
            none: [{ id: 'none', message: 'fix the following', data: null }],
            index: 0,
            fixInstructionProcessor: fixInstructionProcessorMock.object,
        };

        const wrapper = shallow(<InstanceDetails {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
