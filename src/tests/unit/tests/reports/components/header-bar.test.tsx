// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';
import { HeaderBar } from 'reports/components/header-bar';
import { BrandWhite } from '../../../../../icons/brand/white/brand-white';
import { mockReactComponents } from '../../../mock-helpers/mock-module-helpers';
jest.mock('../../../../../icons/brand/white/brand-white');

describe('HeaderBar', () => {
    mockReactComponents([BrandWhite]);
    it('renders', () => {
        const headerText = 'header text';
        const renderResult = render(<HeaderBar headerText={headerText} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
