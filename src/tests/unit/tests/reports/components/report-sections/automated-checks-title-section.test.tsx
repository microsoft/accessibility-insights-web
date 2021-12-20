// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { AutomatedChecksTitleSection } from 'reports/components/report-sections/automated-checks-title-section';

describe('AutomatedChecksTitleSection', () => {
    it('renders', () => {
        const wrapped = shallow(<AutomatedChecksTitleSection />);
        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
