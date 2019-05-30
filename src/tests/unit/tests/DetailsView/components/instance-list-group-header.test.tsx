// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { InstanceListGroupHeader } from '../../../../../DetailsView/reports/components/instance-list-group-header';
import { OutcomeType } from '../../../../../DetailsView/reports/components/outcome-type';
import { RuleResult } from '../../../../../scanner/iruleresults';

describe('InstanceListGroupHeaderTest', () => {
    const getSampleRuleResult = () => {
        const ruleResult: RuleResult = {
            id: 'ruleid',
            nodes: [{} as AxeNodeResult],
            description: 'rule description',
            helpUrl: 'help url',
        };
        return ruleResult;
    };

    test.each(['pass', 'fail'])('render for %s instances', (outcome: OutcomeType) => {
        const wrapper = shallow(<InstanceListGroupHeader ruleResult={getSampleRuleResult()} outcome={outcome} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
