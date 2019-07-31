// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { RuleResult } from 'scanner/iruleresults';
import {
    RuleResources,
    RuleResourcesDeps,
    RuleResourcesProps,
} from 'reports/components/report-sections/rule-resources';

describe('RuleResources', () => {
    it('renders', () => {
        const rule: RuleResult = {
            id: 'test-rule-id',
            helpUrl: 'test-help-url',
            guidanceLinks: [],
        } as RuleResult;

        const props: RuleResourcesProps = {
            rule,
            deps: {} as RuleResourcesDeps,
        };

        const wrapper = shallow(<RuleResources {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
