// Copyright (c) Microsoft Corporation. All rights reserved.

import { TabStopsRequirementInstancesCollapsibleContent } from 'DetailsView/tab-stops-requirement-instances-collapsible-content';
import { shallow } from 'enzyme';
import * as React from 'react';

// Licensed under the MIT License.
describe('TabStopsRequirementInstancesCollapsibleContent', () => {
    const props = {
        instances: [{ id: 'test-id', description: 'test-description' }],
    };
    it('renders', () => {
        const wrapper = shallow(<TabStopsRequirementInstancesCollapsibleContent {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
