// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { OverviewHeading } from '../../../../../../DetailsView/components/overview-content/overview-heading';

describe('OverviewHeading', () => {
    test('match snapshot', () => {
        const getIntroComponentStub = () => <div>INTRO COMPONENT</div>;
        const wrapper = shallow(<OverviewHeading getIntroComponent={getIntroComponentStub} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
