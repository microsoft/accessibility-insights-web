// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';

import { FooterSection } from 'reports/components/report-sections/footer-section';

describe('FooterSection', () => {
    it('renders', () => {
        const wrapper = render(<FooterSection />);

        expect(wrapper.asFragment()).toMatchSnapshot();
    });
});
