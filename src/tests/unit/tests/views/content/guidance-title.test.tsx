// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { productName } from 'content/strings/application';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { mockReactComponents } from 'tests/unit/mock-helpers/mock-module-helpers';
import { GuidanceTitle } from 'views/content/guidance-title';

jest.mock('react-helmet-async');

describe('guidance title', () => {
    mockReactComponents([Helmet]);
    test('has correct structure', () => {
        const renderResult = render(<GuidanceTitle name={'test'} />);
        expect(renderResult.getByText(`Guidance for test - ${productName}`)).not.toBeNull();
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
