// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { NewTabLink } from 'common/components/new-tab-link';
import * as React from 'react';

import { FooterSection } from 'reports/components/report-sections/footer-section';
import { mockReactComponents } from 'tests/unit/mock-helpers/mock-module-helpers';

jest.mock('common/components/new-tab-link');
describe('FooterSection', () => {
    mockReactComponents([NewTabLink]);
    it('renders', () => {
        const wrapper = render(<FooterSection />);

        expect(wrapper.asFragment()).toMatchSnapshot();
    });
});
