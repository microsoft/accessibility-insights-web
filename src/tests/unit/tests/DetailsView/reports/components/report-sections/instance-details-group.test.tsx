// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import {
    InstanceDetailsGroup,
    InstanceDetailsGroupProps,
} from '../../../../../../../DetailsView/reports/components/report-sections/instance-details-group';
import { DecoratedAxeNodeResult } from '../../../../../../../injected/scanner-utils';

describe('InstanceDetailsGroup', () => {
    it('renders', () => {
        const nodes: DecoratedAxeNodeResult[] = [
            {
                selector: '<html>',
                snippet: '<html>',
                failureSummary: 'fix the error on html',
            } as DecoratedAxeNodeResult,
            {
                selector: '<body>',
                snippet: '<body >',
                failureSummary: 'fix the error on body',
            } as DecoratedAxeNodeResult,
        ];

        const props: InstanceDetailsGroupProps = {
            nodeResults: nodes,
        };

        const wrapper = shallow(<InstanceDetailsGroup {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
