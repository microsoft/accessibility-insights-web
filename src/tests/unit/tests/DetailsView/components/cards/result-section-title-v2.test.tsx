// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { ResultSectionTitleV2, ResultSectionTitleV2Props } from '../../../../../../DetailsView/components/cards/result-section-title-v2';

describe('ResultSectionTitleV2', () => {
    it('renders', () => {
        const props: ResultSectionTitleV2Props = {
            title: 'test title',
            badgeCount: 10,
            outcomeType: 'pass',
        };

        const wrapped = shallow(<ResultSectionTitleV2 {...props} />);
        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
