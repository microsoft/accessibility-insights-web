// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { ResultSectionTitle, ResultSectionTitleProps } from '../../../../../../DetailsView/components/cards/result-section-title';

describe('ResultSectionTitle', () => {
    it('renders', () => {
        const props: ResultSectionTitleProps = {
            title: 'test title',
            badgeCount: 10,
            outcomeType: 'pass',
        };

        const wrapped = shallow(<ResultSectionTitle {...props} />);
        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
