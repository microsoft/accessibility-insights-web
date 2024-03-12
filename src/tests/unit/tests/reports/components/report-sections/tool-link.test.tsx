// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';
import { ToolLink } from 'reports/components/report-sections/tool-link';
import { NewTabLink } from '../../../../../../common/components/new-tab-link';
import { mockReactComponents } from '../../../../mock-helpers/mock-module-helpers';
jest.mock('../../../../../../common/components/new-tab-link');

describe('ToolLink', () => {
    mockReactComponents([NewTabLink]);
    it('renders', () => {
        const renderResult = render(<ToolLink />);

        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
