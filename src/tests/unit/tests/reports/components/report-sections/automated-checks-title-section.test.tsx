// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';
import { AutomatedChecksTitleSection } from 'reports/components/report-sections/automated-checks-title-section';

describe('AutomatedChecksTitleSection', () => {
    it('renders', () => {
        const wrapped = render(<AutomatedChecksTitleSection />);
        expect(wrapped.asFragment()).toMatchSnapshot();
    });
});
