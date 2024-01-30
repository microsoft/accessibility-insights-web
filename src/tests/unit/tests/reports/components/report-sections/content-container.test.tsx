// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { shallow } from 'enzyme';
import * as React from 'react';

import { ContentContainer } from 'reports/components/report-sections/content-container';

describe('ContentContainer', () => {
    it('renders', () => {
        const children: JSX.Element[] = [
            <div key="1">1</div>,
            <div key="2" id="2">
                2
            </div>,
        ];

        const wrapped = render(<ContentContainer>{children}</ContentContainer>);

        expect(wrapped.asFragment()).toMatchSnapshot();
    });
});
