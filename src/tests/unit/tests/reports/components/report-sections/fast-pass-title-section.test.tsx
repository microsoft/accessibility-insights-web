// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { FastPassTitleSection } from 'reports/components/report-sections/fast-pass-title-section';

describe('FastPassTitleSection', () => {
    it('renders', () => {
        const wrapped = shallow(<FastPassTitleSection />);
        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
