// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { RuleContent, RuleContentProps } from '../../../../../../DetailsView/components/cards/rule-content';

describe('RuleContent', () => {
    it('renders', () => {
        const props = {
            rule: {
                id: 'test-id',
            },
        } as RuleContentProps;

        const wrapper = shallow(<RuleContent {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
