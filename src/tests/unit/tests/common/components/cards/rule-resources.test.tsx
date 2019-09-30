// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { RuleResources, RuleResourcesDeps, RuleResourcesProps } from 'common/components/cards/rule-resources';
import { shallow } from 'enzyme';
import * as React from 'react';

import { exampleUnifiedRuleResult } from './sample-view-model-data';

describe('RuleResources', () => {
    it('renders', () => {
        const rule = exampleUnifiedRuleResult;

        const props: RuleResourcesProps = {
            rule,
            deps: {} as RuleResourcesDeps,
        };

        const wrapper = shallow(<RuleResources {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
