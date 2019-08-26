// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import {
    RuleResourcesV2,
    RuleResourcesV2Deps,
    RuleResourcesV2Props,
} from '../../../../../../DetailsView/components/cards/rule-resources-v2';
import { exampleUnifiedRuleResult } from './sample-view-model-data';

describe('RuleResourcesV2', () => {
    it('renders', () => {
        const rule = exampleUnifiedRuleResult;

        const props: RuleResourcesV2Props = {
            rule,
            deps: {} as RuleResourcesV2Deps,
        };

        const wrapper = shallow(<RuleResourcesV2 {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
