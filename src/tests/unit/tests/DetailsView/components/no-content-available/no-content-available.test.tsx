// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { NoContentAvailable } from 'DetailsView/components/no-content-available/no-content-available';
import * as React from 'react';

describe('NoContentAvailable', () => {
    it('renders stale view for default', () => {
        const renderResult = render(<NoContentAvailable />);

        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
