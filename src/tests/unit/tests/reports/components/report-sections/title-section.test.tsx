// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { TitleSection } from 'reports/components/report-sections/title-section';

describe('TitleSection', () => {
    it('renders', () => {
        const wrapped = shallow(<TitleSection />);
        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
