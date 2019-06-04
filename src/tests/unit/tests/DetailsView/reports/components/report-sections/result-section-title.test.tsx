// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import {
    ResultSectionTitle,
    ResultSectionTitlePros,
} from '../../../../../../../DetailsView/reports/components/report-sections/result-section-title';

describe('ResultSectionTitle', () => {
    it('renders', () => {
        const props: ResultSectionTitlePros = {
            title: 'test title',
            count: 10,
            outcomeType: 'pass',
        };

        const wrapped = shallow(<ResultSectionTitle {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
