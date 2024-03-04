// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';
import { FastPassResultsTitleSection } from 'reports/components/report-sections/fast-pass-results-title-section';

describe('FastPassResultsTitleSection', () => {
    it('renders', () => {
        const wrapped = render(<FastPassResultsTitleSection title="Test title" />);
        expect(wrapped.asFragment()).toMatchSnapshot();
    });
});
