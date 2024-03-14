// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';
import { HeaderSection } from 'reports/components/report-sections/header-section';
import { HeaderBar } from '../../../../../../reports/components/header-bar';
import { NewTabLinkWithConfirmationDialog } from '../../../../../../reports/components/new-tab-link-confirmation-dialog';
import { mockReactComponents } from '../../../../mock-helpers/mock-module-helpers';

jest.mock('../../../../../../reports/components/header-bar');
jest.mock('../../../../../../reports/components/new-tab-link-confirmation-dialog');
describe('HeaderSection', () => {
    mockReactComponents([HeaderBar, NewTabLinkWithConfirmationDialog]);
    it('renders', () => {
        const targetAppInfo = {
            name: 'page-title',
            url: 'url://page',
        };
        const renderResult = render(
            <HeaderSection targetAppInfo={targetAppInfo} headerText={'some header text'} />,
        );
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
