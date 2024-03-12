// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { ScanMetadata, ToolData } from 'common/types/store-data/unified-data-interface';
import * as React from 'react';
import { FooterText } from 'reports/components/report-sections/footer-text';
import { ToolLink } from '../../../../../../reports/components/report-sections/tool-link';
import { mockReactComponents } from '../../../../mock-helpers/mock-module-helpers';

jest.mock('../../../../../../reports/components/report-sections/tool-link');
describe('FooterText', () => {
    mockReactComponents([ToolLink]);
    it('renders', () => {
        const toolData: ToolData = {
            scanEngineProperties: {
                name: 'engine-name',
                version: 'engine-version',
            },
            applicationProperties: {
                name: 'app-name',
                version: 'app-version',
                environmentName: 'environmentName',
            },
        };
        const scanMetadata = {
            toolData,
        } as ScanMetadata;

        const renderResult = render(<FooterText {...{ scanMetadata }} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
