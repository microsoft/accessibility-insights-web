// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { OverviewHeading } from '../../../../../../DetailsView/components/overview-content/overview-heading';

describe('OverviewHeading', () => {
    test('match snapshot', () => {
        const wrapper = shallow(<OverviewHeading introText={'This is an intro!'} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
