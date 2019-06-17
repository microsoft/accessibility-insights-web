// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { ContentContainer } from '../../../../../../../DetailsView/reports/components/report-sections/content-container';

describe('ContentContainer', () => {
    it('renders', () => {
        const children: JSX.Element[] = [<div>1</div>, <div id="2">2</div>];

        const wrapped = shallow(<ContentContainer>{children}</ContentContainer>);

        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
