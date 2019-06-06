// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { ResultsContainer } from '../../../../../../../DetailsView/reports/components/report-sections/results-container';

describe('ResultsContainer', () => {
    it('renders', () => {
        const children: JSX.Element[] = [<div>1</div>, <div id="2">2</div>];

        const wrapped = shallow(<ResultsContainer>{children}</ResultsContainer>);

        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
