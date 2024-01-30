// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';
import { BodySection } from 'reports/components/report-sections/body-section';

describe('BodySection', () => {
    it('renders', () => {
        const children: JSX.Element[] = [
            <div key="1">1</div>,
            <div key="2" id="2">
                2
            </div>
        ];

        const wrapped = render(<BodySection>{children}</BodySection>);
        expect(wrapped).toMatchSnapshot();
    });
});
