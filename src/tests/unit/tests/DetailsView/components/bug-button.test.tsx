// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { BugButton } from '../../../../../DetailsView/components/bug-button';

describe('BugButtonTest', () => {
    test('render new bug button', () => {
        const wrapper = shallow(<BugButton />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
