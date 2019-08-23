// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { RuleContentV2, RuleContentV2Props } from '../../../../../../DetailsView/components/cards/rule-content-v2';

describe('RuleContentV2', () => {
    it('renders', () => {
        const props = {
            rule: {
                id: 'test-id',
            },
        } as RuleContentV2Props;

        const wrapper = shallow(<RuleContentV2 {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
