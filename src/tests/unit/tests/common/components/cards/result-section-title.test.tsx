// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ResultSectionTitle, ResultSectionTitleProps } from 'common/components/cards/result-section-title';
import { shallow } from 'enzyme';
import * as React from 'react';

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
