// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { RuleDetailsGroup } from '../../../../../../../DetailsView/reports/components/report-sections/rule-details-group';
import { RuleResult } from '../../../../../../../scanner/iruleresults';

describe('RuleDetailsGroup', () => {
    it('renders', () => {
        const rules = [{} as RuleResult, {} as RuleResult, {} as RuleResult];

        const wrapped = shallow(<RuleDetailsGroup rules={rules} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
