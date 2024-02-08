// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import * as React from 'react';
import { AutomatedChecksHeaderSection } from 'reports/components/report-sections/automated-checks-header-section';
import { HeaderSection } from 'reports/components/report-sections/header-section';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from 'tests/unit/mock-helpers/mock-module-helpers';

jest.mock('reports/components/report-sections/header-section');

describe('AutomatedChecksHeaderSection', () => {
    mockReactComponents([HeaderSection]);
    it('renders', () => {
        const targetAppInfo = {
            name: 'page-title',
            url: 'url://page',
        };
        const scanMetadata = {
            targetAppInfo,
        } as ScanMetadata;
        render(<AutomatedChecksHeaderSection scanMetadata={scanMetadata} />);
        expectMockedComponentPropsToMatchSnapshots([HeaderSection]);
    });
});
