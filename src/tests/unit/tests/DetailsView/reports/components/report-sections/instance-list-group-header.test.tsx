// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { GetGuidanceTagsFromGuidanceLinks } from '../../../../../../../common/get-guidance-tags-from-guidance-links';
import {
    InstanceListGroupHeader,
    InstanceListGroupHeaderProps,
} from '../../../../../../../DetailsView/reports/components/report-sections/instance-list-group-header';
import { InstanceOutcomeType } from '../../../../../../../DetailsView/reports/components/report-sections/outcome-summary-bar';
import { RuleResult } from '../../../../../../../scanner/iruleresults';

describe('InstanceListGroupHeaderTest', () => {
    const guidanceTagsStub: GetGuidanceTagsFromGuidanceLinks = () => [{ id: '1', displayText: 'tag-1' }];

    const getSampleRuleResult = () => {
        const ruleResult: RuleResult = {
            id: 'image-alt',
            nodes: [{} as AxeNodeResult],
            description: 'rule description',
            helpUrl: 'help url',
        };
        return ruleResult;
    };

    test.each(['pass', 'fail', 'incomplete'])('render for %s instances', (outcome: InstanceOutcomeType) => {
        const props: InstanceListGroupHeaderProps = {
            ruleResult: getSampleRuleResult(),
            outcomeType: outcome,
            deps: {
                getGuidanceTagsFromGuidanceLinks: guidanceTagsStub,
            },
        };

        const wrapper = shallow(<InstanceListGroupHeader {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test.each(['pass', 'fail', 'incomplete'])('render for %s instances and handles aria-level', (outcome: InstanceOutcomeType) => {
        const props: InstanceListGroupHeaderProps = {
            ruleResult: getSampleRuleResult(),
            outcomeType: outcome,
            ariaLevel: 2,
            deps: {
                getGuidanceTagsFromGuidanceLinks: guidanceTagsStub,
            },
        };
        const wrapper = shallow(<InstanceListGroupHeader {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
