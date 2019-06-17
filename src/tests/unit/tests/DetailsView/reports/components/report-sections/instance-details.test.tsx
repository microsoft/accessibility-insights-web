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
