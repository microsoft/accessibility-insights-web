// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';
import { FastPassTitleSection } from 'reports/components/report-sections/fast-pass-title-section';

describe('FastPassTitleSection', () => {
    it('renders', () => {
        const wrapped = render(<FastPassTitleSection />);
        expect(wrapped.asFragment()).toMatchSnapshot();
    });
});
