// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import * as React from 'react';
import { ReporterHeaderSection } from 'reports/components/report-sections/reporter-header-section';
import { HeaderSection } from '../../../../../../reports/components/report-sections/header-section';
import { mockReactComponents } from '../../../../mock-helpers/mock-module-helpers';

jest.mock('../../../../../../reports/components/report-sections/header-section');
describe('ReporterHeaderSection', () => {
    mockReactComponents([HeaderSection]);
    it('renders', () => {
        const targetAppInfo = {
            name: 'page-title',
            url: 'url://page',
        };
        const scanMetadata = {
            targetAppInfo,
        } as ScanMetadata;
        const renderResult = render(<ReporterHeaderSection scanMetadata={scanMetadata} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
