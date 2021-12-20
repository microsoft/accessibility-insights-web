// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { FastPassResultsTitleSection } from 'reports/components/report-sections/fast-pass-results-title-section';

describe('FastPassResultsTitleSection', () => {
    it('renders', () => {
        const wrapped = shallow(<FastPassResultsTitleSection title="Test title" />);
        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
